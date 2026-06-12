# LensBridge Protocol

V1 uses a local-only pairing payload plus a WebSocket signaling channel.

The media path is WebRTC peer-to-peer where the browser engine can negotiate it. The signaling server is not a media relay.

## Pairing Payload

```json
{
  "app": "LensBridge",
  "version": "0.1",
  "desktopName": "Abhi-Laptop",
  "host": "192.168.1.20",
  "port": 48173,
  "sessionId": "random-id",
  "token": "random-token",
  "expiresAt": "2026-06-12T18:00:00.000Z",
  "transport": "wifi-webrtc",
  "secure": false,
  "signalingUrl": "ws://192.168.1.20:48173/signal"
}
```

`secure` is `false` in V1 dev mode because local TLS/mkcert is future work. WebRTC still encrypts media using DTLS-SRTP.
