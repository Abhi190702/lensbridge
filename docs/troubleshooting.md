# Troubleshooting

## Phone Camera Does Not Open

Most mobile browsers require HTTPS for camera access. Use a secure dev setup or wait for the planned local HTTPS/WSS flow.

## Phone Cannot Connect

- Confirm both devices are on the same network.
- Check firewall prompts.
- Regenerate the pairing session.
- Verify the signaling port shown in the payload is reachable.

## Virtual Camera Not Visible

On Windows V2, Chrome should show `LensBridge Camera` after the driver is installed.

Fix:

1. Open PowerShell as Administrator.
2. Run `pnpm install:windows-camera`.
3. Restart Chrome fully.
4. Start LensBridge Desktop and connect your phone.
5. Open the target app's camera picker.
6. Select **LensBridge Camera**.
7. Keep the preview open for a few seconds while the shared-memory bridge starts.

Use `TEST-CAMERAS.html` to verify Chrome can see the device without OBS.

OBS fallback:

1. Connect your phone.
2. Click **Open OBS Output**.
3. Add OBS **Window Capture**.
4. Select **LensBridge OBS Output**.
5. Click **Start Virtual Camera** in OBS.
6. Refresh or restart Chrome.
7. Select **OBS Virtual Camera** in the browser/app.

## OBS Shows Black Screen

Cause: OBS is usually capturing **LensBridge Desktop** instead of **LensBridge OBS Output**, or Window Capture is missing
WebView2 content on your Windows setup.

Fix:

1. Restart LensBridge Desktop.
2. Click **Open OBS Output**.
3. Confirm the window title says **LensBridge OBS Output**.
4. Reopen OBS Window Capture properties.
5. Select **LensBridge OBS Output**, not **LensBridge Desktop**.
6. Try capture methods in this order: Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.
7. If all methods are black, use Display Capture and crop to the LensBridge output.

## OBS Captures Sidebar Or QR Code

You are capturing the normal dashboard. Click **Open OBS Output** first, then select **LensBridge OBS Output** in OBS.

## Mirrored Video

Open OBS Output and toggle **Mirror**. Use it only when the browser preview moves opposite of what you expect.

## Aspect Ratio Looks Wrong

Use **Fit** in LensBridge OBS Output. In OBS, right-click the source and choose **Transform -> Fit to Screen**.
