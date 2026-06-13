import type { PairingPayload } from "@lensbridge/shared";
import { Copy, RefreshCw } from "lucide-react";
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
  onRegenerate: () => void;
}

export function PairingCard({
  session,
  qrDataUrl,
  phoneUrl,
  expiresInSeconds,
  loading,
  onRegenerate
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
          Open the phone page, scan this code, and allow camera access. The stream stays on your local network; once it
          is live, Windows apps can open LensBridge Camera.
        </p>

        <div className="mt-5 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          <div className="border border-line bg-white/[0.025] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Desktop</div>
            <div className="mt-1 font-medium text-white">{session?.desktopName ?? "Detecting"}</div>
          </div>
          <div className="border border-line bg-white/[0.025] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Session expires</div>
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

        {phoneUrl ? (
          <p className="mt-4 break-all border border-line bg-black/20 p-3 font-mono text-xs text-slate-400">
            {phoneUrl}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
