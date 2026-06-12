#[derive(Debug, Clone)]
pub struct MdnsAdvertiser {
    pub service_name: String,
}

impl MdnsAdvertiser {
    pub fn planned() -> Self {
        Self {
            service_name: "_lensbridge._tcp.local".to_string(),
        }
    }

    pub fn status(&self) -> &'static str {
        "Planned V2 feature. Not implemented in current MVP."
    }
}
