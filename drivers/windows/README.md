# Windows Camera Driver

LensBridge V2 includes an experimental DirectShow camera path for Windows.

What is included:

- `UnityCaptureFilter64.dll` and `UnityCaptureFilter32.dll`
- `Install-LensBridgeCamera.ps1`
- `Uninstall-LensBridgeCamera.ps1`
- A Tauri/Rust shared-memory frame publisher in the desktop app

The driver registers as `LensBridge Camera`. When Chrome, OBS, Zoom, or another app opens that camera, LensBridge Desktop writes the connected phone stream into UnityCapture shared memory.

## Install

Open PowerShell as Administrator from the repo root:

```powershell
pnpm install:windows-camera
```

Then restart Chrome or any app that had its camera picker open.

## Test

1. Start LensBridge Desktop.
2. Connect your phone.
3. Open `TEST-CAMERAS.html` in Chrome.
4. Click `Scan cameras`.
5. Select `LensBridge Camera`.
6. Click `Start selected camera`.

The LensBridge app status should move from `Waiting` to `Streaming`.

## Uninstall

Open PowerShell as Administrator from the repo root:

```powershell
pnpm uninstall:windows-camera
```

Restart Chrome after uninstalling.

## Notes

- This is a DirectShow virtual camera based on UnityCapture, not a Windows Media Foundation virtual camera.
- Some apps cache camera devices. Restart the app after install or uninstall.
- OBS is no longer required for the direct Windows path, but OBS Output Mode remains available as a fallback.
