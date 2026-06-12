use super::source_trait::{baseline_video_capabilities, SourceDescriptor, SourceDriver, SourceStatus};

pub struct ObsSource;

impl SourceDriver for ObsSource {
    fn descriptor(&self) -> SourceDescriptor {
        let mut capabilities = baseline_video_capabilities();
        capabilities.supports_focus = false;
        capabilities.supports_zoom = false;
        capabilities.supports_torch = false;
        SourceDescriptor {
            id: "obs-source".into(),
            name: "OBS Source".into(),
            source_type: "obs-source".into(),
            status: SourceStatus::Planned,
            capabilities,
            roadmap: "Planned V3 integration. OBS Virtual Camera fallback docs are available today.".into(),
        }
    }

    fn connect(&self) -> Result<(), String> {
        Err("obs-source ingest is planned for V3".into())
    }

    fn disconnect(&self) -> Result<(), String> {
        Ok(())
    }
}
