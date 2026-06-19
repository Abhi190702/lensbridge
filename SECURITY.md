# Security Policy

LensBridge is local-first by design.

## Current Model

- No account system.
- No telemetry.
- No cloud relay by default.
- No video recording by default.
- No stream storage.
- Pairing uses random session tokens with expiry.
- Unknown phones require explicit desktop approval before WebRTC starts.
- The phone and desktop show a matching short pairing code.
- Trusted phones can be stored in a local desktop allowlist and revoked later.
- A local audit log records pairing approvals, rejections, trust, and revocation events.
- Invalid or expired sessions are rejected by the local signaling server.

## Current Limitations

- Development mode may use HTTP/WS on a trusted LAN.
- Local TLS/mkcert mode is planned but not yet a completed production security path.
- Trusted-device identity currently uses a stable local phone device ID rather than a public-key credential.

## Reporting Vulnerabilities

Please open a private security advisory on GitHub or email the maintainer if private disclosure is needed. Include:

- A short summary.
- Reproduction steps.
- Expected and actual behavior.
- Affected platform and version.

## Future Hardening

Planned work includes local TLS with mkcert, certificate pinning, public-key trusted-device credentials, password-authenticated pairing, and release provenance hardening.
