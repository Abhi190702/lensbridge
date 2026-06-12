use super::transport_trait::{TransportDescriptor, TransportStatus};

pub fn descriptor() -> TransportDescriptor {
    TransportDescriptor {
        id: "wifi-direct".into(),
        name: "Wi-Fi Direct".into(),
        transport_type: "wifi-direct".into(),
        status: TransportStatus::Planned,
        description: "Planned travel mode for router-free local pairing.".into(),
    }
}
