import { Copy } from "lucide-react";

const items = [
  {
    title: "OBS shows black screen",
    cause:
      "Most often OBS is capturing LensBridge Desktop instead of LensBridge OBS Output, or Window Capture is missing WebView2 video content.",
    fix: "Click Open OBS Output first, select LensBridge OBS Output in OBS, then try Windows Graphics Capture, Windows 10 1903 and up, then BitBlt.",
    checklist:
      "Black screen checklist:\n1. In LensBridge, click Open OBS Output.\n2. Confirm the window title says LensBridge OBS Output.\n3. In OBS, select LensBridge OBS Output, not LensBridge Desktop.\n4. Try Windows Graphics Capture.\n5. Try Windows 10 1903 and up.\n6. Try BitBlt.\n7. Use Display Capture and crop if all methods fail."
  },
  {
    title: "OBS does not list LensBridge",
    cause: "OBS only lists visible, unminimized windows.",
    fix: "Open OBS Output, keep the LensBridge window visible, then reopen Window Capture properties.",
    checklist:
      "Missing window checklist:\n1. Open LensBridge OBS Output.\n2. Keep it unminimized.\n3. Reopen OBS Window Capture properties.\n4. Select LensBridge OBS Output."
  },
  {
    title: "Browser does not show LensBridge Camera",
    cause: "The Windows DirectShow driver is not installed yet, or Chrome cached its camera list before installation.",
    fix: "Run the Windows driver installer as Administrator, restart Chrome, then choose LensBridge Camera in the camera picker.",
    checklist:
      "Camera picker checklist:\n1. Run pnpm install:windows-camera as Administrator.\n2. Restart Chrome fully.\n3. Start LensBridge and connect your phone.\n4. Select LensBridge Camera.\n5. Keep the camera preview open for a few seconds."
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
