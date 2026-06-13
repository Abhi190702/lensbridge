import type { PairingPayload } from "@lensbridge/shared";
import { ShieldCheck } from "lucide-react";
import { Card } from "./ui/Card";
import { formatDateTime } from "../lib/format";

interface SecurityPanelProps {
  session: PairingPayload | null;
}

export function SecurityPanel({ session }: SecurityPanelProps) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-line text-accent">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Security posture</h2>
          <p className="text-sm text-slate-400">Local-first defaults with short-lived sessions.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SecurityRow label="Local-only mode" value="Enabled" />
        <SecurityRow label="Cloud relay" value="Disabled" />
        <SecurityRow label="Media encryption" value="WebRTC DTLS-SRTP" />
        <SecurityRow label="Session expires" value={session ? formatDateTime(session.expiresAt) : "No session"} />
      </div>
    </Card>
  );
}

function SecurityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.025] p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
