# Clean Uninstall

LensBridge V1 does not install native drivers or background services.

Potential state:

- App config in the future platform config directory.
- Browser permission state in the phone browser.
- Linux `v4l2loopback` module if you choose to load it.

Linux cleanup:

```bash
cd drivers/linux
./uninstall-v4l2loopback.sh
```

Windows/macOS V1 cleanup is just removing the app bundle and any OBS configuration you created manually.
