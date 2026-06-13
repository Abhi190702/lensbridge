export const OBS_OUTPUT_TITLE = "LensBridge OBS Output";

export const OBS_SETUP_STEPS = `LensBridge OBS Virtual Camera Setup

1. Connect your phone in LensBridge.
2. Click "Open OBS Output".
3. Open OBS Studio.
4. Add Source -> Window Capture.
5. Select "LensBridge OBS Output".
   If OBS says "LensBridge Desktop", go back to LensBridge and click "Open OBS Output" first.
6. If the preview is black, open source properties and change Capture Method:
   - Try Windows Graphics Capture
   - Then Windows 10 1903 and up
   - Then BitBlt
7. Right-click the source -> Transform -> Fit to Screen.
8. Click "Start Virtual Camera" in OBS.
9. Refresh or restart Chrome, then open your browser/app camera settings.
10. Select "OBS Virtual Camera".

Important: LensBridge is the live source. OBS exposes that source as a system webcam.`;

export const OBS_CAPTURE_WINDOW_LABEL = "[lensbridge-desktop.exe]: LensBridge OBS Output";
