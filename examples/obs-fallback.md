# OBS Fallback

Use OBS Virtual Camera when an app needs LensBridge to appear in a normal camera picker.

1. Keep LensBridge Desktop open with the phone preview visible.
2. Open OBS Studio.
3. Add a Window Capture source and select the LensBridge Desktop window.
4. Crop the source to the preview area if needed.
5. Click Start Virtual Camera.
6. Select OBS Virtual Camera in Chrome, Zoom, Omegle, or another browser app.

If the output is reversed in the browser preview, click Mirror output under the LensBridge preview before OBS captures it.

If OBS does not list LensBridge, the desktop window is not visible to Windows. Restart LensBridge Desktop, keep it open
and unminimized, then reopen the Window Capture source properties. The entry should be
`[lensbridge-desktop.exe]: LensBridge Desktop`.
