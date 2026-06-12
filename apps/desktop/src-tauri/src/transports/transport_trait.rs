use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum TransportStatus {
    Available,
    Planned,
    Experimental,
    Connected,
    Disconnected,
    Failed,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TransportDescriptor {
    pub id: String,
    pub name: String,
    pub transport_type: String,
    pub status: TransportStatus,
    pub description: String,
}
