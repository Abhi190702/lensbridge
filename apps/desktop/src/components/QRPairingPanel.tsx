import { LoaderCircle, QrCode } from "lucide-react";

interface QRPairingPanelProps {
  qrDataUrl: string | null;
  loading: boolean;
}

export function QRPairingPanel({ qrDataUrl, loading }: QRPairingPanelProps) {
  return (
    <div className="flex aspect-square items-center justify-center border border-line bg-white p-3">
      {loading ? (
        <LoaderCircle className="h-10 w-10 animate-spin text-slate-500" />
      ) : qrDataUrl ? (
        <img className="h-full w-full object-contain" src={qrDataUrl} alt="LensBridge pairing QR code" />
      ) : (
        <div className="text-center text-slate-500">
          <QrCode className="mx-auto mb-3 h-10 w-10" />
          QR unavailable
        </div>
      )}
    </div>
  );
}
