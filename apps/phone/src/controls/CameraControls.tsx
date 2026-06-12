import { Camera, RefreshCcw, Square } from "lucide-react";
import type { UseCameraResult } from "../camera/useCamera";

export function CameraControls({ camera, onStop }: { camera: UseCameraResult; onStop: () => void }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button className="rounded-full border border-white/15 bg-black/35 p-4 text-white backdrop-blur" onClick={camera.switchCamera} title="Switch camera">
        <RefreshCcw className="h-5 w-5" />
      </button>
      <button className="rounded-full bg-white p-5 text-ink shadow-xl" onClick={onStop} title="Stop stream">
        <Square className="h-5 w-5 fill-current" />
      </button>
      <button className="rounded-full border border-white/15 bg-black/35 p-4 text-white opacity-60 backdrop-blur" disabled title="Torch planned">
        <Camera className="h-5 w-5" />
      </button>
    </div>
  );
}
