import { useState } from "react";
import { PairingCard } from "../components/PairingCard";
import { QualityPanel } from "../components/QualityPanel";
import { SourcePreview } from "../components/SourcePreview";
import { ErrorState } from "../components/ErrorState";
import { ConnectedSourceCard } from "../components/ConnectedSourceCard";
import { OutputModeSelector } from "../components/OutputModeSelector";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StreamHealthCard } from "../components/StreamHealthCard";
import type { useDesktopReceiver } from "../hooks/useDesktopEvents";
import type { usePairing } from "../hooks/usePairing";

interface DashboardProps {
  pairing: ReturnType<typeof usePairing>;
  receiver: ReturnType<typeof useDesktopReceiver>;
  onOpenObsOutput: () => void;
  onOpenGuide: () => void;
}

export function Dashboard({ pairing, receiver, onOpenObsOutput, onOpenGuide }: DashboardProps) {
  const [mirrorPreview, setMirrorPreview] = useState(false);
  const streamReady = Boolean(receiver.remoteStream);

  return (
    <div className="grid gap-5">
      {pairing.error ? <ErrorState message={pairing.error} onRetry={pairing.refresh} /> : null}
      {receiver.error ? <ErrorState message={receiver.error} /> : null}
      {streamReady ? (
        <>
          <ConnectedSourceCard status={receiver.status} streamReady={streamReady} />
          <PrimaryActionBar
            streamReady={streamReady}
            onOpenObsOutput={onOpenObsOutput}
            onOpenGuide={onOpenGuide}
            onDisconnect={receiver.disconnect}
          />
        </>
      ) : (
        <PairingCard
          session={pairing.session}
          qrDataUrl={pairing.qrDataUrl}
          phoneUrl={pairing.phoneUrl}
          expiresInSeconds={pairing.expiresInSeconds}
          loading={pairing.loading}
          onRegenerate={pairing.regenerate}
        />
      )}
      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <SourcePreview
          stream={receiver.remoteStream}
          metrics={receiver.metrics}
          mirrored={mirrorPreview}
          onToggleMirror={() => setMirrorPreview((value) => !value)}
        />
        <div className="grid gap-5">
          <OutputModeSelector streamReady={streamReady} onOpenObsOutput={onOpenObsOutput} />
          {streamReady ? <StreamHealthCard metrics={receiver.metrics} /> : null}
          <QualityPanel />
        </div>
      </div>
    </div>
  );
}
