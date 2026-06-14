import type { PairingPayload, QualityProfileId } from "@lensbridge/shared";
import { CameraPreview } from "../camera/CameraPreview";
import type { UseCameraResult } from "../camera/useCamera";
import { BottomControlDock } from "../controls/BottomControlDock";
import { ConnectionHUD } from "../controls/ConnectionHUD";
import { useWebRTCStream } from "../stream/useWebRTCStream";

interface StreamPageProps {
  pairing: PairingPayload;
  camera: UseCameraResult;
  quality: QualityProfileId;
  onQualityChange: (quality: QualityProfileId) => void;
}

export function StreamPage({ pairing, camera, quality, onQualityChange }: StreamPageProps) {
  const stream = useWebRTCStream(pairing, camera.stream, quality);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <CameraPreview stream={camera.stream} />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between pt-[env(safe-area-inset-top)]">
        <ConnectionHUD status={stream.status} metrics={stream.metrics} />
        <button
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink"
          onClick={() => void stream.start()}
        >
          Start stream
        </button>
      </div>
      {stream.error ? (
        <div className="absolute left-4 right-4 top-20 rounded-xl border border-red-400/25 bg-red-400/15 p-3 text-sm text-red-100 backdrop-blur">
          {stream.error}
        </div>
      ) : null}
      <BottomControlDock camera={camera} quality={quality} onQualityChange={onQualityChange} onStop={stream.stop} />
    </main>
  );
}
