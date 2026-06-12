use super::transport_trait::{TransportDescriptor, TransportStatus};

pub fn descriptor() -> TransportDescriptor {
    TransportDescriptor {
        id: "bluetooth-pairing".into(),
        name: "Bluetooth Pairing".into(),
        transport_type: "bluetooth-pairing".into(),
        status: TransportStatus::Planned,
        description: "Planned for pairing/signaling only. Bluetooth is not treated as a high-quality video transport.".into(),
    }
}
