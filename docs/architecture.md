# Architecture

LensBridge is a pnpm monorepo.

- `apps/desktop`: Tauri shell, React UI, Rust pairing/session/signaling.
- `apps/phone`: PWA camera source.
- `packages/shared`: shared protocol types.
- `packages/plugin-sdk`: future plugin contracts.
- `drivers`: OS-specific virtual camera setup docs/scripts.

LensBridge currently keeps WebRTC in browser engines and uses Rust for local native responsibilities.

Current implemented media path:

```text
Phone PWA -> local WebSocket signaling -> desktop approval -> WebRTC media -> Desktop preview -> LensBridge Camera
```

On Windows, `LensBridge Camera` is a DirectShow device registered through UnityCapture. The desktop app draws the existing
WebRTC `MediaStream` to a throttled canvas and sends RGBA frames into Rust. Rust writes those frames into UnityCapture's
named shared-memory objects.

Pairing is gated:

- The phone sends `hello` with a stable local device ID and a short pairing code.
- The desktop checks the trusted-device allowlist.
- Unknown devices require approve/reject from the desktop before the phone sends a WebRTC offer.
- Trusted devices can be auto-approved and can be revoked from the Security page.

The Direct Windows Camera panel exposes frame-pump metrics for benchmark runs: delivered frames, dropped frames, average send duration, and p95 send duration.

OBS fallback path:

```text
LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera -> browser/app camera picker
```

The OBS Output Mode is a same-window capture layout. It uses the existing desktop `MediaStream`, hides app chrome, and
renders a simple muted HTML video element on a solid background so OBS Window Capture does not include QR cards, sidebar,
topbar, or status information.

Additional maps:

- [frame-pipeline.md](frame-pipeline.md)
- [security-architecture.md](security-architecture.md)
- [performance.md](performance.md)
