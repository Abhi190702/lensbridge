# Troubleshooting

## Phone Camera Does Not Open

Most mobile browsers require HTTPS for camera access. Use a secure dev setup or wait for the planned local HTTPS/WSS flow.

## Phone Cannot Connect

- Confirm both devices are on the same network.
- Check firewall prompts.
- Regenerate the pairing session.
- Verify the signaling port shown in the payload is reachable.

## Virtual Camera Not Visible

V1 does not provide native virtual camera output. LensBridge will not appear as `LensBridge Camera` in Chrome, Zoom, or
Discord.

Use OBS:

1. Connect your phone.
2. Click **Open OBS Output**.
3. Add OBS **Window Capture**.
4. Select **LensBridge OBS Output**.
5. Click **Start Virtual Camera** in OBS.
6. Select **OBS Virtual Camera** in the browser/app.

## OBS Shows Black Screen

Cause: Window Capture can miss WebView2 content on some Windows setups.

Fix:

1. Restart LensBridge Desktop.
2. Click **Open OBS Output**.
3. Reopen OBS Window Capture properties.
4. Try capture methods in this order: Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.
5. If all methods are black, use Display Capture and crop to the LensBridge output.

## OBS Captures Sidebar Or QR Code

You are capturing the normal dashboard. Click **Open OBS Output** first, then select **LensBridge OBS Output** in OBS.

## Mirrored Video

Open OBS Output and toggle **Mirror**. Use it only when the browser preview moves opposite of what you expect.

## Aspect Ratio Looks Wrong

Use **Fit** in LensBridge OBS Output. In OBS, right-click the source and choose **Transform -> Fit to Screen**.
