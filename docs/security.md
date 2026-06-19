# Security

LensBridge is local-first and now requires explicit desktop approval before an unknown phone can start WebRTC.

## What It Processes

- Camera frames in the phone browser.
- WebRTC media between phone and desktop.
- Session/token metadata for pairing.
- Phone device metadata used for approval: stable local device ID, label, platform, and user-agent hint.

## What It Does Not Collect

- Accounts.
- Telemetry.
- Cloud video.
- Recordings.
- Hidden background capture.

## Implemented Protections

- Random session IDs and tokens.
- Pairing link expiry.
- WebRTC DTLS-SRTP media encryption.
- Desktop approval gate for unknown phones.
- Matching six-digit pairing code on phone and desktop.
- Trusted-device allowlist stored locally on the desktop.
- Trusted-device revocation in the Security page.
- Local security audit log for pairing and trust events.

## Trusted Device Storage

Trusted device and audit files are stored under the LensBridge local app data directory, or under `LENSBRIDGE_SECURITY_DIR` when that environment variable is set for tests/development.

The allowlist stores a stable phone device ID and metadata. It does not store raw pairing tokens.

## Current Limitations

- Development mode may still use HTTP/WS on a trusted LAN.
- Local TLS/mkcert support is planned/config-gated work, not a completed production security claim.
- Trusted devices currently use a stable local phone ID rather than an asymmetric key pair.
- The project does not yet claim hostile-network hardening.

## Threat Model

LensBridge protects against accidental or opportunistic LAN joins when a QR/link leaks briefly. It assumes the desktop user can visually approve or reject unknown devices. Use plain HTTP/WS development mode only on a trusted local network.

See also [security-architecture.md](security-architecture.md).
