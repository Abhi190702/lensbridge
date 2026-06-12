import { ClipboardList, MonitorCog } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

const OBS_STEPS = `LensBridge V1 -> Chrome camera setup

1. Keep LensBridge Desktop open with the phone preview visible.
2. Open OBS Studio.
3. Add a Window Capture source and select the LensBridge Desktop window.
4. Crop the OBS source to the preview area if needed.
5. Click Start Virtual Camera in OBS.
6. In Chrome, pick "OBS Virtual Camera" from the camera list.

If the browser preview is reversed, click "Mirror output" under the LensBridge preview before capturing it in OBS.`;

export function VirtualCameraPanel() {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <MonitorCog className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-white">Virtual camera output</h2>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
              OBS required in V1
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Chrome, Omegle, Zoom, and other browser apps can only detect cameras registered by the operating system.
            LensBridge V1 gives you the live desktop preview; OBS Virtual Camera turns that preview into a selectable
            camera device today.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            If OBS does not list LensBridge, restart LensBridge Desktop, keep the window open and unminimized, then
            reopen the Window Capture source properties.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
            <Step number="1" label="Connect phone" />
            <Step number="2" label="Capture LensBridge in OBS" />
            <Step number="3" label="Select OBS Virtual Camera" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(OBS_STEPS)}>
              <ClipboardList className="h-4 w-4" />
              Copy OBS steps
            </Button>
            <Button variant="secondary" onClick={() => void navigator.clipboard.writeText("cd drivers/linux && ./setup-v4l2loopback.sh")}>
              Copy Linux setup command
            </Button>
            <Button variant="ghost" onClick={() => window.open("https://obsproject.com/", "_blank")}>Open OBS</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-white/[0.03] px-3 py-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
        {number}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}
