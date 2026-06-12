#[derive(Debug, Clone)]
pub struct MediaPipeline {
    pub status: &'static str,
}

impl MediaPipeline {
    pub fn v1_preview_only() -> Self {
        Self {
            status: "V1 preview path uses WebRTC in the desktop webview. Native frame pipeline is planned for V2.",
        }
    }
}
