#[derive(Debug, Clone)]
pub enum QualityProfile {
    LowLatency,
    Balanced,
    HighQuality,
    BatterySaver,
    Custom,
}
