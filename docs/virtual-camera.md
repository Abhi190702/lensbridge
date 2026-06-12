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

V2:

- Linux `v4l2loopback`.
- FFmpeg/GStreamer frame bridge.

Future:

- Native Windows DirectShow.
- Native macOS CoreMediaIO.
