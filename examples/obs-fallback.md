# OBS Fallback

Use OBS Virtual Camera when an app needs LensBridge to appear in a normal camera picker.

1. Connect your phone in LensBridge.
2. Click Open OBS Output.
3. Open OBS Studio.
4. Add a Window Capture source and select LensBridge OBS Output.
   If OBS says LensBridge Desktop, go back and click Open OBS Output first.
5. Right-click the source and choose Transform -> Fit to Screen.
6. Click Start Virtual Camera.
7. Refresh or restart Chrome.
8. Select OBS Virtual Camera in Chrome, Zoom, Discord, Meet, or another browser app.

If the output is reversed in the browser preview, toggle Mirror in LensBridge OBS Output before OBS captures it.

If OBS does not list LensBridge, the desktop window is not visible to Windows. Restart LensBridge Desktop, keep it open
and unminimized, then reopen the Window Capture source properties. The entry should be
`[lensbridge-desktop.exe]: LensBridge OBS Output`.

If OBS lists LensBridge but the preview is black, try Windows Graphics Capture, Windows 10 (1903 and up), then BitBlt.
Display Capture with a crop is the fallback when Window Capture cannot see WebView2 content on a specific machine.
