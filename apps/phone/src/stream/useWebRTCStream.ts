import type { PairingPayload, StreamMetrics } from "@lensbridge/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { startPhonePeer, type PhonePeer } from "./webrtc";

export function useWebRTCStream(pairing: PairingPayload, stream: MediaStream | null) {
  const [status, setStatus] = useState("idle");
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<PhonePeer | null>(null);

  const start = useCallback(async () => {
    if (!stream) return;
    setError(null);
    setStatus("connecting");
    try {
      peerRef.current?.stop();
      peerRef.current = await startPhonePeer({
        pairing,
        stream,
        onStatus: setStatus,
        onMetrics: setMetrics
      });
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Could not start WebRTC stream.");
    }
  }, [pairing, stream]);

  const stop = useCallback(() => {
    peerRef.current?.stop();
    peerRef.current = null;
    setStatus("stopped");
  }, []);

  useEffect(() => stop, [stop]);

  return { status, metrics, error, start, stop };
}
