import type { PairingPayload, QualityProfileId, StreamMetrics } from "@lensbridge/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { nextReconnectDelay } from "./reconnect";
import { startPhonePeer, type PhonePeer } from "./webrtc";

interface WebRTCStreamOptions {
  autoReconnect?: boolean;
}

export function useWebRTCStream(
  pairing: PairingPayload,
  stream: MediaStream | null,
  quality: QualityProfileId,
  options: WebRTCStreamOptions = {}
) {
  const [status, setStatus] = useState("idle");
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<PhonePeer | null>(null);
  const shouldStreamRef = useRef(false);
  const previousStreamRef = useRef<MediaStream | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);
  const autoReconnect = options.autoReconnect ?? true;

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    shouldStreamRef.current = true;
    clearReconnectTimer();

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
        },
        onError: setError,
        onQualityUpdated: () => {
          setMetrics((current) => ({ ...current, lastFrameAt: new Date().toISOString() }));
        }
      });
    } catch (err) {
      shouldStreamRef.current = false;
      peerRef.current = null;
      setStatus("failed");
      setError(err instanceof Error ? err.message : "Could not start WebRTC stream.");
    }
  }, [clearReconnectTimer, pairing, quality, stream]);

  const stop = useCallback(() => {
    shouldStreamRef.current = false;
    clearReconnectTimer();
    peerRef.current?.stop();
    peerRef.current = null;
    setMetrics({});
    setStatus("stopped");
  }, [clearReconnectTimer]);

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

  useEffect(() => {
    if (status === "connected") {
      reconnectAttemptRef.current = 0;
      return;
    }

    if (
      !autoReconnect ||
      !shouldStreamRef.current ||
      !stream ||
      reconnectTimerRef.current !== null ||
      (status !== "failed" && status !== "disconnected")
    ) {
      return;
    }

    const delay = nextReconnectDelay(reconnectAttemptRef.current);
    reconnectAttemptRef.current += 1;
    reconnectTimerRef.current = window.setTimeout(() => {
      reconnectTimerRef.current = null;
      void start();
    }, delay);

    return clearReconnectTimer;
  }, [autoReconnect, clearReconnectTimer, start, status, stream]);

  useEffect(() => {
    if (!shouldStreamRef.current || !peerRef.current) return;
    void peerRef.current.updateQuality(quality).catch((err) => {
      setError(err instanceof Error ? err.message : "Could not update WebRTC quality.");
    });
  }, [quality]);

  useEffect(() => stop, [stop]);

  return { status, metrics, error, start, stop };
}
