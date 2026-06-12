use super::source_trait::{baseline_video_capabilities, SourceDescriptor, SourceDriver, SourceStatus};

pub struct DesktopWebRtcSource;

impl SourceDriver for DesktopWebRtcSource {
    fn descriptor(&self) -> SourceDescriptor {
        let mut capabilities = baseline_video_capabilities();
        capabilities.supports_torch = false;
        SourceDescriptor {
            id: "desktop-webrtc".into(),
            name: "Another Computer".into(),
            source_type: "desktop-webrtc".into(),
            status: SourceStatus::Planned,
            capabilities,
            roadmap: "Planned V3 feature. Not implemented in current MVP.".into(),
        }
    }

    fn connect(&self) -> Result<(), String> {
        Err("desktop-webrtc is planned for V3".into())
    }

    fn disconnect(&self) -> Result<(), String> {
        Ok(())
    }
}
