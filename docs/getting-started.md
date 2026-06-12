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
