# Roadmap

## V1 — Phone-to-Desktop MVP

Goal: scan/open a pairing link on the phone, allow camera access, and stream the camera to desktop preview over WebRTC.

Status:

- Monorepo setup.
- Tauri desktop shell.
- Phone PWA.
- Local session/token model.
- Local WebSocket signaling.
- Desktop preview architecture.
- Shared protocol types.

## V2 — Windows Camera Bridge + OBS Fallback

Goal: make the phone-to-desktop stream usable as `LensBridge Camera` on Windows, while keeping OBS Output Mode stable as
a fallback.

Implemented/current:

- Experimental Windows DirectShow output through UnityCapture.
- Tauri/Rust UnityCapture shared-memory publisher.
- Windows driver install/uninstall scripts.
- Standalone Chrome camera test page.
- Capture-safe OBS Output Mode.
- Honest OBS Virtual Camera guide for Windows/macOS.
- Reconnect hardening.
- Better metrics and diagnostics.
- Explicit pairing approval.
- Local trusted-device allowlist with revocation.
- Frame-pump benchmark protocol and UI counters.

Planned:

- Native receiver path that avoids WebView canvas readback and IPC pixel copies. This remains critical if benchmarks cannot sustain 720p30 for 10 minutes.
- Linux v4l2loopback pipeline.
- FFmpeg/GStreamer frame bridge.
- Local TLS/mkcert mode for HTTPS/WSS development and local use.

## V3 — Universal Source Expansion

Goal: bridge more than phones and harden native virtual camera performance.

Planned:

- Another computer as source.
- RTSP/IP camera ingest.
- OBS source ingest.
- Screen capture source.
- Raspberry Pi camera source.
- Device/source manager UI.
- Windows Media Foundation and macOS CoreMediaIO research, without claiming support before it works.

## V4 — AI + Plugin System

Goal: local processing and community extensibility.

Planned:

- Background blur.
- Auto-framing.
- Low-light enhancement.
- Video denoise.
- Plugin runtime loading.
- Source driver and video filter marketplace docs.

## Intentionally Not Claimed Yet

- Production-signed Windows Media Foundation camera.
- Native macOS CoreMediaIO driver.
- Bluetooth video transport.
- TURN/cloud relay.
- AI background blur.
- RTSP ingest.
- Production virtual microphone.
