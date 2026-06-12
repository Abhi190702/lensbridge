use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum VirtualDeviceStatus {
    PreviewOnly,
    Available,
    Planned,
    MissingDependency,
    Failed,
}

pub trait VirtualDevice {
    fn name(&self) -> &'static str;
    fn status(&self) -> VirtualDeviceStatus;
    fn setup_hint(&self) -> &'static str;
}
