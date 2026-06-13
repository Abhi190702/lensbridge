# Getting Started

Install dependencies:

```bash
pnpm install
```

Run phone:

```bash
pnpm --filter @lensbridge/phone dev -- --host 0.0.0.0
```

Run desktop:

```bash
pnpm --filter @lensbridge/desktop tauri dev
```

V1 pairs phone and desktop through a local signaling server. Mobile camera access requires a secure context; LAN HTTP testing may be blocked by some browsers until local HTTPS/WSS is added.

## Windows Camera Output

LensBridge V2 can register a DirectShow camera named `LensBridge Camera`.

1. Open PowerShell as Administrator.
2. Run `pnpm install:windows-camera`.
3. Restart Chrome or your meeting app.
4. Start LensBridge Desktop and connect your phone.
5. Select `LensBridge Camera` in the target app.

Use `TEST-CAMERAS.html` to test the camera without OBS.

OBS Output Mode is still available as a fallback when the DirectShow path is not installed or a target app refuses virtual DirectShow devices.
