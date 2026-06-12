import type { QualityProfileId } from "@lensbridge/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import { constraintsForQuality } from "./constraints";
import { cameraErrorMessage } from "./cameraErrors";

export interface UseCameraResult {
  stream: MediaStream | null;
  facingMode: "user" | "environment";
  error: string | null;
  loading: boolean;
  start: () => Promise<void>;
  stop: () => void;
  switchCamera: () => Promise<void>;
}

export function useCamera(quality: QualityProfileId): UseCameraResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      stop();
      const next = await navigator.mediaDevices.getUserMedia(constraintsForQuality(quality, facingMode));
      streamRef.current = next;
      setStream(next);
    } catch (err) {
      setError(cameraErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [facingMode, quality, stop]);

  const switchCamera = useCallback(async () => {
    setFacingMode((current) => (current === "environment" ? "user" : "environment"));
  }, []);

  useEffect(() => {
    if (!streamRef.current) return;
    void start();
  }, [facingMode, quality, start]);

  useEffect(() => stop, [stop]);

  return { stream, facingMode, error, loading, start, stop, switchCamera };
}
