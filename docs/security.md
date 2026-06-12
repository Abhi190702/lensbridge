# Security

LensBridge V1 is local-first.

## What It Processes

- Camera frames in the phone browser.
- WebRTC media between phone and desktop.
- Session/token metadata for pairing.

## What It Does Not Collect

- Accounts.
- Telemetry.
- Cloud video.
- Recordings.
- Persistent connection history.

## Threat Model

V1 assumes a trusted local network. Random tokens reduce accidental joins, but local HTTPS/WSS, certificate pinning, and trusted device allowlists are planned for stronger hostile-network protection.
