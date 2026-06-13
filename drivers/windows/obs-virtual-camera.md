# OBS Virtual Camera on Windows

This is the fallback path. Prefer `LensBridge Camera` after installing the Windows DirectShow driver with:

```powershell
pnpm install:windows-camera
```

Fallback steps:

1. Install OBS Studio.
2. In LensBridge, click **Open OBS Output**.
3. Add **LensBridge OBS Output** as a Window Capture source.
4. Start OBS Virtual Camera.
5. Select OBS Virtual Camera in your meeting app.

If OBS shows **LensBridge Desktop**, go back to LensBridge and open OBS Output first.
