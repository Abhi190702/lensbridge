# Troubleshooting

## Phone Camera Does Not Open

Most mobile browsers require HTTPS for camera access. Use a secure dev setup or wait for the planned local HTTPS/WSS flow.

## Phone Cannot Connect

- Confirm both devices are on the same network.
- Check firewall prompts.
- Regenerate the pairing session.
- Verify the signaling port shown in the payload is reachable.

## Virtual Camera Not Visible

V1 does not provide native virtual camera output. Use OBS fallback docs or the Linux v4l2loopback setup for V2 testing.
