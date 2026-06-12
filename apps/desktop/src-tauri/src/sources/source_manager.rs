use super::{
    desktop_webrtc::DesktopWebRtcSource, ip_camera_rtsp::IpCameraRtspSource, obs_source::ObsSource,
    phone_webrtc::PhoneWebRtcSource, screen_capture::ScreenCaptureSource, source_trait::{SourceDescriptor, SourceDriver},
};

pub struct SourceManager {
    drivers: Vec<Box<dyn SourceDriver + Send + Sync>>,
}

impl Default for SourceManager {
    fn default() -> Self {
        Self {
            drivers: vec![
                Box::new(PhoneWebRtcSource),
                Box::new(DesktopWebRtcSource),
                Box::new(IpCameraRtspSource),
                Box::new(ObsSource),
                Box::new(ScreenCaptureSource),
            ],
        }
    }
}

impl SourceManager {
    pub fn list(&self) -> Vec<SourceDescriptor> {
        self.drivers.iter().map(|driver| driver.descriptor()).collect()
    }
}
