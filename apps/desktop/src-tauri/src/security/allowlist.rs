use crate::errors::{LensBridgeError, LensBridgeResult};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::{
    fs,
    path::{Path, PathBuf},
    sync::RwLock,
};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TrustedDeviceRecord {
    pub device_id: String,
    pub label: String,
    pub platform: Option<String>,
    pub user_agent: Option<String>,
    pub fingerprint: String,
    pub trusted_at: String,
    pub last_seen_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct TrustedDeviceFile {
    devices: Vec<TrustedDeviceRecord>,
}

pub struct TrustedDeviceStore {
    path: PathBuf,
    devices: RwLock<Vec<TrustedDeviceRecord>>,
}

impl TrustedDeviceStore {
    pub fn new_default() -> Self {
        Self::with_path(security_data_dir().join("trusted-devices.json"))
    }

    pub fn with_path(path: PathBuf) -> Self {
        let devices = load_devices(&path);
        Self {
            path,
            devices: RwLock::new(devices),
        }
    }

    pub fn list(&self) -> Vec<TrustedDeviceRecord> {
        self.devices
            .read()
            .expect("trusted device lock poisoned")
            .clone()
    }

    pub fn is_trusted(&self, device_id: &str) -> bool {
        self.devices
            .read()
            .expect("trusted device lock poisoned")
            .iter()
            .any(|device| device.device_id == device_id)
    }

    pub fn trust(
        &self,
        device_id: String,
        label: String,
        platform: Option<String>,
        user_agent: Option<String>,
    ) -> LensBridgeResult<TrustedDeviceRecord> {
        let now = Utc::now().to_rfc3339();
        let fingerprint = device_fingerprint(&device_id);
        let mut devices = self.devices.write().expect("trusted device lock poisoned");

        if let Some(existing) = devices
            .iter_mut()
            .find(|device| device.device_id == device_id)
        {
            existing.label = label;
            existing.platform = platform;
            existing.user_agent = user_agent;
            existing.last_seen_at = Some(now.clone());
            let record = existing.clone();
            save_devices(&self.path, &devices)?;
            return Ok(record);
        }

        let record = TrustedDeviceRecord {
            device_id,
            label,
            platform,
            user_agent,
            fingerprint,
            trusted_at: now.clone(),
            last_seen_at: Some(now),
        };
        devices.push(record.clone());
        save_devices(&self.path, &devices)?;
        Ok(record)
    }

    pub fn mark_seen(&self, device_id: &str) -> LensBridgeResult<()> {
        let mut devices = self.devices.write().expect("trusted device lock poisoned");
        if let Some(existing) = devices
            .iter_mut()
            .find(|device| device.device_id == device_id)
        {
            existing.last_seen_at = Some(Utc::now().to_rfc3339());
            save_devices(&self.path, &devices)?;
        }
        Ok(())
    }

    pub fn revoke(&self, device_id: &str) -> LensBridgeResult<bool> {
        let mut devices = self.devices.write().expect("trusted device lock poisoned");
        let original_len = devices.len();
        devices.retain(|device| device.device_id != device_id);
        let removed = devices.len() != original_len;
        if removed {
            save_devices(&self.path, &devices)?;
        }
        Ok(removed)
    }
}

fn load_devices(path: &Path) -> Vec<TrustedDeviceRecord> {
    let Ok(raw) = fs::read_to_string(path) else {
        return Vec::new();
    };

    serde_json::from_str::<TrustedDeviceFile>(&raw)
        .map(|file| file.devices)
        .unwrap_or_default()
}

fn save_devices(path: &Path, devices: &[TrustedDeviceRecord]) -> LensBridgeResult<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|err| {
            LensBridgeError::new(
                "trusted_devices_write_failed",
                "Could not create LensBridge security data directory.",
            )
            .with_detail(err.to_string())
        })?;
    }

    let body = serde_json::to_string_pretty(&TrustedDeviceFile {
        devices: devices.to_vec(),
    })
    .map_err(|err| {
        LensBridgeError::new(
            "trusted_devices_serialize_failed",
            "Could not serialize trusted devices.",
        )
        .with_detail(err.to_string())
    })?;

    fs::write(path, body).map_err(|err| {
        LensBridgeError::new(
            "trusted_devices_write_failed",
            "Could not write trusted devices.",
        )
        .with_detail(err.to_string())
    })
}

pub fn security_data_dir() -> PathBuf {
    if let Ok(path) = std::env::var("LENSBRIDGE_SECURITY_DIR") {
        return PathBuf::from(path);
    }

    if let Ok(app_data) = std::env::var("APPDATA") {
        return PathBuf::from(app_data).join("LensBridge");
    }

    if let Ok(xdg_state_home) = std::env::var("XDG_STATE_HOME") {
        return PathBuf::from(xdg_state_home).join("lensbridge");
    }

    if let Ok(home) = std::env::var("HOME") {
        return PathBuf::from(home)
            .join(".local")
            .join("state")
            .join("lensbridge");
    }

    std::env::temp_dir().join("lensbridge")
}

fn device_fingerprint(device_id: &str) -> String {
    let hash = fnv1a32(device_id);
    format!("{hash:08x}")
}

fn fnv1a32(value: &str) -> u32 {
    let mut hash = 0x811c9dc5_u32;
    for byte in value.as_bytes() {
        hash ^= u32::from(*byte);
        hash = hash.wrapping_mul(0x01000193);
    }
    hash
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn saves_loads_and_revokes_trusted_devices() {
        let path = test_path("trusted-devices");
        let store = TrustedDeviceStore::with_path(path.clone());

        let record = store
            .trust(
                "phone-1".into(),
                "Abhi phone".into(),
                Some("Android".into()),
                None,
            )
            .expect("trust device");

        assert_eq!(record.fingerprint.len(), 8);
        assert!(store.is_trusted("phone-1"));

        let reloaded = TrustedDeviceStore::with_path(path);
        assert_eq!(reloaded.list().len(), 1);
        assert!(reloaded.revoke("phone-1").expect("revoke"));
        assert!(!reloaded.is_trusted("phone-1"));
    }

    #[test]
    fn corrupt_allowlist_loads_as_empty() {
        let path = test_path("trusted-devices-corrupt");
        fs::create_dir_all(path.parent().expect("parent")).expect("mkdir");
        fs::write(&path, "{not-json").expect("write corrupt");

        let store = TrustedDeviceStore::with_path(path);

        assert!(store.list().is_empty());
    }

    fn test_path(name: &str) -> PathBuf {
        std::env::temp_dir().join(format!(
            "lensbridge-{name}-{}.json",
            Utc::now().timestamp_nanos_opt().unwrap_or_default()
        ))
    }
}
