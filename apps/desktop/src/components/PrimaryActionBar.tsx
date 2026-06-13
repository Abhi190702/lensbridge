import { BookOpen, ClipboardList, Power, RadioTower } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-panel/70 p-3">
      <Button onClick={onOpenObsOutput} disabled={!streamReady}>
        <RadioTower className="h-4 w-4" />
        Open OBS Output
      </Button>
      <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(OBS_SETUP_STEPS)}>
        <ClipboardList className="h-4 w-4" />
        Copy OBS Setup Steps
      </Button>
      <Button variant="ghost" onClick={onOpenGuide}>
        <BookOpen className="h-4 w-4" />
        Open Virtual Camera Guide
      </Button>
      <Button variant="ghost" onClick={onDisconnect} disabled={!streamReady}>
        <Power className="h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
}
