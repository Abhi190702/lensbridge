# Architecture

LensBridge is a pnpm monorepo.

- `apps/desktop`: Tauri shell, React UI, Rust pairing/session/signaling.
- `apps/phone`: PWA camera source.
- `packages/shared`: shared protocol types.
- `packages/plugin-sdk`: future plugin contracts.
- `drivers`: OS-specific virtual camera setup docs/scripts.

V1 keeps WebRTC in browser engines and uses Rust for local native responsibilities.

Current implemented media path:

```text
Phone PWA -> local WebSocket signaling -> WebRTC media -> Desktop preview / OBS Output Mode
```

The OBS Output Mode is a same-window capture layout. It uses the existing desktop `MediaStream`, hides app chrome, and
renders a simple muted HTML video element on a solid background so OBS Window Capture does not include QR cards, sidebar,
topbar, or status information.

Current external webcam path:

```text
LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera -> browser/app camera picker
```

LensBridge does not currently register an OS-level camera device.
