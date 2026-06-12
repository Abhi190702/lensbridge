use serde::Serialize;
use std::{error::Error, fmt};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LensBridgeError {
    pub code: String,
    pub message: String,
    pub technical_detail: Option<String>,
    pub suggested_fix: Option<String>,
}

impl LensBridgeError {
    pub fn new(code: impl Into<String>, message: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            message: message.into(),
            technical_detail: None,
            suggested_fix: None,
        }
    }

    pub fn with_detail(mut self, detail: impl Into<String>) -> Self {
        self.technical_detail = Some(detail.into());
        self
    }

    pub fn with_fix(mut self, fix: impl Into<String>) -> Self {
        self.suggested_fix = Some(fix.into());
        self
    }
}

impl fmt::Display for LensBridgeError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}: {}", self.code, self.message)
    }
}

impl Error for LensBridgeError {}

pub type LensBridgeResult<T> = Result<T, LensBridgeError>;
