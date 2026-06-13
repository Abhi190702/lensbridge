import { Copy, Minimize2, RotateCw, X } from "lucide-react";
import { OBS_SETUP_STEPS } from "../lib/obsWorkflow";

export type ObsFitMode = "fit" | "fill";
export type ObsBackgroundMode = "black" | "graphite";
export type ObsRotation = 0 | 90 | 180 | 270;

interface ObsOutputControlsProps {
  fitMode: ObsFitMode;
  backgroundMode: ObsBackgroundMode;
  mirrored: boolean;
  rotation: ObsRotation;
  onFitModeChange: (mode: ObsFitMode) => void;
  onBackgroundModeChange: (mode: ObsBackgroundMode) => void;
  onToggleMirror: () => void;
  onRotate: () => void;
  onHide: () => void;
  onExit: () => void;
}

export function ObsOutputControls({
  fitMode,
  backgroundMode,
  mirrored,
  rotation,
  onFitModeChange,
  onBackgroundModeChange,
  onToggleMirror,
  onRotate,
  onHide,
  onExit
}: ObsOutputControlsProps) {
  return (
    <div className="pointer-events-auto absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-neutral-950/90 px-3 py-2 text-sm text-white shadow-2xl">
      <SegmentedButton active={fitMode === "fit"} onClick={() => onFitModeChange("fit")}>
        Fit
      </SegmentedButton>
      <SegmentedButton active={fitMode === "fill"} onClick={() => onFitModeChange("fill")}>
        Fill
      </SegmentedButton>
      <SegmentedButton active={mirrored} onClick={onToggleMirror}>
        Mirror
      </SegmentedButton>
      <button className="obs-control-button" type="button" onClick={onRotate} title="Rotate output">
        <RotateCw className="h-4 w-4" />
        {rotation}deg
      </button>
      <select
        className="h-9 rounded-lg border border-white/10 bg-neutral-900 px-2 text-sm text-white outline-none"
        value={backgroundMode}
        onChange={(event) => onBackgroundModeChange(event.target.value as ObsBackgroundMode)}
        aria-label="OBS output background"
      >
        <option value="black">Black</option>
        <option value="graphite">Graphite</option>
      </select>
      <button
        className="obs-control-button"
        type="button"
        onClick={() => void navigator.clipboard.writeText(OBS_SETUP_STEPS)}
      >
        <Copy className="h-4 w-4" />
        Copy steps
      </button>
      <button className="obs-control-button" type="button" onClick={onHide} title="Hide controls">
        <Minimize2 className="h-4 w-4" />
        Hide
      </button>
      <button className="obs-control-button obs-control-danger" type="button" onClick={onExit}>
        <X className="h-4 w-4" />
        Exit
      </button>
    </div>
  );
}

function SegmentedButton({ active, children, onClick }: { active: boolean; children: string; onClick: () => void }) {
  return (
    <button
      className={active ? "obs-control-button obs-control-active" : "obs-control-button"}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
