use super::transport_trait::{TransportDescriptor, TransportStatus};

pub fn descriptor() -> TransportDescriptor {
    TransportDescriptor {
        id: "usb-adb".into(),
        name: "USB / ADB".into(),
        transport_type: "usb-adb".into(),
        status: TransportStatus::Planned,
        description: "Planned low-latency Android fallback. Not implemented in V1.".into(),
    }
}
