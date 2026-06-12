use super::transport_trait::{TransportDescriptor, TransportStatus};

pub fn descriptor() -> TransportDescriptor {
    TransportDescriptor {
        id: "wifi-webrtc".into(),
        name: "Wi-Fi WebRTC".into(),
        transport_type: "wifi-webrtc".into(),
        status: TransportStatus::Available,
        description: "Primary V1 local network transport.".into(),
    }
}
