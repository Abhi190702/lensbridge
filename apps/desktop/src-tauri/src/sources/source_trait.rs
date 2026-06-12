use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum SourceStatus {
    Available,
    Planned,
    Experimental,
    Connected,
    Disconnected,
    Failed,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SourceCapabilities {
    pub video: bool,
    pub audio: bool,
    pub resolutions: Vec<String>,
    pub frame_rates: Vec<u16>,
    pub supports_focus: bool,
    pub supports_zoom: bool,
    pub supports_torch: bool,
    pub supports_audio: bool,
    pub supports_ptz: bool,
    pub supports_hardware_encoding: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SourceDescriptor {
    pub id: String,
    pub name: String,
    pub source_type: String,
    pub status: SourceStatus,
    pub capabilities: SourceCapabilities,
    pub roadmap: String,
}

pub trait SourceDriver {
    fn descriptor(&self) -> SourceDescriptor;
    fn connect(&self) -> Result<(), String>;
    fn disconnect(&self) -> Result<(), String>;
}

pub fn baseline_video_capabilities() -> SourceCapabilities {
    SourceCapabilities {
        video: true,
        audio: false,
        resolutions: vec!["480p".into(), "720p".into(), "1080p".into()],
        frame_rates: vec![24, 30, 60],
        supports_focus: true,
        supports_zoom: true,
        supports_torch: true,
        supports_audio: false,
        supports_ptz: false,
        supports_hardware_encoding: true,
    }
}
