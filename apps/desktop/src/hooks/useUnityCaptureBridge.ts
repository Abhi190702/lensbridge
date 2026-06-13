import { useEffect, useMemo, useRef, useState } from "react";
import { publishUnityCaptureFrame, resetUnityCaptureBridge } from "../lib/api";

const TARGET_WIDTH = 960;
const TARGET_HEIGHT = 540;
const ACTIVE_INTERVAL_MS = 1000 / 12;
const WAITING_INTERVAL_MS = 1000;

export type DirectCameraBridgeStatus = "idle" | "waitingForTarget" | "streaming" | "error";

export interface DirectCameraBridgeState {
  status: DirectCameraBridgeStatus;
  enabled: boolean;
  fps: number;
  framesDelivered: number;
  resolution: string;
  message: string;
  skippedFrame: boolean;
}

const INITIAL_STATE: DirectCameraBridgeState = {
  status: "idle",
  enabled: true,
  fps: 0,
  framesDelivered: 0,
  resolution: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
  message: "Connect your phone, then select LensBridge Camera in Chrome or another app.",
  skippedFrame: false
};

export function useUnityCaptureBridge(stream: MediaStream | null, mirror: boolean) {
  const [state, setState] = useState<DirectCameraBridgeState>(INITIAL_STATE);
  const frameCounter = useRef({ frames: 0, startedAt: performance.now() });

  useEffect(() => {
    let disposed = false;
    let timer: number | null = null;
    let inFlight = false;

    if (!stream) {
      void resetUnityCaptureBridge();
      setState(INITIAL_STATE);
      return undefined;
    }

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    if (!context) {
      setState((current) => ({
        ...current,
        status: "error",
        message: "Could not create the frame canvas for LensBridge Camera."
      }));
      return undefined;
    }
    const frameContext = context;

    async function pumpFrame() {
      if (disposed || inFlight) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        schedule(WAITING_INTERVAL_MS);
        return;
      }

      inFlight = true;
      try {
        frameContext.drawImage(video, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        const imageData = frameContext.getImageData(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        const result = await publishUnityCaptureFrame({
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          rgbaBase64: bytesToBase64(imageData.data),
          mirror
        });

        if (disposed) return;

        if (result.delivered) {
          frameCounter.current.frames += 1;
          const now = performance.now();
          const elapsedMs = now - frameCounter.current.startedAt;
          const fps =
            elapsedMs >= 1000
              ? Math.round((frameCounter.current.frames * 1000) / elapsedMs)
              : state.fps;

          if (elapsedMs >= 1000) {
            frameCounter.current = { frames: 0, startedAt: now };
          }

          setState({
            status: "streaming",
            enabled: true,
            fps,
            framesDelivered: result.framesDelivered,
            resolution: `${result.width}x${result.height}`,
            message: result.message,
            skippedFrame: result.skippedFrame
          });
          schedule(ACTIVE_INTERVAL_MS);
          return;
        }

        setState((current) => ({
          ...current,
          status: "waitingForTarget",
          fps: 0,
          framesDelivered: result.framesDelivered,
          message: result.message,
          skippedFrame: false
        }));
        schedule(WAITING_INTERVAL_MS);
      } catch (error) {
        if (!disposed) {
          setState((current) => ({
            ...current,
            status: "error",
            fps: 0,
            message: error instanceof Error ? error.message : "LensBridge Camera frame bridge failed."
          }));
          schedule(WAITING_INTERVAL_MS);
        }
      } finally {
        inFlight = false;
      }
    }

    function schedule(delayMs: number) {
      if (disposed) return;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => void pumpFrame(), delayMs);
    }

    void video.play().catch(() => undefined);
    setState((current) => ({
      ...current,
      status: "waitingForTarget",
      message: "Phone stream is ready. Select LensBridge Camera in the target app to start the direct bridge."
    }));
    schedule(250);

    return () => {
      disposed = true;
      if (timer) window.clearTimeout(timer);
      video.pause();
      video.srcObject = null;
      void resetUnityCaptureBridge();
    };
  }, [stream, mirror]);

  return useMemo(() => state, [state]);
}

function bytesToBase64(bytes: Uint8ClampedArray) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
