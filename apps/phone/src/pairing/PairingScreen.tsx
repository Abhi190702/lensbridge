import type { PairingPayload } from "@lensbridge/shared";
import { ShieldCheck } from "lucide-react";

export function PairingScreen({ pairing }: { pairing: PairingPayload }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.04] p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-accent" />
        <div>
          <p className="text-sm font-medium text-white">Pairing with {pairing.desktopName}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your video stays on your local network. LensBridge does not upload or record this stream.
          </p>
        </div>
      </div>
    </div>
  );
}
