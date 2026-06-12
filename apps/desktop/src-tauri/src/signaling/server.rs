use super::{
    messages::{SignalingEnvelope, SignalingRole},
    router::SignalingHub,
};
use crate::{
    errors::{LensBridgeError, LensBridgeResult},
    pairing::{session::SessionManager, token::random_token},
};
use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Query, State,
    },
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use futures_util::{SinkExt, StreamExt};
use serde::Deserialize;
use serde_json::json;
use std::{net::SocketAddr, sync::Arc};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
pub struct SignalingServer {
    port: u16,
    session_manager: Arc<SessionManager>,
    hub: SignalingHub,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SignalQuery {
    session_id: String,
    token: String,
    role: SignalingRole,
}

impl SignalingServer {
    pub fn new(port: u16, session_manager: Arc<SessionManager>, hub: SignalingHub) -> Self {
        Self {
            port,
            session_manager,
            hub,
        }
    }

    pub async fn run(self) -> LensBridgeResult<()> {
        let state = Arc::new(self);
        let app = Router::new()
            .route("/health", get(health))
            .route("/signal", get(signal))
            .layer(CorsLayer::permissive())
            .with_state(state.clone());

        let addr = SocketAddr::from(([0, 0, 0, 0], state.port));
        let listener = TcpListener::bind(addr)
            .await
            .map_err(|err| LensBridgeError::new("signaling-bind-failed", "Could not start local signaling server.").with_detail(err.to_string()))?;

        axum::serve(listener, app)
            .await
            .map_err(|err| LensBridgeError::new("signaling-server-failed", "Local signaling server stopped unexpectedly.").with_detail(err.to_string()))
    }
}

async fn health(State(state): State<Arc<SignalingServer>>) -> Json<serde_json::Value> {
    Json(json!({
        "ok": true,
        "name": "LensBridge Signaling",
        "port": state.port
    }))
}

async fn signal(
    ws: WebSocketUpgrade,
    State(state): State<Arc<SignalingServer>>,
    Query(query): Query<SignalQuery>,
) -> impl IntoResponse {
    if !state.session_manager.validate(&query.session_id, &query.token) {
        return (
            StatusCode::UNAUTHORIZED,
            "Invalid or expired LensBridge pairing session.",
        )
            .into_response();
    }

    ws.on_upgrade(move |socket| handle_socket(socket, state, query.role))
        .into_response()
}

async fn handle_socket(socket: WebSocket, state: Arc<SignalingServer>, role: SignalingRole) {
    let client_id = random_token(16);
    let (mut sender, mut receiver) = socket.split();
    let mut rx = state.hub.subscribe();

    let outbound_client_id = client_id.clone();
    let outbound = tokio::spawn(async move {
        while let Ok(envelope) = rx.recv().await {
            if envelope.client_id.as_deref() == Some(outbound_client_id.as_str()) {
                continue;
            }

            match serde_json::to_string(&envelope) {
                Ok(payload) => {
                    if sender.send(Message::Text(payload)).await.is_err() {
                        break;
                    }
                }
                Err(error) => {
                    eprintln!("Could not serialize signaling envelope: {error}");
                }
            }
        }
    });

    while let Some(result) = receiver.next().await {
        match result {
            Ok(Message::Text(text)) => match serde_json::from_str::<SignalingEnvelope>(&text) {
                Ok(mut envelope) => {
                    envelope.from = role;
                    envelope.client_id = Some(client_id.clone());
                    state.hub.broadcast(envelope);
                }
                Err(error) => {
                    eprintln!("Invalid signaling envelope: {error}");
                }
            },
            Ok(Message::Close(_)) => break,
            Ok(_) => {}
            Err(error) => {
                eprintln!("Signaling socket error: {error}");
                break;
            }
        }
    }

    outbound.abort();
}
