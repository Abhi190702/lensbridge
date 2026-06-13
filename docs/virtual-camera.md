# Virtual Camera

Browsers and meeting apps only detect cameras registered by the operating system.

Windows V2:

- Experimental `LensBridge Camera` DirectShow device through UnityCapture.
- Phone WebRTC stream reaches LensBridge Desktop.
- Desktop pumps throttled RGBA frames into UnityCapture shared memory.
- Chrome/OBS/Zoom can open `LensBridge Camera` after the driver is installed.

Install the Windows driver from an Administrator PowerShell:

```powershell
pnpm install:windows-camera
```

Test without OBS:

1. Start LensBridge Desktop.
2. Connect your phone.
3. Open `TEST-CAMERAS.html` in Chrome.
4. Scan cameras.
5. Select `LensBridge Camera`.
6. Start the selected camera.

Important behavior:

- The bridge starts streaming only after a target app opens `LensBridge Camera`.
- If the status says waiting, keep the Chrome/OBS camera preview open for a few seconds.
- Restart Chrome after installing or uninstalling the driver.
- The current bridge uses a throttled WebView canvas pump, so it is a practical V2 bridge, not the final zero-copy native receiver.

OBS fallback:

- Desktop preview.
- OBS Output Mode for a clean capture-safe window surface.
- OBS Virtual Camera workflow for Windows/macOS/Linux.
- Mirror, fit/fill, rotate, and background controls in OBS Output Mode.

Use this fallback only if the DirectShow path is not installed or a target app refuses the virtual DirectShow device:

1. Connect your phone to LensBridge Desktop.
2. Click Open OBS Output.
3. Open OBS Studio.
4. Add a Window Capture source for LensBridge OBS Output.
5. Click Start Virtual Camera in OBS.
6. Refresh or restart Chrome.
7. Select OBS Virtual Camera in Chrome, Zoom, Discord, Meet, or another app.

If the browser preview feels reversed, toggle Mirror in OBS Output Mode before OBS captures it.

If LensBridge is missing from OBS Window Capture:

1. Restart LensBridge Desktop.
2. Keep the LensBridge Desktop window open and unminimized.
3. Reopen the OBS Window Capture source properties.
4. Pick `[lensbridge-desktop.exe]: LensBridge OBS Output`.
5. If it still does not appear, restart OBS or use Display Capture and crop to the LensBridge preview.

If OBS shows `[lensbridge-desktop.exe]: LensBridge Desktop`, you have not entered OBS Output Mode yet.

If OBS shows LensBridge but the preview is black:

1. Restart LensBridge Desktop after pulling the latest code.
2. In OBS Window Capture, try Windows Graphics Capture.
3. If it is still black, try Windows 10 (1903 and up), then BitBlt.
4. If both methods are black, use Display Capture and crop to the LensBridge preview.

Future:

- A native receiver that avoids WebView canvas/base64 frame transport.
- Windows Media Foundation virtual camera research.
- Native macOS CoreMediaIO.
