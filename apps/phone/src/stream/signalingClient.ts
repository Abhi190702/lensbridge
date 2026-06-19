import type { PairingPayload, SignalingEnvelope, SignalingMessage, SignalingRole } from "@lensbridge/shared";

type MessageHandler = (message: SignalingMessage, envelope: SignalingEnvelope) => void | Promise<void>;

export class SignalingClient {
  private socket: WebSocket | null = null;
  private handlers = new Set<MessageHandler>();

  constructor(
    private readonly pairing: PairingPayload,
    private readonly role: SignalingRole
  ) {}

  connect(): Promise<void> {
    const url = new URL(this.pairing.signalingUrl);
    url.searchParams.set("sessionId", this.pairing.sessionId);
    url.searchParams.set("token", this.pairing.token);
    url.searchParams.set("role", this.role);

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      this.socket = socket;
      socket.onopen = () => resolve();
      socket.onerror = () => reject(new Error("Could not connect to LensBridge Desktop signaling server."));
      socket.onmessage = (event) => {
        const envelope = JSON.parse(String(event.data)) as SignalingEnvelope;
        if (envelope.from === this.role) return;
        for (const handler of this.handlers) {
          void handler(envelope.message, envelope);
        }
      };
    });
  }

  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  send(message: SignalingMessage) {
    if (this.socket?.readyState !== WebSocket.OPEN) return;
    this.socket.send(
      JSON.stringify({
        from: this.role,
        to: this.role === "phone" ? "desktop" : "phone",
        message,
        sentAt: new Date().toISOString()
      } satisfies SignalingEnvelope)
    );
  }

  close() {
    this.socket?.close();
    this.handlers.clear();
  }
}
