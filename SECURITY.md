# Security Policy

LensBridge is local-first by design.

## Current Model

- No account system.
- No telemetry.
- No cloud relay by default.
- No video recording by default.
- No stream storage.
- Pairing uses random session tokens with expiry.
- Invalid or expired sessions are rejected by the local signaling server.

## Reporting Vulnerabilities

Please open a private security advisory on GitHub or email the maintainer if private disclosure is needed. Include:

- A short summary.
- Reproduction steps.
- Expected and actual behavior.
- Affected platform and version.

## Future Hardening

Planned work includes local TLS with mkcert, trusted device allowlists, certificate pinning, password-authenticated pairing, and richer audit logs.
