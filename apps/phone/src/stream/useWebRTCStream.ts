import type { PairingPayload, QualityProfileId, StreamMetrics } from "@lensbridge/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { startPhonePeer, type PhonePeer } from "./webrtc";

export function useWebRTCStream(pairing: PairingPayload, stream: MediaStream | null, quality: QualityProfileId) {
  const [status, setStatus] = useState("idle");
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<PhonePeer | null>(null);
  const shouldStreamRef = useRef(false);
  const previousStreamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    shouldStreamRef.current = true;

    if (!stream) {
      setStatus("waiting-camera");
      return;
    }

    setError(null);
    setStatus("connecting");
    try {
      peerRef.current?.stop();
      peerRef.current = await startPhonePeer({
        pairing,
        stream,
        quality,
        onStatus: setStatus,
        onMetrics: setMetrics,
        onRemoteDisconnect: () => {
          shouldStreamRef.current = false;
          peerRef.current = null;
          setMetrics({});
        }
      });
    } catch (err) {
      shouldStreamRef.current = false;
      peerRef.current = null;
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Could not start WebRTC stream.");
    }
  }, [pairing, quality, stream]);

  const stop = useCallback(() => {
    shouldStreamRef.current = false;
    peerRef.current?.stop();
    peerRef.current = null;
    setMetrics({});
    setStatus("stopped");
  }, []);

  useEffect(() => {
    const streamChanged = previousStreamRef.current !== stream;
    previousStreamRef.current = stream;

    if (!shouldStreamRef.current || !streamChanged) return;

    if (!stream) {
      peerRef.current?.stop();
      peerRef.current = null;
      setStatus("waiting-camera");
      return;
    }

    void start();
  }, [start, stream]);

  useEffect(() => stop, [stop]);

  return { status, metrics, error, start, stop };
}
