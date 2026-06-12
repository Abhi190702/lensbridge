use super::source_trait::{baseline_video_capabilities, SourceDescriptor, SourceDriver, SourceStatus};

pub struct IpCameraRtspSource;

impl SourceDriver for IpCameraRtspSource {
    fn descriptor(&self) -> SourceDescriptor {
        let mut capabilities = baseline_video_capabilities();
        capabilities.supports_focus = false;
        capabilities.supports_zoom = false;
        capabilities.supports_torch = false;
        capabilities.supports_ptz = true;
        SourceDescriptor {
            id: "ip-camera-rtsp".into(),
            name: "IP Camera RTSP".into(),
            source_type: "ip-camera-rtsp".into(),
            status: SourceStatus::Planned,
            capabilities,
            roadmap: "Planned V3 RTSP/ONVIF ingest. Not implemented in current MVP.".into(),
        }
    }

    fn connect(&self) -> Result<(), String> {
        Err("ip-camera-rtsp is planned for V3".into())
    }

    fn disconnect(&self) -> Result<(), String> {
        Ok(())
    }
}
