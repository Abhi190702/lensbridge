use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "kebab-case")]
pub enum SignalingRole {
    Desktop,
    Phone,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignalingEnvelope {
    pub from: SignalingRole,
    pub to: Option<SignalingRole>,
    pub message: serde_json::Value,
    pub sent_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_id: Option<String>,
}
