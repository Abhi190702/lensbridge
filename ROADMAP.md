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

## V2 — OBS Output + Reliability

Goal: make the current phone-to-desktop stream reliably usable through OBS Virtual Camera without claiming a native camera device.

Implemented/current:

- Capture-safe OBS Output Mode.
- Honest OBS Virtual Camera guide for Windows/macOS.
- Reconnect hardening.
- Better metrics and diagnostics.

Planned:

- Linux v4l2loopback pipeline.
- FFmpeg/GStreamer frame bridge.

## V3 — Universal Source Expansion

Goal: bridge more than phones and research native virtual camera paths.

Planned:

- Another computer as source.
- RTSP/IP camera ingest.
- OBS source ingest.
- Screen capture source.
- Raspberry Pi camera source.
- Device/source manager UI.
- Native Windows DirectShow and macOS CoreMediaIO research, without claiming support before it works.

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

- Native Windows DirectShow driver.
- Native macOS CoreMediaIO driver.
- Bluetooth video transport.
- TURN/cloud relay.
- AI background blur.
- RTSP ingest.
- Production virtual microphone.
