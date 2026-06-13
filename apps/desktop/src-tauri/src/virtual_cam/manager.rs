use super::virtual_device_trait::VirtualDeviceStatus;
use serde::Serialize;
use std::process::Command;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VirtualCameraStatus {
    pub output_name: String,
    pub platform: String,
    pub status: VirtualDeviceStatus,
    pub message: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ObsVirtualCameraStatus {
    pub detected: bool,
    pub devices: Vec<String>,
    pub message: String,
}

pub struct VirtualCameraManager;

impl Default for VirtualCameraManager {
    fn default() -> Self {
        Self
    }
}

impl VirtualCameraManager {
    pub fn status(&self) -> VirtualCameraStatus {
        VirtualCameraStatus {
            output_name: "OBS Virtual Camera".into(),
            platform: std::env::consts::OS.into(),
            status: VirtualDeviceStatus::PreviewOnly,
            message: "LensBridge provides the live source. OBS Virtual Camera exposes it as a system camera.".into(),
        }
    }

    pub fn obs_virtual_camera_status(&self) -> ObsVirtualCameraStatus {
        #[cfg(target_os = "windows")]
        {
            return windows_obs_virtual_camera_status();
        }

        #[cfg(not(target_os = "windows"))]
        {
            ObsVirtualCameraStatus {
                detected: false,
                devices: Vec::new(),
                message: "Automatic camera-device detection is only implemented for Windows right now.".into(),
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn windows_obs_virtual_camera_status() -> ObsVirtualCameraStatus {
    let script = r#"
$devices = Get-CimInstance Win32_PnPEntity |
  Where-Object {
    $_.Name -and (
      $_.PNPClass -in @('Camera', 'Image') -or
      $_.Name -match 'Camera|Webcam|OBS|DroidCam|Iriun'
    )
  } |
  Select-Object -ExpandProperty Name
$devices -join "`n"
"#;

    let output = Command::new("powershell.exe")
        .args(["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script])
        .output();

    let Ok(output) = output else {
        return ObsVirtualCameraStatus {
            detected: false,
            devices: Vec::new(),
            message: "Could not inspect Windows camera devices. Start OBS Virtual Camera and check Chrome again.".into(),
        };
    };

    if !output.status.success() {
        return ObsVirtualCameraStatus {
            detected: false,
            devices: Vec::new(),
            message: "Windows camera-device inspection failed. Start OBS Virtual Camera, then restart Chrome.".into(),
        };
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let devices: Vec<String> = stdout
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(ToOwned::to_owned)
        .collect();
    let detected = devices
        .iter()
        .any(|device| device.to_ascii_lowercase().contains("obs"));

    ObsVirtualCameraStatus {
        detected,
        devices,
        message: if detected {
            "OBS Virtual Camera is visible to Windows. Start it in OBS, then refresh or restart Chrome.".into()
        } else {
            "OBS Virtual Camera is not visible to Windows. In OBS, click Start Virtual Camera, then restart Chrome.".into()
        },
    }
}
