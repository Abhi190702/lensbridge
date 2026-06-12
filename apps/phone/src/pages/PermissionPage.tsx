import type { PairingPayload, QualityProfileId } from "@lensbridge/shared";
import type { UseCameraResult } from "../camera/useCamera";
import { PairingScreen } from "../pairing/PairingScreen";
import { QualitySelector } from "../controls/QualitySelector";

interface PermissionPageProps {
  pairing: PairingPayload;
  camera: UseCameraResult;
  quality: QualityProfileId;
  onQualityChange: (quality: QualityProfileId) => void;
}

export function PermissionPage({ pairing, camera, quality, onQualityChange }: PermissionPageProps) {
  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <PairingScreen pairing={pairing} />
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Allow camera access.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          LensBridge needs camera access to stream your phone camera to your desktop. Your video is not uploaded.
        </p>
        <div className="mt-5">
          <QualitySelector value={quality} onChange={onQualityChange} />
        </div>
        {camera.error ? <p className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-100">{camera.error}</p> : null}
        <button
          className="mt-5 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-ink disabled:opacity-60"
          disabled={camera.loading}
          onClick={() => void camera.start()}
        >
          {camera.loading ? "Opening camera..." : "Allow camera"}
        </button>
        {!window.isSecureContext ? (
          <p className="mt-4 text-xs leading-5 text-amber-100">
            This browser reports an insecure context. Mobile browsers may block camera access until local HTTPS/WSS is enabled.
          </p>
        ) : null}
      </div>
    </main>
  );
}
