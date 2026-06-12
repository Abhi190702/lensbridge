# Architecture

LensBridge is a pnpm monorepo.

- `apps/desktop`: Tauri shell, React UI, Rust pairing/session/signaling.
- `apps/phone`: PWA camera source.
- `packages/shared`: shared protocol types.
- `packages/plugin-sdk`: future plugin contracts.
- `drivers`: OS-specific virtual camera setup docs/scripts.

V1 keeps WebRTC in browser engines and uses Rust for local native responsibilities.
