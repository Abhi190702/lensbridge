use super::virtual_device_trait::{VirtualDevice, VirtualDeviceStatus};

pub struct LinuxV4l2Loopback;

impl VirtualDevice for LinuxV4l2Loopback {
    fn name(&self) -> &'static str {
        "LensBridge Cam"
    }

    fn status(&self) -> VirtualDeviceStatus {
        VirtualDeviceStatus::Planned
    }

    fn setup_hint(&self) -> &'static str {
        "Run drivers/linux/setup-v4l2loopback.sh. Frame piping is V2 work."
    }
}
