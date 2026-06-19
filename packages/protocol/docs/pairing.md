# Pairing

The desktop app generates:

- `sessionId`
- `token`
- `expiresAt`
- local host and signaling port

The QR code contains a base64url JSON payload. The phone PWA decodes it and connects to the desktop's local signaling server.

Current flow:

1. The phone opens the QR link and connects to the local signaling socket.
2. The phone sends a device identity and a six-digit pairing code.
3. LensBridge Desktop displays an approval request.
4. The desktop user approves once, trusts the device, or rejects it.
5. Only after approval does the phone send the WebRTC offer.

Expired pairing links must be regenerated from the desktop app. An already-active camera stream is not stopped only because the QR countdown reaches zero.
