import { useState } from "react";
import { PairingCard } from "../components/PairingCard";
import { QualityPanel } from "../components/QualityPanel";
import { SourcePreview } from "../components/SourcePreview";
import { ErrorState } from "../components/ErrorState";
import { ConnectedSourceCard } from "../components/ConnectedSourceCard";
import { OutputModeSelector } from "../components/OutputModeSelector";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StreamHealthCard } from "../components/StreamHealthCard";
import { DirectCameraBridgePanel } from "../components/DirectCameraBridgePanel";
import type { useDesktopReceiver } from "../hooks/useDesktopEvents";
import type { DirectCameraBridgeState } from "../hooks/useUnityCaptureBridge";
import type { usePairing } from "../hooks/usePairing";

interface DashboardProps {
  pairing: ReturnType<typeof usePairing>;
  receiver: ReturnType<typeof useDesktopReceiver>;
  directCamera: DirectCameraBridgeState;
  onOpenObsOutput: () => void;
  onOpenGuide: () => void;
}

export function Dashboard({ pairing, receiver, directCamera, onOpenObsOutput, onOpenGuide }: DashboardProps) {
  const [mirrorPreview, setMirrorPreview] = useState(false);
  const streamReady = Boolean(receiver.remoteStream);

  return (
    <div className="grid gap-4">
      {pairing.error ? <ErrorState message={pairing.error} onRetry={pairing.refresh} /> : null}
      {receiver.error ? <ErrorState message={receiver.error} /> : null}
      {streamReady ? (
        <div className="grid gap-3">
          <ConnectedSourceCard status={receiver.status} streamReady={streamReady} />
          <PrimaryActionBar
            streamReady={streamReady}
            onOpenObsOutput={onOpenObsOutput}
            onOpenGuide={onOpenGuide}
            onDisconnect={receiver.disconnect}
          />
        </div>
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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <SourcePreview
          stream={receiver.remoteStream}
          metrics={receiver.metrics}
          mirrored={mirrorPreview}
          onToggleMirror={() => setMirrorPreview((value) => !value)}
        />
        <div className="grid content-start gap-4">
          <DirectCameraBridgePanel bridge={directCamera} compact />
          <OutputModeSelector streamReady={streamReady} onOpenObsOutput={onOpenObsOutput} />
          {streamReady ? <StreamHealthCard metrics={receiver.metrics} /> : null}
          <QualityPanel />
        </div>
      </div>
    </div>
  );
}
