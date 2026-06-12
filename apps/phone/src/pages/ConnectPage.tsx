import type { PairingPayload } from "@lensbridge/shared";
import { Camera } from "lucide-react";
import { ManualConnect } from "../pairing/ManualConnect";

export function ConnectPage({ initialError, onPair }: { initialError: string | null; onPair: (payload: PairingPayload) => void }) {
  return (
    <main className="min-h-screen px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-brand/40 bg-brand/10 text-brand">
          <Camera className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-brand">LensBridge Phone</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Open this from your desktop QR code.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Scan the QR code in LensBridge Desktop, then allow camera access. Your video is sent directly to your desktop
          over the local network.
        </p>
        {initialError ? <p className="mt-4 rounded-lg border border-red-400/25 bg-red-400/10 p-3 text-sm text-red-100">{initialError}</p> : null}
        <ManualConnect onPair={onPair} />
      </div>
    </main>
  );
}
