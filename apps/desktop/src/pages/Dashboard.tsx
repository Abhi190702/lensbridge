import { PairingCard } from "../components/PairingCard";
import { QualityPanel } from "../components/QualityPanel";
import { SourcePreview } from "../components/SourcePreview";
import { ErrorState } from "../components/ErrorState";
import type { useDesktopReceiver } from "../hooks/useDesktopEvents";
import type { usePairing } from "../hooks/usePairing";

interface DashboardProps {
  pairing: ReturnType<typeof usePairing>;
  receiver: ReturnType<typeof useDesktopReceiver>;
}

export function Dashboard({ pairing, receiver }: DashboardProps) {
  return (
    <div className="grid gap-5">
      {pairing.error ? <ErrorState message={pairing.error} onRetry={pairing.refresh} /> : null}
      {receiver.error ? <ErrorState message={receiver.error} /> : null}
      <PairingCard
        session={pairing.session}
        qrDataUrl={pairing.qrDataUrl}
        phoneUrl={pairing.phoneUrl}
        expiresInSeconds={pairing.expiresInSeconds}
        loading={pairing.loading}
        onRegenerate={pairing.regenerate}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <SourcePreview stream={receiver.remoteStream} metrics={receiver.metrics} />
        <QualityPanel />
      </div>
    </div>
  );
}
