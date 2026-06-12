# Source Drivers

V1 ships one real source path: `phone-webrtc`.

Planned source types:

- `desktop-webrtc`
- `ip-camera-rtsp`
- `obs-source`
- `screen-capture`
- `raspberry-pi`
- `dslr`
- `gopro`
- `plugin`

Each source should declare capabilities and return an honest `planned`, `experimental`, or `available` status.
