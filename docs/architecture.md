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
Phone PWA -> local WebSocket signaling -> WebRTC media -> Desktop preview -> LensBridge Camera
```

On Windows, `LensBridge Camera` is a DirectShow device registered through UnityCapture. The desktop app draws the existing
WebRTC `MediaStream` to a throttled canvas and sends RGBA frames into Rust. Rust writes those frames into UnityCapture's
named shared-memory objects.

OBS fallback path:

```text
LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera -> browser/app camera picker
```

The OBS Output Mode is a same-window capture layout. It uses the existing desktop `MediaStream`, hides app chrome, and
renders a simple muted HTML video element on a solid background so OBS Window Capture does not include QR cards, sidebar,
topbar, or status information.
