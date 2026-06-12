#[derive(Debug, Clone)]
pub struct AppConfig {
    pub local_only: bool,
    pub default_quality: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            local_only: true,
            default_quality: "balanced".into(),
        }
    }
}
