import type { PairingPayload } from "@lensbridge/shared";
import { SecurityPanel } from "../components/SecurityPanel";

export function Security({ session }: { session: PairingPayload | null }) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Security</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          LensBridge does not upload, record, or analyze camera video. V1 pairing uses local tokens and WebRTC encrypted media.
        </p>
      </div>
      <SecurityPanel session={session} />
    </div>
  );
}
