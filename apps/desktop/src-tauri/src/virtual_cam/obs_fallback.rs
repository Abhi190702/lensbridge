use super::virtual_device_trait::{VirtualDevice, VirtualDeviceStatus};

pub struct ObsFallback;

impl VirtualDevice for ObsFallback {
    fn name(&self) -> &'static str {
        "OBS Virtual Camera"
    }

    fn status(&self) -> VirtualDeviceStatus {
        VirtualDeviceStatus::Planned
    }

    fn setup_hint(&self) -> &'static str {
        "Use OBS Virtual Camera as the Windows/macOS fallback while native drivers are planned."
    }
}
