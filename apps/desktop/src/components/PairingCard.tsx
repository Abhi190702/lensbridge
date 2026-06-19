import type { PairingApprovalRequest, PairingPayload } from "@lensbridge/shared";
import { CheckCircle2, Copy, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { QRPairingPanel } from "./QRPairingPanel";
import { formatTimeLeft } from "../lib/format";

interface PairingCardProps {
  session: PairingPayload | null;
  qrDataUrl: string | null;
  phoneUrl: string | null;
  expiresInSeconds: number;
  loading: boolean;
  pendingRequest: PairingApprovalRequest | null;
  onRegenerate: () => void;
  onApprove: (trustThisDevice: boolean) => void;
  onReject: () => void;
}

export function PairingCard({
  session,
  qrDataUrl,
  phoneUrl,
  expiresInSeconds,
  loading,
  pendingRequest,
  onRegenerate,
  onApprove,
  onReject
}: PairingCardProps) {
  async function copyLink() {
    if (phoneUrl) await navigator.clipboard.writeText(phoneUrl);
  }

  return (
    <Card className="grid gap-5 p-5 lg:grid-cols-[18rem_1fr]">
      <QRPairingPanel qrDataUrl={qrDataUrl} loading={loading} />
      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Pair phone</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Scan once. Use the phone as LensBridge Camera.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Open the phone page, scan this code, and allow camera access. The QR link expires for safety, but an active
          camera stream is not limited to the countdown.
        </p>

        <div className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          <div className="border border-line bg-white/[0.025] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Desktop</div>
            <div className="mt-1 font-medium text-white">{session?.desktopName ?? "Detecting"}</div>
          </div>
          <div className="border border-line bg-white/[0.025] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pairing link expires</div>
            <div className="mt-1 font-medium text-white">{formatTimeLeft(expiresInSeconds)}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={copyLink} disabled={!phoneUrl} variant="primary">
            <Copy className="h-4 w-4" />
            Copy pairing link
          </Button>
          <Button onClick={onRegenerate} variant="secondary">
            <RefreshCw className="h-4 w-4" />
            Regenerate session
          </Button>
        </div>

        {pendingRequest ? (
          <div className="mt-5 border border-brand/30 bg-brand/10 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">Pairing request</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{pendingRequest.deviceName}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Match this code with the phone screen before approving:
                </p>
              </div>
              <div className="font-mono text-2xl font-semibold tracking-[0.25em] text-white">
                {pendingRequest.pairingCode}
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              <SecurityFact label="Platform" value={pendingRequest.platform ?? "Unknown"} />
              <SecurityFact label="Known device" value={pendingRequest.trusted ? "Trusted" : "Unknown"} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => onApprove(false)}>
                <CheckCircle2 className="h-4 w-4" />
                Approve once
              </Button>
              <Button variant="secondary" onClick={() => onApprove(true)}>
                <ShieldCheck className="h-4 w-4" />
                Trust this device
              </Button>
              <Button variant="secondary" onClick={onReject}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        ) : null}

        {phoneUrl ? (
          <p className="mt-4 break-all border border-line bg-black/20 p-3 font-mono text-xs text-slate-400">
            {phoneUrl}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function SecurityFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/[0.06] bg-black/20 px-3 py-2">
      <div className="text-[0.68rem] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-100">{value}</div>
    </div>
  );
}
