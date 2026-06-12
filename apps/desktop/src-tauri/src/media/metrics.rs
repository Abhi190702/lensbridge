use serde::Serialize;

#[derive(Debug, Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaMetrics {
    pub fps: Option<f32>,
    pub bitrate_kbps: Option<u32>,
    pub latency_ms: Option<u32>,
    pub packet_loss: Option<f32>,
    pub jitter_ms: Option<f32>,
}
