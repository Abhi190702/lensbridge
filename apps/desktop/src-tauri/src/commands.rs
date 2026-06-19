use crate::{
    errors::LensBridgeResult,
    pairing::qr_payload::PairingPayload,
    security::{allowlist::TrustedDeviceRecord, audit_log::SecurityAuditEvent},
    sources::source_manager::SourceManager,
    state::{AppState, RuntimeStatus},
    virtual_cam::{
        manager::{ObsVirtualCameraStatus, VirtualCameraManager, VirtualCameraStatus},
        unity_capture::{UnityCaptureFramePayload, UnityCapturePublishResult},
    },
};
use tauri::ipc::{InvokeBody, Request};

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TrustDeviceRequest {
    pub device_id: String,
    pub label: String,
    pub platform: Option<String>,
    pub user_agent: Option<String>,
}

#[tauri::command]
pub fn get_pairing_session(state: tauri::State<'_, AppState>) -> LensBridgeResult<PairingPayload> {
    Ok(state.pairing_payload())
}

#[tauri::command]
pub fn regenerate_pairing_session(
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<PairingPayload> {
    Ok(state.regenerate_pairing_payload())
}

#[tauri::command]
pub fn get_runtime_status(state: tauri::State<'_, AppState>) -> LensBridgeResult<RuntimeStatus> {
    Ok(state.runtime_status())
}

#[tauri::command]
pub fn disconnect_session(state: tauri::State<'_, AppState>) -> LensBridgeResult<()> {
    state.session_manager.clear_active_device();
    Ok(())
}

#[tauri::command]
pub fn list_trusted_devices(
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<Vec<TrustedDeviceRecord>> {
    Ok(state.trusted_devices.list())
}

#[tauri::command]
pub fn is_trusted_device(
    device_id: String,
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<bool> {
    Ok(state.trusted_devices.is_trusted(&device_id))
}

#[tauri::command]
pub fn trust_device(
    request: TrustDeviceRequest,
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<TrustedDeviceRecord> {
    let record = state.trusted_devices.trust(
        request.device_id.clone(),
        request.label.clone(),
        request.platform,
        request.user_agent,
    )?;
    let _ = state.audit_log.record(
        "trusted-device-added",
        Some(request.device_id),
        Some(request.label),
        "Trusted device added.",
    );
    Ok(record)
}

#[tauri::command]
pub fn mark_trusted_device_seen(
    device_id: String,
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<()> {
    state.trusted_devices.mark_seen(&device_id)
}

#[tauri::command]
pub fn revoke_trusted_device(
    device_id: String,
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<bool> {
    let removed = state.trusted_devices.revoke(&device_id)?;
    if removed {
        let _ = state.audit_log.record(
            "trusted-device-revoked",
            Some(device_id),
            None,
            "Trusted device revoked.",
        );
    }
    Ok(removed)
}

#[tauri::command]
pub fn record_security_audit_event(
    kind: String,
    device_id: Option<String>,
    label: Option<String>,
    message: String,
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<SecurityAuditEvent> {
    state.audit_log.record(kind, device_id, label, message)
}

#[tauri::command]
pub fn list_security_audit_events(
    state: tauri::State<'_, AppState>,
) -> LensBridgeResult<Vec<SecurityAuditEvent>> {
    Ok(state.audit_log.list_recent(50))
}

#[tauri::command]
pub fn list_source_statuses(
) -> LensBridgeResult<Vec<crate::sources::source_trait::SourceDescriptor>> {
    Ok(SourceManager::default().list())
}

#[tauri::command]
pub fn get_virtual_camera_status() -> LensBridgeResult<VirtualCameraStatus> {
    Ok(VirtualCameraManager::default().status())
}

#[tauri::command]
pub fn get_obs_virtual_camera_status() -> LensBridgeResult<ObsVirtualCameraStatus> {
    Ok(VirtualCameraManager::default().obs_virtual_camera_status())
}

#[tauri::command]
pub fn publish_unity_capture_frame(
    frame: UnityCaptureFramePayload,
) -> LensBridgeResult<UnityCapturePublishResult> {
    crate::virtual_cam::unity_capture::publish_unity_capture_frame(frame)
}

#[tauri::command]
pub fn publish_unity_capture_frame_binary(
    request: Request<'_>,
) -> LensBridgeResult<UnityCapturePublishResult> {
    match request.body() {
        InvokeBody::Raw(payload) => {
            crate::virtual_cam::unity_capture::publish_unity_capture_frame_binary(payload)
        }
        InvokeBody::Json(_) => Err(crate::errors::LensBridgeError::new(
            "virtual_cam_bad_frame",
            "Binary frame command expected a raw IPC payload.",
        )),
    }
}

#[tauri::command]
pub fn reset_unity_capture_bridge() -> LensBridgeResult<()> {
    crate::virtual_cam::unity_capture::reset_unity_capture_bridge()
}
