# Signaling

The signaling server accepts `desktop` and `phone` roles.

Supported message types:

- `hello`
- `hello-ack`
- `pairing-approved`
- `pairing-rejected`
- `offer`
- `answer`
- `ice-candidate`
- `ice-restart-request`
- `stream-started`
- `stream-stopped`
- `metrics`
- `error`
- `disconnect`

Handshake behavior:

1. Each socket connects with `sessionId`, `token`, and `role` query parameters.
2. The server validates the query token before upgrading to WebSocket.
3. The client sends `hello` with the same session and role.
4. The server sends `hello-ack` back to that same client.
5. Invalid `hello` messages are acknowledged as rejected and are not relayed.
6. The phone waits for `pairing-approved` before sending a WebRTC `offer`.
7. Phone media messages such as `offer`, `ice-candidate`, `metrics`, and `stream-stopped` include the phone `deviceId`.
8. The desktop accepts those media messages only when the `deviceId` matches the approved pairing request.

The server relays signaling metadata only. It does not inspect, decode, store, or record video frames.
