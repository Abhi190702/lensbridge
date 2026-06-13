# Clean Uninstall

LensBridge can register a Windows DirectShow filter when you install `LensBridge Camera`.

Potential state:

- App config in the future platform config directory.
- Browser permission state in the phone browser.
- Windows DirectShow registration for `LensBridge Camera` if you installed it.
- Linux `v4l2loopback` module if you choose to load it.

Windows camera cleanup:

```powershell
pnpm uninstall:windows-camera
```

Run it from an Administrator PowerShell, then restart Chrome or any app that had a camera picker open.

Linux cleanup:

```bash
cd drivers/linux
./uninstall-v4l2loopback.sh
```

macOS cleanup is just removing the app bundle and any OBS configuration you created manually.
