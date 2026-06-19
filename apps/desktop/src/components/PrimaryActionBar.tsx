import { BookOpen, ClipboardList, MonitorUp, Power } from "lucide-react";
import { OBS_SETUP_STEPS } from "../lib/obsWorkflow";
import { Button } from "./ui/Button";

interface PrimaryActionBarProps {
  streamReady: boolean;
  onOpenObsOutput: () => void;
  onOpenGuide: () => void;
  onDisconnect: () => void;
}

export function PrimaryActionBar({ streamReady, onOpenObsOutput, onOpenGuide, onDisconnect }: PrimaryActionBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-line bg-panel p-2">
      <Button onClick={onOpenObsOutput} disabled={!streamReady}>
        <MonitorUp className="h-4 w-4" />
        OBS fallback
      </Button>
      <Button variant="secondary" onClick={onOpenGuide}>
        <BookOpen className="h-4 w-4" />
        Output setup
      </Button>
      <Button variant="ghost" onClick={() => void navigator.clipboard.writeText(OBS_SETUP_STEPS)}>
        <ClipboardList className="h-4 w-4" />
        Copy OBS steps
      </Button>
      <Button variant="ghost" onClick={onDisconnect} disabled={!streamReady}>
        <Power className="h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
}
