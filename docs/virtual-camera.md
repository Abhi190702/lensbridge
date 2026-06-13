# Virtual Camera

Browsers and meeting apps only detect cameras registered by the operating system.

V1:

- Desktop preview.
- OBS Output Mode for a clean capture-safe window surface.
- OBS Virtual Camera workflow for Windows/macOS/Linux.
- Mirror, fit/fill, rotate, and background controls in OBS Output Mode.

Use this path today:

1. Connect your phone to LensBridge Desktop.
2. Click Open OBS Output.
3. Open OBS Studio.
4. Add a Window Capture source for LensBridge OBS Output.
5. Click Start Virtual Camera in OBS.
6. Select OBS Virtual Camera in Chrome, Zoom, Discord, Meet, or another app.

If the browser preview feels reversed, toggle Mirror in OBS Output Mode before OBS captures it.

If LensBridge is missing from OBS Window Capture:

1. Restart LensBridge Desktop.
2. Keep the LensBridge Desktop window open and unminimized.
3. Reopen the OBS Window Capture source properties.
4. Pick `[lensbridge-desktop.exe]: LensBridge OBS Output`.
5. If it still does not appear, restart OBS or use Display Capture and crop to the LensBridge preview.

If OBS shows LensBridge but the preview is black:

1. Restart LensBridge Desktop after pulling the latest code.
2. In OBS Window Capture, try Windows Graphics Capture.
3. If it is still black, try Windows 10 (1903 and up), then BitBlt.
4. If both methods are black, use Display Capture and crop to the LensBridge preview.

V2:

- Reliability hardening around OBS Output Mode.
- Linux `v4l2loopback` research.
- FFmpeg/GStreamer frame bridge research.

Future:

- Native Windows DirectShow.
- Native macOS CoreMediaIO.
