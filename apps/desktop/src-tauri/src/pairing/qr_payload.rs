use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PairingPayload {
    pub app: String,
    pub version: String,
    pub desktop_name: String,
    pub host: String,
    pub port: u16,
    pub session_id: String,
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub transport: String,
    pub secure: bool,
    pub signaling_url: String,
    pub phone_url: Option<String>,
}
