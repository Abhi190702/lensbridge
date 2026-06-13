export const OBS_OUTPUT_TITLE = "LensBridge OBS Output";

export const OBS_SETUP_STEPS = `LensBridge OBS Fallback Setup

1. Connect your phone in LensBridge.
2. First try LensBridge Camera directly in Chrome, OBS, or your target app.
3. If the app will not use LensBridge Camera, click "Open OBS Output".
4. Open OBS Studio.
5. Add Source -> Window Capture.
6. Select "LensBridge OBS Output".
   If OBS says "LensBridge Desktop", go back to LensBridge and click "Open OBS Output" first.
7. If the preview is black, open source properties and change Capture Method:
   - Try Windows Graphics Capture
   - Then Windows 10 1903 and up
   - Then BitBlt
8. Right-click the source -> Transform -> Fit to Screen.
9. Click "Start Virtual Camera" in OBS.
10. Refresh or restart Chrome, then open your browser/app camera settings.
11. Select "OBS Virtual Camera".

Important: LensBridge Camera is the primary Windows output. OBS is only the fallback bridge.`;

export const OBS_CAPTURE_WINDOW_LABEL = "[lensbridge-desktop.exe]: LensBridge OBS Output";
