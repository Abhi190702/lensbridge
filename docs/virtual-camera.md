# Virtual Camera

Browsers and meeting apps only detect cameras registered by the operating system.

V1:

- Desktop preview.
- OBS Virtual Camera fallback for Windows/macOS/Linux.
- Mirror output toggle in the desktop preview for OBS/window-capture workflows.

Use this path today:

1. Connect your phone to LensBridge Desktop.
2. Open OBS Studio.
3. Add a Window Capture source for the LensBridge Desktop window.
4. Crop to the preview area if needed.
5. Click Start Virtual Camera in OBS.
6. Select OBS Virtual Camera in Chrome, Zoom, Omegle, or another app.

If the browser preview feels reversed, click Mirror output under the LensBridge Desktop preview before OBS captures it.

If LensBridge is missing from OBS Window Capture:

1. Restart LensBridge Desktop.
2. Keep the LensBridge Desktop window open and unminimized.
3. Reopen the OBS Window Capture source properties.
4. Pick `[lensbridge-desktop.exe]: LensBridge Desktop`.
5. If it still does not appear, restart OBS or use Display Capture and crop to the LensBridge preview.

If OBS shows LensBridge but the preview is black:

1. Restart LensBridge Desktop after pulling the latest code.
2. In OBS Window Capture, change Capture Method from Automatic to Windows 10 (1903 and up).
3. If it is still black, try BitBlt.
4. If both methods are black, use Display Capture and crop to the LensBridge preview.

V2:

- Linux `v4l2loopback`.
- FFmpeg/GStreamer frame bridge.

Future:

- Native Windows DirectShow.
- Native macOS CoreMediaIO.
