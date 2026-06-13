import { MonitorCog } from "lucide-react";
import { OBS_SETUP_STEPS } from "../lib/obsWorkflow";
import { CaptureTroubleshooting } from "./CaptureTroubleshooting";
import { DirectCameraBridgePanel } from "./DirectCameraBridgePanel";
import { ObsDeviceStatusPanel } from "./ObsDeviceStatusPanel";
import { ObsSetupWizard } from "./ObsSetupWizard";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import type { DirectCameraBridgeState } from "../hooks/useUnityCaptureBridge";

interface VirtualCameraPanelProps {
  directCamera: DirectCameraBridgeState;
}

export function VirtualCameraPanel({ directCamera }: VirtualCameraPanelProps) {
  return (
    <div className="grid gap-5">
      <DirectCameraBridgePanel bridge={directCamera} />
      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-brand">
            <MonitorCog className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Virtual camera output</h2>
              <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
                OBS fallback
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              If the DirectShow driver is not installed yet, OBS can still expose a LensBridge window capture through
              OBS Virtual Camera.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Use the dashboard's Open OBS Output action before adding a Window Capture source. That output hides all
              LensBridge chrome and renders only the live camera feed.
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
              <Step number="1" label="Connect phone" />
              <Step number="2" label="Select LensBridge Camera" />
              <Step number="3" label="Use OBS only as fallback" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(OBS_SETUP_STEPS)}>
                Copy OBS steps
              </Button>
              <Button
                variant="secondary"
                onClick={() => void navigator.clipboard.writeText("cd drivers/linux && ./setup-v4l2loopback.sh")}
              >
                Copy Linux setup command
              </Button>
              <Button variant="ghost" onClick={() => window.open("https://obsproject.com/", "_blank")}>
                Open OBS
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <ObsDeviceStatusPanel />
      <ObsSetupWizard />
      <CaptureTroubleshooting />
    </div>
  );
}

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2 border border-line bg-white/[0.025] px-3 py-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-brand/30 text-xs font-bold text-brand">
        {number}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}
