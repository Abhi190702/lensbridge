# Security Model

LensBridge is local-first.

V1 security controls:

- Random pairing tokens.
- Token expiry.
- Session verification before WebSocket relay.
- No cloud by default.
- No telemetry.
- No video storage.

Future controls:

- TLS with mkcert.
- Trusted device allowlist.
- Certificate pinning.
- Password-authenticated pairing.
- Audit log export.
