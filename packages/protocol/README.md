# @lensbridge/protocol

This package documents the LensBridge V1 pairing and signaling protocol.

The protocol is intentionally small:

- A desktop app creates a short-lived pairing session.
- The phone opens a pairing payload.
- Both peers connect to the local signaling server.
- The server verifies token/session state and relays WebRTC offer, answer, ICE, metrics, and disconnect messages.

See `docs/` for details.
