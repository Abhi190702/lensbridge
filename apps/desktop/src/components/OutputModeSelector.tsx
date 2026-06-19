import { MonitorUp } from "lucide-react";
import { Button } from "./ui/Button";

interface OutputModeSelectorProps {
  streamReady: boolean;
  onOpenObsOutput: () => void;
}

export function OutputModeSelector({ streamReady, onOpenObsOutput }: OutputModeSelectorProps) {
  return (
    <div className="border border-line bg-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Power-user OBS fallback</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Capture-safe surface</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
            Use this only when you need OBS. The direct LensBridge Camera path is the primary Windows output.
          </p>
        </div>
        <Button onClick={onOpenObsOutput} disabled={!streamReady}>
          <MonitorUp className="h-4 w-4" />
          Open OBS fallback
        </Button>
      </div>
    </div>
  );
}
