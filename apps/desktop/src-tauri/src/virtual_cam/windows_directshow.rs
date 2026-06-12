use super::virtual_device_trait::{VirtualDevice, VirtualDeviceStatus};

pub struct WindowsDirectShow;

impl VirtualDevice for WindowsDirectShow {
    fn name(&self) -> &'static str {
        "LensBridge Cam for Windows"
    }

    fn status(&self) -> VirtualDeviceStatus {
        VirtualDeviceStatus::Planned
    }

    fn setup_hint(&self) -> &'static str {
        "Planned native DirectShow device. V1 does not install a Windows camera driver."
    }
}
