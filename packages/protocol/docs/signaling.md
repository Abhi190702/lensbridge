# Signaling

The signaling server accepts `desktop` and `phone` roles.

Supported message types:

- `hello`
- `hello-ack`
- `offer`
- `answer`
- `ice-candidate`
- `stream-started`
- `stream-stopped`
- `metrics`
- `error`
- `disconnect`

The server validates the session token before relaying messages. It does not inspect or record video frames.
