use crate::{
    network::{local_ip::detect_local_ip, ports::find_available_port},
    pairing::{qr_payload::PairingPayload, session::SessionManager},
    signaling::{router::SignalingHub, server::SignalingServer},
};
use serde::Serialize;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub session_manager: Arc<SessionManager>,
    pub signaling_hub: SignalingHub,
    pub local_host: String,
    pub signaling_port: u16,
    pub desktop_name: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeStatus {
    pub local_host: String,
    pub signaling_port: u16,
    pub desktop_name: String,
}

impl AppState {
    pub fn new() -> Self {
        let local_host = detect_local_ip().unwrap_or_else(|| "127.0.0.1".to_string());
        let signaling_port = find_available_port(48173);
        let desktop_name = std::env::var("COMPUTERNAME")
            .or_else(|_| std::env::var("HOSTNAME"))
            .unwrap_or_else(|_| "LensBridge Desktop".to_string());
        let session_manager = Arc::new(SessionManager::new(
            desktop_name.clone(),
            local_host.clone(),
            signaling_port,
        ));

        Self {
            session_manager,
            signaling_hub: SignalingHub::new(),
            local_host,
            signaling_port,
            desktop_name,
        }
    }

    pub fn start_signaling_server(&self) {
        let server = SignalingServer::new(
            self.signaling_port,
            self.session_manager.clone(),
            self.signaling_hub.clone(),
        );

        tauri::async_runtime::spawn(async move {
            if let Err(error) = server.run().await {
                eprintln!("LensBridge signaling server failed: {error}");
            }
        });
    }

    pub fn runtime_status(&self) -> RuntimeStatus {
        RuntimeStatus {
            local_host: self.local_host.clone(),
            signaling_port: self.signaling_port,
            desktop_name: self.desktop_name.clone(),
        }
    }

    pub fn pairing_payload(&self) -> PairingPayload {
        self.session_manager.current_payload()
    }

    pub fn regenerate_pairing_payload(&self) -> PairingPayload {
        self.session_manager.regenerate()
    }
}
