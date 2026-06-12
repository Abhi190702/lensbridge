use super::{qr_payload::PairingPayload, token::random_token};
use chrono::{DateTime, Duration, Utc};
use std::sync::RwLock;

#[derive(Debug, Clone)]
pub struct PairingSession {
    pub session_id: String,
    pub token: String,
    pub expires_at: DateTime<Utc>,
    pub active_device: Option<String>,
}

pub struct SessionManager {
    desktop_name: String,
    host: String,
    port: u16,
    ttl: Duration,
    current: RwLock<PairingSession>,
}

impl SessionManager {
    pub fn new(desktop_name: String, host: String, port: u16) -> Self {
        let ttl = Duration::minutes(10);
        let current = RwLock::new(Self::new_session(ttl));

        Self {
            desktop_name,
            host,
            port,
            ttl,
            current,
        }
    }

    pub fn current_payload(&self) -> PairingPayload {
        if self.is_expired() {
            return self.regenerate();
        }

        self.current
            .read()
            .expect("session lock poisoned")
            .to_payload(&self.desktop_name, &self.host, self.port)
    }

    pub fn regenerate(&self) -> PairingPayload {
        let next = Self::new_session(self.ttl);
        let payload = next.to_payload(&self.desktop_name, &self.host, self.port);
        *self.current.write().expect("session lock poisoned") = next;
        payload
    }

    pub fn validate(&self, session_id: &str, token: &str) -> bool {
        let current = self.current.read().expect("session lock poisoned");
        current.session_id == session_id && current.token == token && current.expires_at > Utc::now()
    }

    pub fn clear_active_device(&self) {
        self.current
            .write()
            .expect("session lock poisoned")
            .active_device = None;
    }

    fn is_expired(&self) -> bool {
        self.current
            .read()
            .expect("session lock poisoned")
            .expires_at <= Utc::now()
    }

    fn new_session(ttl: Duration) -> PairingSession {
        PairingSession {
            session_id: random_token(24),
            token: random_token(48),
            expires_at: Utc::now() + ttl,
            active_device: None,
        }
    }
}

impl PairingSession {
    fn to_payload(&self, desktop_name: &str, host: &str, port: u16) -> PairingPayload {
        PairingPayload {
            app: "LensBridge".to_string(),
            version: "0.1".to_string(),
            desktop_name: desktop_name.to_string(),
            host: host.to_string(),
            port,
            session_id: self.session_id.clone(),
            token: self.token.clone(),
            expires_at: self.expires_at,
            transport: "wifi-webrtc".to_string(),
            secure: false,
            signaling_url: format!("ws://{host}:{port}/signal"),
            phone_url: None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::SessionManager;

    #[test]
    fn validates_current_session() {
        let manager = SessionManager::new("dev".into(), "127.0.0.1".into(), 48173);
        let payload = manager.current_payload();
        assert!(manager.validate(&payload.session_id, &payload.token));
    }

    #[test]
    fn rejects_wrong_token() {
        let manager = SessionManager::new("dev".into(), "127.0.0.1".into(), 48173);
        let payload = manager.current_payload();
        assert!(!manager.validate(&payload.session_id, "wrong"));
    }
}
