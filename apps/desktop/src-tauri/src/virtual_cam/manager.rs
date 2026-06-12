use super::virtual_device_trait::VirtualDeviceStatus;
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VirtualCameraStatus {
    pub output_name: String,
    pub platform: String,
    pub status: VirtualDeviceStatus,
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
            output_name: "LensBridge Cam".into(),
            platform: std::env::consts::OS.into(),
            status: VirtualDeviceStatus::PreviewOnly,
            message: "V1 provides desktop preview. OS virtual camera output is V2.".into(),
        }
    }
}
