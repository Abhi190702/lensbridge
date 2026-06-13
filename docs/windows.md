# Windows

Windows V2 ships an experimental DirectShow camera bridge named `LensBridge Camera`.

Primary path:

```text
Phone -> LensBridge Desktop -> LensBridge Camera -> browser/app
```

Install from an Administrator PowerShell:

```powershell
pnpm install:windows-camera
```

Then restart Chrome or your meeting app, connect the phone, and select `LensBridge Camera`.

Test without OBS by opening `TEST-CAMERAS.html` in Chrome.

OBS fallback:

```text
Phone -> LensBridge Desktop -> LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera
```

In OBS, select **LensBridge OBS Output** as a Window Capture source. If the preview is black, try capture methods in this
order: Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.

The current DirectShow bridge uses UnityCapture shared memory and a throttled WebView canvas frame pump. A zero-copy
native receiver and Media Foundation camera are still future work.
