import type { QualityProfileId } from "@lensbridge/shared";
import type { UseCameraResult } from "../camera/useCamera";
import { CameraControls } from "./CameraControls";
import { QualitySelector } from "./QualitySelector";

interface BottomControlDockProps {
  camera: UseCameraResult;
  quality: QualityProfileId;
  onQualityChange: (quality: QualityProfileId) => void;
  onStop: () => void;
}

export function BottomControlDock({ camera, quality, onQualityChange, onStop }: BottomControlDockProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur">
        <div className="mb-4">
          <QualitySelector value={quality} onChange={onQualityChange} />
        </div>
        <CameraControls camera={camera} onStop={onStop} />
      </div>
    </div>
  );
}
