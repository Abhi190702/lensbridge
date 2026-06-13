import { MonitorUp } from "lucide-react";
import { Button } from "./ui/Button";

interface OutputModeSelectorProps {
  streamReady: boolean;
  onOpenObsOutput: () => void;
}

export function OutputModeSelector({ streamReady, onOpenObsOutput }: OutputModeSelectorProps) {
  return (
    <div className="rounded-xl border border-line bg-panel/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">OBS output</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Capture-safe surface</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
            Opens a clean video-only layout for OBS Window Capture. No sidebar, QR code, cards, or status bars.
          </p>
        </div>
        <Button onClick={onOpenObsOutput} disabled={!streamReady}>
          <MonitorUp className="h-4 w-4" />
          Open OBS Output
        </Button>
      </div>
    </div>
  );
}
