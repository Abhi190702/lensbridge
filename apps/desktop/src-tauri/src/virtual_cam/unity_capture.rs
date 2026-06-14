use crate::errors::LensBridgeResult;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UnityCaptureFramePayload {
    pub width: u32,
    pub height: u32,
    pub rgba_base64: String,
    pub mirror: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UnityCapturePublishResult {
    pub ready: bool,
    pub delivered: bool,
    pub skipped_frame: bool,
    pub frames_delivered: u64,
    pub width: u32,
    pub height: u32,
    pub message: String,
}

pub fn publish_unity_capture_frame(
    payload: UnityCaptureFramePayload,
) -> LensBridgeResult<UnityCapturePublishResult> {
    #[cfg(target_os = "windows")]
    {
        windows_bridge::publish(payload)
    }

    #[cfg(not(target_os = "windows"))]
    {
        let _ = payload;
        Ok(UnityCapturePublishResult {
            ready: false,
            delivered: false,
            skipped_frame: false,
            frames_delivered: 0,
            width: 0,
            height: 0,
            message: "UnityCapture DirectShow output is only available on Windows.".into(),
        })
    }
}

pub fn reset_unity_capture_bridge() -> LensBridgeResult<()> {
    #[cfg(target_os = "windows")]
    {
        windows_bridge::reset();
    }

    Ok(())
}

#[cfg(target_os = "windows")]
mod windows_bridge {
    use super::{UnityCaptureFramePayload, UnityCapturePublishResult};
    use crate::errors::{LensBridgeError, LensBridgeResult};
    use base64::{engine::general_purpose, Engine};
    use std::{
        ptr::{null, null_mut},
        sync::{Mutex, OnceLock},
    };
    use windows_sys::Win32::{
        Foundation::{CloseHandle, GetLastError, HANDLE, WAIT_OBJECT_0},
        Storage::FileSystem::SYNCHRONIZE,
        System::{
            Memory::{
                MapViewOfFile, OpenFileMappingW, UnmapViewOfFile, FILE_MAP_WRITE,
                MEMORY_MAPPED_VIEW_ADDRESS,
            },
            Threading::{
                CreateEventW, OpenEventW, OpenMutexW, ReleaseMutex, SetEvent, WaitForSingleObject,
                EVENT_MODIFY_STATE,
            },
        },
    };

    const HEADER_BYTES: usize = 32;
    const FORMAT_UINT8_RGBA: i32 = 0;
    const RESIZE_LINEAR: i32 = 1;
    const MIRROR_DISABLED: i32 = 0;
    const MIRROR_HORIZONTAL: i32 = 1;
    const FRAME_TIMEOUT_MS: i32 = 1000;
    const MAX_SHARED_IMAGE_SIZE: usize = 3840 * 2160 * 4 * 2;

    static BRIDGE: OnceLock<Mutex<UnityCaptureBridge>> = OnceLock::new();

    pub fn publish(
        payload: UnityCaptureFramePayload,
    ) -> LensBridgeResult<UnityCapturePublishResult> {
        let expected_len = payload
            .width
            .checked_mul(payload.height)
            .and_then(|pixels| pixels.checked_mul(4))
            .ok_or_else(|| {
                LensBridgeError::new(
                    "virtual_cam_frame_too_large",
                    "Frame dimensions are too large.",
                )
            })? as usize;

        if payload.width == 0 || payload.height == 0 {
            return Err(LensBridgeError::new(
                "virtual_cam_bad_frame",
                "Frame dimensions must be greater than zero.",
            ));
        }

        let rgba = general_purpose::STANDARD
            .decode(payload.rgba_base64.as_bytes())
            .map_err(|err| {
                LensBridgeError::new(
                    "virtual_cam_bad_frame",
                    "Could not decode RGBA frame payload.",
                )
                .with_detail(err.to_string())
            })?;

        if rgba.len() != expected_len {
            return Err(LensBridgeError::new(
                "virtual_cam_bad_frame",
                "RGBA frame size does not match width and height.",
            )
            .with_detail(format!("expected {expected_len} bytes, got {}", rgba.len())));
        }

        let bridge = BRIDGE.get_or_init(|| Mutex::new(UnityCaptureBridge::default()));
        let mut bridge = bridge.lock().map_err(|_| {
            LensBridgeError::new(
                "virtual_cam_bridge_locked",
                "UnityCapture bridge is busy. Try again in a moment.",
            )
        })?;

        match bridge.publish(payload.width, payload.height, payload.mirror, &rgba) {
            Ok(result) => Ok(result),
            Err(UnityCaptureSendError::TooLarge(message)) => Err(LensBridgeError::new(
                "virtual_cam_frame_too_large",
                "Frame is larger than UnityCapture can accept.",
            )
            .with_detail(message)),
            Err(UnityCaptureSendError::NotReady(message))
            | Err(UnityCaptureSendError::Windows(message)) => {
                Ok(waiting_result(payload.width, payload.height, message))
            }
        }
    }

    pub fn reset() {
        if let Some(bridge) = BRIDGE.get() {
            if let Ok(mut bridge) = bridge.lock() {
                bridge.reset();
            }
        }
    }

    fn waiting_result(
        width: u32,
        height: u32,
        message: impl Into<String>,
    ) -> UnityCapturePublishResult {
        UnityCapturePublishResult {
            ready: false,
            delivered: false,
            skipped_frame: false,
            frames_delivered: 0,
            width,
            height,
            message: message.into(),
        }
    }

    struct UnityCaptureBridge {
        senders: Vec<UnityCaptureSender>,
    }

    impl Default for UnityCaptureBridge {
        fn default() -> Self {
            Self {
                senders: UnityCaptureNames::first_device_candidates()
                    .into_iter()
                    .map(UnityCaptureSender::new)
                    .collect(),
            }
        }
    }

    impl UnityCaptureBridge {
        fn publish(
            &mut self,
            width: u32,
            height: u32,
            mirror: bool,
            rgba: &[u8],
        ) -> Result<UnityCapturePublishResult, UnityCaptureSendError> {
            let mut delivered_count = 0usize;
            let mut frames_delivered = 0u64;
            let mut skipped_frame = false;
            let mut delivered_labels = Vec::new();
            let mut last_waiting_message = None;

            for sender in &mut self.senders {
                let had_partial_state = sender.has_partial_state();
                match sender.send(width, height, mirror, rgba) {
                    Ok(result) => {
                        delivered_count += 1;
                        frames_delivered = frames_delivered.max(result.frames_delivered);
                        skipped_frame |= result.skipped_frame;
                        delivered_labels.push(sender.label().to_string());
                    }
                    Err(UnityCaptureSendError::TooLarge(message)) => {
                        return Err(UnityCaptureSendError::TooLarge(message));
                    }
                    Err(UnityCaptureSendError::NotReady(message))
                    | Err(UnityCaptureSendError::Windows(message)) => {
                        if sender.has_partial_state() || had_partial_state {
                            last_waiting_message = Some(format!("{}: {message}", sender.label()));
                        }
                    }
                }
            }

            if delivered_count == 0 {
                return Ok(waiting_result(
                    width,
                    height,
                    last_waiting_message.unwrap_or_else(|| {
                        "LensBridge Camera is open, but its shared-memory receiver is not ready yet. Keep the camera preview open for a few seconds.".into()
                    }),
                ));
            }

            let receiver_label = match delivered_labels.as_slice() {
                [label] => label.clone(),
                labels => format!("{} receiver slots", labels.len()),
            };

            Ok(UnityCapturePublishResult {
                ready: true,
                delivered: true,
                skipped_frame,
                frames_delivered,
                width,
                height,
                message: if skipped_frame {
                    format!(
                        "Frame delivered to LensBridge Camera ({receiver_label}). The receiver is naturally throttling some frames."
                    )
                } else {
                    format!("Frame delivered to LensBridge Camera ({receiver_label}).")
                },
            })
        }

        fn reset(&mut self) {
            for sender in &mut self.senders {
                sender.reset_handles();
            }
        }
    }

    struct UnityCaptureNames {
        label: String,
        mutex: Vec<u16>,
        want: Vec<u16>,
        sent: Vec<u16>,
        data: Vec<u16>,
    }

    impl UnityCaptureNames {
        fn first_device_candidates() -> Vec<Self> {
            let mut candidates = vec![Self::new(
                "legacy slot",
                "UnityCapture_Mutx",
                "UnityCapture_Want",
                "UnityCapture_Sent",
                "UnityCapture_Data",
            )];

            for slot in '0'..='9' {
                candidates.push(Self::new(
                    &format!("slot {slot}"),
                    &format!("UnityCapture_Mutx{slot}"),
                    &format!("UnityCapture_Want{slot}"),
                    &format!("UnityCapture_Sent{slot}"),
                    &format!("UnityCapture_Data{slot}"),
                ));
            }

            candidates
        }

        fn new(label: &str, mutex: &str, want: &str, sent: &str, data: &str) -> Self {
            Self {
                label: label.into(),
                mutex: wide_null(mutex),
                want: wide_null(want),
                sent: wide_null(sent),
                data: wide_null(data),
            }
        }
    }

    struct UnityCaptureSender {
        label: String,
        names: UnityCaptureNames,
        mutex: HANDLE,
        want_event: HANDLE,
        sent_event: HANDLE,
        shared_file: HANDLE,
        shared_view: *mut u8,
        frames_delivered: u64,
    }

    unsafe impl Send for UnityCaptureSender {}

    impl UnityCaptureSender {
        fn new(names: UnityCaptureNames) -> Self {
            Self {
                label: names.label.clone(),
                names,
                mutex: null_mut(),
                want_event: null_mut(),
                sent_event: null_mut(),
                shared_file: null_mut(),
                shared_view: null_mut(),
                frames_delivered: 0,
            }
        }

        fn label(&self) -> &str {
            &self.label
        }

        fn has_partial_state(&self) -> bool {
            !self.mutex.is_null()
                || !self.want_event.is_null()
                || !self.sent_event.is_null()
                || !self.shared_file.is_null()
                || !self.shared_view.is_null()
        }

        fn send(
            &mut self,
            width: u32,
            height: u32,
            mirror: bool,
            rgba: &[u8],
        ) -> Result<UnityCapturePublishResult, UnityCaptureSendError> {
            if rgba.len() > MAX_SHARED_IMAGE_SIZE {
                return Err(UnityCaptureSendError::TooLarge(format!(
                    "{} bytes exceeds UnityCapture max shared image size {MAX_SHARED_IMAGE_SIZE}.",
                    rgba.len()
                )));
            }

            self.ensure_open()?;

            unsafe {
                let wait = WaitForSingleObject(self.mutex, 250);
                if wait != WAIT_OBJECT_0 {
                    return Err(UnityCaptureSendError::Windows(
                        "Timed out while locking UnityCapture shared memory.".into(),
                    ));
                }
                let _mutex_guard = MutexReleaseGuard(self.mutex);

                let max_size = read_u32(self.shared_view, 0) as usize;
                if max_size == 0 {
                    return Err(UnityCaptureSendError::NotReady(
                        "LensBridge Camera shared memory is open but not initialized yet.".into(),
                    ));
                }

                if rgba.len() > max_size {
                    return Err(UnityCaptureSendError::TooLarge(format!(
                        "{} bytes exceeds mapped UnityCapture capacity {max_size}.",
                        rgba.len()
                    )));
                }

                write_i32(self.shared_view, 4, width as i32);
                write_i32(self.shared_view, 8, height as i32);
                write_i32(self.shared_view, 12, width as i32);
                write_i32(self.shared_view, 16, FORMAT_UINT8_RGBA);
                write_i32(self.shared_view, 20, RESIZE_LINEAR);
                write_i32(
                    self.shared_view,
                    24,
                    if mirror {
                        MIRROR_HORIZONTAL
                    } else {
                        MIRROR_DISABLED
                    },
                );
                write_i32(self.shared_view, 28, FRAME_TIMEOUT_MS);

                std::ptr::copy_nonoverlapping(
                    rgba.as_ptr(),
                    self.shared_view.add(HEADER_BYTES),
                    rgba.len(),
                );
            }

            unsafe {
                if SetEvent(self.sent_event) == 0 {
                    return Err(last_windows_error(
                        "Could not signal UnityCapture frame delivery.",
                    ));
                }
                let skipped_frame = WaitForSingleObject(self.want_event, 0) != WAIT_OBJECT_0;
                self.frames_delivered += 1;

                Ok(UnityCapturePublishResult {
                    ready: true,
                    delivered: true,
                    skipped_frame,
                    frames_delivered: self.frames_delivered,
                    width,
                    height,
                    message: if skipped_frame {
                        "Frame delivered. Receiver did not request every frame, so LensBridge is throttling naturally.".into()
                    } else {
                        "Frame delivered to LensBridge Camera.".into()
                    },
                })
            }
        }

        fn ensure_open(&mut self) -> Result<(), UnityCaptureSendError> {
            unsafe {
                if self.mutex.is_null() {
                    self.mutex = OpenMutexW(SYNCHRONIZE, 0, self.names.mutex.as_ptr());
                    if self.mutex.is_null() {
                        return Err(UnityCaptureSendError::NotReady(
                            "LensBridge Camera has not been opened by a receiving app yet.".into(),
                        ));
                    }
                }

                let wait = WaitForSingleObject(self.mutex, 500);
                if wait != WAIT_OBJECT_0 {
                    self.reset_handles();
                    return Err(UnityCaptureSendError::Windows(
                        "Timed out while opening the UnityCapture shared-memory mutex.".into(),
                    ));
                }
                let _mutex_guard = MutexReleaseGuard(self.mutex);

                if self.want_event.is_null() {
                    self.want_event = CreateEventW(null(), 0, 0, self.names.want.as_ptr());
                    if self.want_event.is_null() {
                        return Err(last_windows_error(
                            "Could not create UnityCapture want-frame event.",
                        ));
                    }
                }

                if self.sent_event.is_null() {
                    self.sent_event = OpenEventW(EVENT_MODIFY_STATE, 0, self.names.sent.as_ptr());
                    if self.sent_event.is_null() {
                        return Err(UnityCaptureSendError::NotReady(
                            "LensBridge Camera receiver is starting. Keep the target app camera preview open for a moment.".into(),
                        ));
                    }
                }

                if self.shared_file.is_null() {
                    self.shared_file =
                        OpenFileMappingW(FILE_MAP_WRITE, 0, self.names.data.as_ptr());
                    if self.shared_file.is_null() {
                        return Err(UnityCaptureSendError::NotReady(
                            "LensBridge Camera shared memory is not ready yet. Keep the target app camera preview open.".into(),
                        ));
                    }
                }

                if self.shared_view.is_null() {
                    self.shared_view =
                        MapViewOfFile(self.shared_file, FILE_MAP_WRITE, 0, 0, 0).Value as *mut u8;
                    if self.shared_view.is_null() {
                        return Err(last_windows_error(
                            "Could not map UnityCapture shared memory.",
                        ));
                    }
                }
            }

            Ok(())
        }

        fn reset_handles(&mut self) {
            unsafe {
                if !self.shared_view.is_null() {
                    UnmapViewOfFile(MEMORY_MAPPED_VIEW_ADDRESS {
                        Value: self.shared_view as _,
                    });
                    self.shared_view = null_mut();
                }
                if !self.shared_file.is_null() {
                    CloseHandle(self.shared_file);
                    self.shared_file = null_mut();
                }
                if !self.sent_event.is_null() {
                    CloseHandle(self.sent_event);
                    self.sent_event = null_mut();
                }
                if !self.want_event.is_null() {
                    CloseHandle(self.want_event);
                    self.want_event = null_mut();
                }
                if !self.mutex.is_null() {
                    CloseHandle(self.mutex);
                    self.mutex = null_mut();
                }
            }
        }
    }

    impl Drop for UnityCaptureSender {
        fn drop(&mut self) {
            self.reset_handles();
        }
    }

    struct MutexReleaseGuard(HANDLE);

    impl Drop for MutexReleaseGuard {
        fn drop(&mut self) {
            unsafe {
                ReleaseMutex(self.0);
            }
        }
    }

    #[derive(Debug)]
    enum UnityCaptureSendError {
        NotReady(String),
        TooLarge(String),
        Windows(String),
    }

    unsafe fn read_u32(base: *mut u8, offset: usize) -> u32 {
        std::ptr::read_unaligned(base.add(offset) as *const u32)
    }

    unsafe fn write_i32(base: *mut u8, offset: usize, value: i32) {
        std::ptr::write_unaligned(base.add(offset) as *mut i32, value);
    }

    fn last_windows_error(context: &str) -> UnityCaptureSendError {
        let code = unsafe { GetLastError() };
        UnityCaptureSendError::Windows(format!("{context} Windows error {code}."))
    }

    fn wide_null(value: &str) -> Vec<u16> {
        value.encode_utf16().chain(std::iter::once(0)).collect()
    }
}
