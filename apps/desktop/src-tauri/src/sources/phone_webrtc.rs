use super::source_trait::{baseline_video_capabilities, SourceDescriptor, SourceDriver, SourceStatus};

pub struct PhoneWebRtcSource;

impl SourceDriver for PhoneWebRtcSource {
    fn descriptor(&self) -> SourceDescriptor {
        SourceDescriptor {
            id: "phone-webrtc".into(),
            name: "Phone Camera".into(),
            source_type: "phone-webrtc".into(),
            status: SourceStatus::Available,
            capabilities: baseline_video_capabilities(),
            roadmap: "Implemented in V1 through phone PWA + WebRTC preview.".into(),
        }
    }

    fn connect(&self) -> Result<(), String> {
        Ok(())
    }

    fn disconnect(&self) -> Result<(), String> {
        Ok(())
    }
}
