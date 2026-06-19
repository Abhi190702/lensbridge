# Security Model

LensBridge is local-first.

V1 security controls:

- Random pairing tokens.
- Token expiry.
- Session verification before WebSocket relay.
- `hello-ack` validation before relaying client hello messages.
- Desktop approval before the phone can send a WebRTC offer.
- Local trusted-device allowlist.
- Local security audit log for pairing and trust events.
- No cloud by default.
- No telemetry.
- No video storage.

Future controls:

- TLS with mkcert.
- Certificate pinning.
- Password-authenticated pairing.
- Audit log export.
