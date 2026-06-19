# Contributing to LensBridge

Thanks for helping build a local-first camera bridge that people can actually trust.

## Setup

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm check:rust
```

Run the apps:

```bash
pnpm --filter @lensbridge/phone dev -- --host 0.0.0.0
pnpm --filter @lensbridge/desktop tauri dev
```

## Where To Start

- Phone capture and WebRTC sender: `apps/phone/src/camera`, `apps/phone/src/stream`.
- Desktop receiver and signaling UI: `apps/desktop/src/hooks/useDesktopEvents.ts`.
- Direct Windows camera frame pump: `apps/desktop/src/hooks/useUnityCaptureBridge.ts`.
- Rust frame bridge: `apps/desktop/src-tauri/src/virtual_cam`.
- Pairing/session/security state: `apps/desktop/src-tauri/src/pairing`, `apps/desktop/src-tauri/src/security`.
- Shared wire types: `packages/shared/src`.
- Architecture docs: `docs/architecture.md`, `docs/frame-pipeline.md`, `docs/security-architecture.md`.

## Runtime Architecture Map

```text
Phone PWA -> local signaling -> desktop approval -> WebRTC -> desktop preview
          -> canvas frame pump -> Tauri raw IPC -> Rust -> virtual camera backend
```

The Windows backend is implemented through DirectShow/UnityCapture. Linux v4l2loopback and macOS CoreMediaIO must remain marked scaffolded/planned until frame output is verified.

## Frame Pipeline Checklist

- Keep the video path latest-frame-wins.
- Track dropped frames and send timing when changing the pump.
- Update `BENCHMARKS.md` when adding or changing benchmark scenarios.
- Do not claim zero-copy or native performance unless a native path exists and benchmark results are committed.

## Pairing And Security Lifecycle

1. Phone scans QR and sends `hello` with a stable local device ID.
2. Desktop checks the trusted-device allowlist.
3. Unknown devices require desktop approval.
4. Phone sends WebRTC offer only after `pairing-approved`.
5. Security events are recorded in the local audit log.

When changing this flow, add tests for approval, rejection, expiry, corrupt allowlist files, and revocation where practical.

## Platform Backend Checklist

- Gate platform-specific Rust code with `cfg`.
- Keep Windows builds working when adding Linux/macOS modules.
- Add setup/test scripts under `drivers/<platform>`.
- Mark backend status as Implemented, Experimental, Scaffolded, or Planned in docs.

## Branches and Commits

- Use short, descriptive branches such as `feature/phone-reconnect` or `fix/pairing-expiry`.
- Keep commits focused.
- Prefer clear commit messages over clever ones.

## Pull Requests

Every PR should include:

- What changed.
- Why it changed.
- Screenshots or screen recordings for UI work.
- The checks you ran.
- Any feature flags or unsupported platforms.

## Adding a Source Driver

1. Read `docs/source-drivers.md`.
2. Add shared capability types if needed in `packages/shared`.
3. Add a Rust scaffold under `apps/desktop/src-tauri/src/sources`.
4. Add UI copy that clearly marks the source as stable, experimental, or planned.
5. Add docs and tests.

## Honesty Rule

Do not mark a feature as supported until a user can run it. Planned, experimental, and scaffolded features are welcome, but they must be labeled that way.

## PR Honesty Checklist

- Did you update docs in the same PR?
- Did you avoid unsupported platform claims?
- Did you run TypeScript and Rust checks?
- Did you add or update tests for new logic?
- Did you document benchmark results or explicitly mark them as not run?
