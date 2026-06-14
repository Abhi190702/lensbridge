import type { PairingPayload, QualityProfileId } from "@lensbridge/shared";
import { useMemo, useState } from "react";
import { useCamera } from "./camera/useCamera";
import {
  parseAutoReconnectFromLocation,
  parsePairingFromLocation,
  parseQualityFromLocation
} from "./pairing/parsePairingUrl";
import { ConnectPage } from "./pages/ConnectPage";
import { ErrorPage } from "./pages/ErrorPage";
import { PermissionPage } from "./pages/PermissionPage";
import { StreamPage } from "./pages/StreamPage";
import { browserSupport } from "./utils/browserSupport";

export default function App() {
  const initialPayload = useMemo(() => parsePairingFromLocation(window.location), []);
  const initialQuality = useMemo(() => parseQualityFromLocation(window.location) ?? "balanced", []);
  const autoReconnect = useMemo(() => parseAutoReconnectFromLocation(window.location), []);
  const [pairing, setPairing] = useState<PairingPayload | null>(initialPayload.payload);
  const [quality, setQuality] = useState<QualityProfileId>(initialQuality);
  const camera = useCamera(quality);
  const support = browserSupport();

  if (!support.supported) {
    return <ErrorPage title={support.title} message={support.reason} />;
  }

  if (!pairing) {
    return <ConnectPage initialError={initialPayload.error} onPair={setPairing} />;
  }

  if (!camera.stream) {
    return <PermissionPage pairing={pairing} camera={camera} quality={quality} onQualityChange={setQuality} />;
  }

  return (
    <StreamPage
      pairing={pairing}
      camera={camera}
      quality={quality}
      autoReconnect={autoReconnect}
      onQualityChange={setQuality}
    />
  );
}
