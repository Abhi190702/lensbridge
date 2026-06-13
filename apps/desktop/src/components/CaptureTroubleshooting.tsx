import { Copy } from "lucide-react";

const items = [
  {
    title: "OBS shows black screen",
    cause: "Window Capture can miss WebView2 GPU surfaces on some Windows setups.",
    fix: "Restart LensBridge, reopen OBS source properties, then try Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.",
    checklist:
      "Black screen checklist:\n1. Restart LensBridge Desktop.\n2. Select LensBridge OBS Output in OBS.\n3. Try Windows Graphics Capture.\n4. Try Windows 10 1903 and up.\n5. Try BitBlt.\n6. Use Display Capture and crop if all methods fail."
  },
  {
    title: "OBS does not list LensBridge",
    cause: "OBS only lists visible, unminimized windows.",
    fix: "Open OBS Output, keep the LensBridge window visible, then reopen Window Capture properties.",
    checklist:
      "Missing window checklist:\n1. Open LensBridge OBS Output.\n2. Keep it unminimized.\n3. Reopen OBS Window Capture properties.\n4. Select LensBridge OBS Output."
  },
  {
    title: "Browser does not show OBS Virtual Camera",
    cause: "LensBridge is not a native camera device. OBS must expose it.",
    fix: "Click Start Virtual Camera in OBS, then choose OBS Virtual Camera in the browser/app camera picker.",
    checklist:
      "Camera picker checklist:\n1. Start OBS Virtual Camera.\n2. Refresh the browser tab.\n3. Select OBS Virtual Camera.\n4. Reopen the browser if needed."
  },
  {
    title: "Preview is mirrored",
    cause: "Front cameras and preview surfaces often mirror for selfie-style framing.",
    fix: "Use the Mirror control in OBS Output or the preview footer.",
    checklist:
      "Mirror checklist:\n1. Open OBS Output.\n2. Move the mouse to show controls.\n3. Toggle Mirror.\n4. Confirm text or hand movement looks correct."
  },
  {
    title: "Aspect ratio looks wrong",
    cause: "OBS source transform or output fit mode is stretching the frame.",
    fix: "Use Fit in LensBridge OBS Output, then right-click the OBS source and choose Transform -> Fit to Screen.",
    checklist:
      "Aspect checklist:\n1. Set LensBridge output to Fit.\n2. Right-click OBS source.\n3. Transform -> Fit to Screen.\n4. Avoid manual stretching."
  },
  {
    title: "Video is laggy",
    cause: "Phone network quality, high resolution, or OBS scaling can add latency.",
    fix: "Use the Balanced or Low-latency phone quality profile and close heavy apps.",
    checklist:
      "Lag checklist:\n1. Use same Wi-Fi network.\n2. Pick a lower quality profile.\n3. Close heavy apps.\n4. Avoid extra OBS filters."
  }
];

export function CaptureTroubleshooting() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.title} className="rounded-xl border border-line bg-panel/70 p-4">
          <h4 className="font-semibold text-white">{item.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            <span className="text-slate-300">Cause:</span> {item.cause}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            <span className="text-slate-300">Fix:</span> {item.fix}
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-slate-200 hover:border-brand/60 hover:text-white"
            onClick={() => void navigator.clipboard.writeText(item.checklist)}
          >
            <Copy className="h-4 w-4" />
            Copy checklist
          </button>
        </article>
      ))}
    </div>
  );
}
