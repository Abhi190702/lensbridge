# LensBridge Benchmarks

LensBridge does not claim zero-copy or production-grade frame-pump performance. The current Windows path is:

```text
Phone WebRTC -> desktop WebView video -> canvas RGBA readback -> Tauri raw IPC -> Rust -> UnityCapture shared memory -> DirectShow consumer
```

This file defines the benchmark protocol for proving whether that path is acceptable on real machines.

## What Is Measured

- Resolution.
- Target FPS.
- Actual delivered FPS.
- Captured frames.
- Delivered frames.
- Dropped frames from the latest-frame-wins transport model.
- Average frame send duration.
- p95 frame send duration.
- Rust frame write duration where available.
- Whether a DirectShow consumer is open.
- Whether OBS fallback is being used.
- Machine profile and OS.

The Direct Windows Camera panel in the desktop app now exposes frame-pump counters while the bridge is active.

## Required Scenarios

| Scenario | Resolution | Target FPS | Duration | Consumer |
| --- | ---: | ---: | ---: | --- |
| `360p24-5m` | 640x360 | 24 | 5 minutes | closed |
| `540p30-5m` | 960x540 | 30 | 5 minutes | closed |
| `720p30-10m` | 1280x720 | 30 | 10 minutes | closed |
| `720p30-10m-consumer-open` | 1280x720 | 30 | 10 minutes | `LensBridge Camera` open |
| `1080p30-stress` | 1920x1080 | 30 | 5 minutes | open, experimental |

## Generate A Result Template

```powershell
pnpm benchmark:frame-pump
```

This writes:

```text
benchmarks/results/frame-pump-template.local.json
```

`.local.json` files are ignored because they contain machine-specific results. Commit sanitized results only when the machine profile and run notes are suitable for public comparison.

## Run A Manual Benchmark

1. Start `pnpm dev:phone`.
2. Start `pnpm dev:desktop`.
3. Connect a phone and approve the pairing request.
4. Select the target quality profile.
5. For consumer-open scenarios, open `LensBridge Camera` in `TEST-CAMERAS.html`, Chrome, OBS, or another camera app.
6. Let the scenario run for the required duration.
7. Copy the Direct Windows Camera panel values into the generated JSON:
   - FPS.
   - Frames.
   - Dropped.
   - Avg send.
   - p95 send.
8. Add notes about Wi-Fi, phone model, browser, and whether the preview stayed smooth.

## Summarize A Result File

```powershell
pnpm benchmark:frame-pump -- --summarize=benchmarks/results/frame-pump-template.local.json
```

## Current Public Baseline

No public real-hardware baseline is committed yet. `benchmarks/results/sample-dev-machine.placeholder.json` is a schema example only and must not be treated as performance evidence.

## Performance Gate

If the current WebView canvas path cannot hold 1280x720 at 30 FPS for 10 minutes with a DirectShow consumer open, the roadmap must keep native receiver work marked critical rather than optional.
