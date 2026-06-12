# Pairing Flow

1. Desktop creates a session ID and token.
2. Desktop displays a QR code containing a base64url pairing payload.
3. Phone decodes the payload.
4. Phone connects to the local signaling server with `sessionId`, `token`, and `role=phone`.
5. Desktop webview connects with `role=desktop`.
6. The signaling server validates tokens and relays WebRTC messages.
