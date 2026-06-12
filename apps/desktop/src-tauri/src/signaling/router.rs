use super::messages::SignalingEnvelope;
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct SignalingHub {
    tx: broadcast::Sender<SignalingEnvelope>,
}

impl SignalingHub {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(128);
        Self { tx }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<SignalingEnvelope> {
        self.tx.subscribe()
    }

    pub fn broadcast(&self, envelope: SignalingEnvelope) {
        let _ = self.tx.send(envelope);
    }
}
