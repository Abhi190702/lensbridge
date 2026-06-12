use super::transport_trait::{TransportDescriptor, TransportStatus};

pub fn descriptor() -> TransportDescriptor {
    TransportDescriptor {
        id: "remote-turn".into(),
        name: "Remote TURN Relay".into(),
        transport_type: "remote-turn".into(),
        status: TransportStatus::Planned,
        description: "Optional self-hosted relay for future cross-network use. Disabled in V1.".into(),
    }
}
