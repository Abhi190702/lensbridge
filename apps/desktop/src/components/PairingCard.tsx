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

export function PairingCard({ session, qrDataUrl, phoneUrl, expiresInSeconds, loading, onRegenerate }: PairingCardProps) {
  async function copyLink() {
    if (phoneUrl) await navigator.clipboard.writeText(phoneUrl);
  }

  return (
    <Card className="grid gap-6 p-6 lg:grid-cols-[20rem_1fr]">
      <QRPairingPanel qrDataUrl={qrDataUrl} loading={loading} />
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium text-brand">Phone-to-desktop V1</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Scan once. Stream instantly.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Open LensBridge on your phone and scan this QR code to turn your camera into a desktop source. Your camera
          stream stays on your local network.
        </p>

        <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-white/[0.03] p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Desktop</div>
            <div className="mt-1 font-medium text-white">{session?.desktopName ?? "Detecting"}</div>
          </div>
          <div className="rounded-lg border border-line bg-white/[0.03] p-3">
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
          <p className="mt-4 break-all rounded-lg border border-line bg-black/20 p-3 font-mono text-xs text-slate-400">
            {phoneUrl}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
