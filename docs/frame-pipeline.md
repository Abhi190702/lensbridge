# Frame Pipeline

This document maps the current frame path and the extension points for future native receivers.

## Implemented Windows Path

```mermaid
flowchart LR
  PhoneCamera["Phone getUserMedia"] --> PhoneWebRTC["Phone WebRTC sender"]
  PhoneWebRTC --> DesktopTrack["Desktop RTCPeerConnection track"]
  DesktopTrack --> Preview["React preview video"]
  Preview --> Canvas["DirectShow output canvas"]
  Canvas --> IPC["Tauri raw IPC Uint8Array"]
  IPC --> Rust["Rust frame validation"]
  Rust --> Unity["UnityCapture shared memory"]
  Unity --> DShow["LensBridge Camera"]
```

## Capture Stage

The phone PWA owns camera permission and applies LensBridge quality profiles. The current supported profiles avoid wasteful 4K capture because the desktop output path is capped for 720p-class output.

## Desktop Preview Stage

The desktop receives a normal WebRTC `MediaStream`. Preview UI reads browser stats for FPS, bitrate, jitter, and basic resolution.

## Direct Camera Stage

`apps/desktop/src/hooks/useUnityCaptureBridge.ts` owns the active frame pump:

- Draws the latest WebRTC video frame into a fixed canvas.
- Reads RGBA bytes.
- Sends bytes to Rust through raw Tauri IPC.
- Drops stale frames when the transport is busy.
- Tracks dropped frames and send timing for benchmarks.

`apps/desktop/src-tauri/src/virtual_cam/unity_capture.rs` validates the frame and writes it into UnityCapture-compatible Windows shared-memory objects.

## Backend Abstraction

```mermaid
flowchart TD
  Manager["VirtualCameraManager"] --> Windows["Windows DirectShow / UnityCapture"]
  Manager --> Linux["Linux v4l2loopback scaffold"]
  Manager --> Mac["macOS CoreMediaIO planned"]
  Manager --> OBS["Power-user OBS fallback"]
```

Only the Windows DirectShow path is currently implemented as a working native camera output. Linux and macOS must remain marked experimental/planned until frame output is verified.

## Benchmark Hooks

The frame pump records:

- Delivered frames.
- Dropped frames.
- Average send duration.
- p95 send duration.
- Rust write duration.

See [../BENCHMARKS.md](../BENCHMARKS.md).
