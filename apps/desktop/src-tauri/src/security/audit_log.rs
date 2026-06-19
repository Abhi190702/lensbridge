use crate::errors::{LensBridgeError, LensBridgeResult};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::{
    fs,
    path::{Path, PathBuf},
    sync::RwLock,
};

use super::allowlist::security_data_dir;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SecurityAuditEvent {
    pub id: String,
    pub kind: String,
    pub device_id: Option<String>,
    pub label: Option<String>,
    pub message: String,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct SecurityAuditFile {
    events: Vec<SecurityAuditEvent>,
}

pub struct SecurityAuditLog {
    path: PathBuf,
    events: RwLock<Vec<SecurityAuditEvent>>,
}

impl SecurityAuditLog {
    pub fn new_default() -> Self {
        Self::with_path(security_data_dir().join("security-audit.json"))
    }

    pub fn with_path(path: PathBuf) -> Self {
        Self {
            events: RwLock::new(load_events(&path)),
            path,
        }
    }

    pub fn list_recent(&self, limit: usize) -> Vec<SecurityAuditEvent> {
        let mut events = self
            .events
            .read()
            .expect("security audit lock poisoned")
            .clone();
        events.sort_by(|left, right| right.created_at.cmp(&left.created_at));
        events.truncate(limit);
        events
    }

    pub fn record(
        &self,
        kind: impl Into<String>,
        device_id: Option<String>,
        label: Option<String>,
        message: impl Into<String>,
    ) -> LensBridgeResult<SecurityAuditEvent> {
        let now = Utc::now().to_rfc3339();
        let event = SecurityAuditEvent {
            id: format!(
                "audit-{}",
                Utc::now().timestamp_nanos_opt().unwrap_or_default()
            ),
            kind: kind.into(),
            device_id,
            label,
            message: message.into(),
            created_at: now,
        };

        let mut events = self.events.write().expect("security audit lock poisoned");
        events.push(event.clone());
        if events.len() > 200 {
            let keep_from = events.len() - 200;
            events.drain(0..keep_from);
        }
        save_events(&self.path, &events)?;
        Ok(event)
    }
}

fn load_events(path: &Path) -> Vec<SecurityAuditEvent> {
    let Ok(raw) = fs::read_to_string(path) else {
        return Vec::new();
    };

    serde_json::from_str::<SecurityAuditFile>(&raw)
        .map(|file| file.events)
        .unwrap_or_default()
}

fn save_events(path: &Path, events: &[SecurityAuditEvent]) -> LensBridgeResult<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|err| {
            LensBridgeError::new(
                "security_audit_write_failed",
                "Could not create LensBridge security data directory.",
            )
            .with_detail(err.to_string())
        })?;
    }

    let body = serde_json::to_string_pretty(&SecurityAuditFile {
        events: events.to_vec(),
    })
    .map_err(|err| {
        LensBridgeError::new(
            "security_audit_serialize_failed",
            "Could not serialize security audit events.",
        )
        .with_detail(err.to_string())
    })?;

    fs::write(path, body).map_err(|err| {
        LensBridgeError::new(
            "security_audit_write_failed",
            "Could not write security audit log.",
        )
        .with_detail(err.to_string())
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn records_and_reloads_security_events() {
        let path = std::env::temp_dir().join(format!(
            "lensbridge-audit-{}.json",
            Utc::now().timestamp_nanos_opt().unwrap_or_default()
        ));
        let log = SecurityAuditLog::with_path(path.clone());
        log.record(
            "pairing-requested",
            Some("phone-1".into()),
            Some("Phone".into()),
            "Pairing requested.",
        )
        .expect("record");

        let reloaded = SecurityAuditLog::with_path(path);
        let events = reloaded.list_recent(10);
        assert_eq!(events.len(), 1);
        assert_eq!(events[0].kind, "pairing-requested");
    }
}
