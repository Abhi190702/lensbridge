# Pairing

The desktop app generates:

- `sessionId`
- `token`
- `expiresAt`
- local host and signaling port

The QR code contains a base64url JSON payload. The phone PWA decodes it and connects to the desktop's local signaling server.

Expired sessions must be regenerated from the desktop app.
