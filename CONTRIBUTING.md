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
