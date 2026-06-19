import { createPairingCode, type PairingPayload, type QualityProfileId } from "@lensbridge/shared";
import { useEffect, useRef } from "react";
import { CameraPreview } from "../camera/CameraPreview";
import type { UseCameraResult } from "../camera/useCamera";
import { BottomControlDock } from "../controls/BottomControlDock";
import { ConnectionHUD } from "../controls/ConnectionHUD";
import { getPhoneDeviceIdentity } from "../pairing/deviceIdentity";
import { useWebRTCStream } from "../stream/useWebRTCStream";

interface StreamPageProps {
  pairing: PairingPayload;
  camera: UseCameraResult;
  quality: QualityProfileId;
  autoReconnect: boolean;
  onQualityChange: (quality: QualityProfileId) => void;
}

export function StreamPage({ pairing, camera, quality, autoReconnect, onQualityChange }: StreamPageProps) {
  const stream = useWebRTCStream(pairing, camera.stream, quality, { autoReconnect });
  const startRef = useRef(stream.start);
  const autoStartedRef = useRef(false);
  const identityRef = useRef(getPhoneDeviceIdentity());
  const pairingCode = createPairingCode(pairing, identityRef.current.deviceId);
  const showingApprovalState = stream.status === "awaiting-approval" || stream.status === "rejected";

  useEffect(() => {
    startRef.current = stream.start;
  }, [stream.start]);

  useEffect(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    void startRef.current();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <CameraPreview stream={camera.stream} />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between pt-[env(safe-area-inset-top)]">
        <ConnectionHUD status={stream.status} metrics={stream.metrics} />
        <button
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink"
          onClick={() => void stream.start()}
        >
          Restart stream
        </button>
      </div>
      {stream.error && !showingApprovalState ? (
        <div className="absolute left-4 right-4 top-20 rounded-xl border border-red-400/25 bg-red-400/15 p-3 text-sm text-red-100 backdrop-blur">
          {stream.error}
        </div>
      ) : null}
      {showingApprovalState ? (
        <div className="absolute left-4 right-4 top-20 rounded-xl border border-white/15 bg-black/70 p-4 text-sm text-white backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">Pairing approval</p>
          <p className="mt-2 text-lg font-semibold">
            {stream.status === "rejected" ? "Pairing rejected on desktop." : "Waiting for desktop approval."}
          </p>
          <p className="mt-2 text-slate-200">Confirm that this code matches LensBridge Desktop:</p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-[0.35em] text-white">{pairingCode}</p>
        </div>
      ) : null}
      <BottomControlDock camera={camera} quality={quality} onQualityChange={onQualityChange} onStop={stream.stop} />
    </main>
  );
}
