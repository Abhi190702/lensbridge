use super::source_trait::{baseline_video_capabilities, SourceDescriptor, SourceDriver, SourceStatus};

pub struct ScreenCaptureSource;

impl SourceDriver for ScreenCaptureSource {
    fn descriptor(&self) -> SourceDescriptor {
        let mut capabilities = baseline_video_capabilities();
        capabilities.supports_focus = false;
        capabilities.supports_zoom = false;
        capabilities.supports_torch = false;
        SourceDescriptor {
            id: "screen-capture".into(),
            name: "Screen Capture".into(),
            source_type: "screen-capture".into(),
            status: SourceStatus::Planned,
            capabilities,
            roadmap: "Planned V3 source using browser getDisplayMedia or native capture APIs.".into(),
        }
    }

    fn connect(&self) -> Result<(), String> {
        Err("screen-capture is planned for V3".into())
    }

    fn disconnect(&self) -> Result<(), String> {
        Ok(())
    }
}
