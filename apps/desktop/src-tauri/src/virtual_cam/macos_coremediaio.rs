use super::virtual_device_trait::{VirtualDevice, VirtualDeviceStatus};

pub struct MacosCoreMediaIo;

impl VirtualDevice for MacosCoreMediaIo {
    fn name(&self) -> &'static str {
        "LensBridge Cam for macOS"
    }

    fn status(&self) -> VirtualDeviceStatus {
        VirtualDeviceStatus::Planned
    }

    fn setup_hint(&self) -> &'static str {
        "Planned V3/V4 native CoreMediaIO device. Not implemented in current MVP."
    }
}
