# OBS Fallback Workflow

On Windows, try `LensBridge Camera` first after installing the DirectShow driver with `pnpm install:windows-camera`.

Use this OBS workflow when the DirectShow path is not installed or a target app refuses virtual DirectShow devices.

```text
Phone -> LensBridge Desktop -> LensBridge OBS Output -> OBS Window Capture -> OBS Virtual Camera -> browser/app
```

## Setup

1. Start the phone PWA and LensBridge Desktop.
2. Scan the QR code from your phone.
3. Allow camera access and start the stream.
4. Confirm the desktop preview is live.
5. Click **Open OBS Output**.
6. Open OBS Studio.
7. Add **Source -> Window Capture**.
8. Select **LensBridge OBS Output**.
   If the dropdown says **LensBridge Desktop**, go back to LensBridge and click **Open OBS Output** first.
9. Right-click the OBS source and choose **Transform -> Fit to Screen**.
10. Click **Start Virtual Camera** in OBS.
11. Refresh or restart Chrome.
12. Select **OBS Virtual Camera** in your browser, Zoom, Discord, Meet, or other app.

## Capture Method Order

If OBS shows a black preview, try capture methods in this order:

1. Windows Graphics Capture.
2. Windows 10 (1903 and up).
3. BitBlt.
4. Display Capture cropped to LensBridge OBS Output.

## Output Controls

Move the mouse over LensBridge OBS Output to reveal controls:

- Fit: preserve the full frame.
- Fill: crop to fill the output.
- Mirror: fix reversed preview.
- Rotate: cycle 0/90/180/270.
- Background: black or graphite.
- Hide: hide controls immediately.

Controls auto-hide after two seconds. Press `Esc` to leave OBS Output Mode.

## Important

LensBridge is the live source. OBS exposes that source as a system webcam. On Windows V2, the direct `LensBridge Camera`
driver is preferred when installed.
