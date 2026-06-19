import { useEffect, useMemo, useRef, useState } from "react";
import { publishUnityCaptureFrame, resetUnityCaptureBridge } from "../lib/api";

const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;
const TARGET_FPS = 30;
const ACTIVE_INTERVAL_MS = 1000 / TARGET_FPS;
const WAITING_INTERVAL_MS = 1000;
const UI_UPDATE_INTERVAL_MS = 500;

export type DirectCameraBridgeStatus = "idle" | "waitingForTarget" | "streaming" | "error";

export interface DirectCameraBridgeState {
  status: DirectCameraBridgeStatus;
  enabled: boolean;
  fps: number;
  framesDelivered: number;
  droppedFrames: number;
  averageFrameSendMs: number;
  p95FrameSendMs: number;
  lastFrameSendMs: number;
  rustFrameWriteMs: number;
  resolution: string;
  message: string;
  skippedFrame: boolean;
}

interface CapturedFrame {
  bytes: Uint8Array;
}

const INITIAL_STATE: DirectCameraBridgeState = {
  status: "idle",
  enabled: true,
  fps: 0,
  framesDelivered: 0,
  droppedFrames: 0,
  averageFrameSendMs: 0,
  p95FrameSendMs: 0,
  lastFrameSendMs: 0,
  rustFrameWriteMs: 0,
  resolution: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
  message: "Connect your phone, then select LensBridge Camera in Chrome or another app.",
  skippedFrame: false
};

export function useUnityCaptureBridge(stream: MediaStream | null, mirror: boolean) {
  const [state, setState] = useState<DirectCameraBridgeState>(INITIAL_STATE);
  const frameCounter = useRef({ frames: 0, startedAt: performance.now() });
  const lastFps = useRef(0);
  const lastUiUpdateAt = useRef(0);
  const latestFrame = useRef<CapturedFrame | null>(null);
  const droppedFrameCount = useRef(0);
  const frameSendDurations = useRef<number[]>([]);

  useEffect(() => {
    let disposed = false;
    let captureRaf: number | null = null;
    let captureVideoFrameCallback: number | null = null;
    let transportTimer: number | null = null;
    let transportInFlight = false;
    let lastCaptureAt = 0;

    if (!stream) {
      latestFrame.current = null;
      void resetUnityCaptureBridge();
      setState(INITIAL_STATE);
      return undefined;
    }

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const context = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: true
    });

    if (!context) {
      setState((current) => ({
        ...current,
        status: "error",
        message: "Could not create the frame canvas for LensBridge Camera."
      }));
      return undefined;
    }

    const frameContext = context;
    frameContext.imageSmoothingEnabled = true;
    frameContext.imageSmoothingQuality = "high";
    frameCounter.current = { frames: 0, startedAt: performance.now() };
    lastFps.current = 0;
    lastUiUpdateAt.current = 0;
    latestFrame.current = null;
    droppedFrameCount.current = 0;
    frameSendDurations.current = [];

    function captureLatestFrame(now = performance.now()) {
      if (disposed || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      if (now - lastCaptureAt < ACTIVE_INTERVAL_MS * 0.75) return;

      lastCaptureAt = now;
      drawDirectShowFrame(frameContext, video, TARGET_WIDTH, TARGET_HEIGHT);
      const imageData = frameContext.getImageData(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      if (latestFrame.current) {
        droppedFrameCount.current += 1;
      }
      latestFrame.current = {
        bytes: new Uint8Array(imageData.data.buffer, imageData.data.byteOffset, imageData.data.byteLength)
      };
    }

    function scheduleCapture() {
      if (disposed) return;
      if ("requestVideoFrameCallback" in video) {
        captureVideoFrameCallback = video.requestVideoFrameCallback((now) => {
          captureVideoFrameCallback = null;
          captureLatestFrame(now);
          scheduleCapture();
        });
        return;
      }

      captureRaf = window.requestAnimationFrame((now) => {
        captureRaf = null;
        captureLatestFrame(now);
        scheduleCapture();
      });
    }

    function recordFrameSendDuration(durationMs: number) {
      frameSendDurations.current.push(durationMs);
      if (frameSendDurations.current.length > 240) {
        frameSendDurations.current.shift();
      }
    }

    function averageFrameSendDuration() {
      if (!frameSendDurations.current.length) return 0;
      return frameSendDurations.current.reduce((total, value) => total + value, 0) / frameSendDurations.current.length;
    }

    function p95FrameSendDuration() {
      if (!frameSendDurations.current.length) return 0;
      const sorted = [...frameSendDurations.current].sort((left, right) => left - right);
      return sorted[Math.floor((sorted.length - 1) * 0.95)] ?? 0;
    }

    async function flushLatestFrame() {
      if (disposed) return;

      if (transportInFlight) {
        scheduleTransport(ACTIVE_INTERVAL_MS);
        return;
      }

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        scheduleTransport(WAITING_INTERVAL_MS);
        return;
      }

      const frame = latestFrame.current;
      if (!frame) {
        scheduleTransport(ACTIVE_INTERVAL_MS);
        return;
      }

      latestFrame.current = null;
      transportInFlight = true;
      const startedAt = performance.now();

      try {
        const result = await publishUnityCaptureFrame({
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          rgbaBytes: frame.bytes,
          mirror
        });
        const sendDurationMs = performance.now() - startedAt;
        recordFrameSendDuration(sendDurationMs);

        if (disposed) return;

        if (result.delivered) {
          updateStreamingState(result);
          scheduleTransport(nextActiveDelay(startedAt, result.skippedFrame));
          return;
        }

        setState((current) => ({
          ...current,
          status: "waitingForTarget",
          fps: 0,
          framesDelivered: result.framesDelivered,
          droppedFrames: droppedFrameCount.current,
          averageFrameSendMs: averageFrameSendDuration(),
          p95FrameSendMs: p95FrameSendDuration(),
          lastFrameSendMs: sendDurationMs,
          rustFrameWriteMs: microsToMs(result.rustFrameWriteMicros),
          resolution: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
          message: result.message,
          skippedFrame: false
        }));
        scheduleTransport(WAITING_INTERVAL_MS);
      } catch (error) {
        if (!disposed) {
          setState((current) => ({
            ...current,
            status: "error",
            fps: 0,
            message: error instanceof Error ? error.message : "LensBridge Camera frame bridge failed."
          }));
          scheduleTransport(WAITING_INTERVAL_MS);
        }
      } finally {
        transportInFlight = false;
      }
    }

    function updateStreamingState(result: Awaited<ReturnType<typeof publishUnityCaptureFrame>>) {
      frameCounter.current.frames += 1;
      const now = performance.now();
      const elapsedMs = now - frameCounter.current.startedAt;
      const fps = elapsedMs >= 1000 ? Math.round((frameCounter.current.frames * 1000) / elapsedMs) : lastFps.current;

      if (elapsedMs >= 1000) {
        lastFps.current = fps;
        frameCounter.current = { frames: 0, startedAt: now };
      }

      if (now - lastUiUpdateAt.current < UI_UPDATE_INTERVAL_MS && result.framesDelivered > 1) return;

      lastUiUpdateAt.current = now;
      setState({
        status: "streaming",
        enabled: true,
        fps,
        framesDelivered: result.framesDelivered,
        droppedFrames: droppedFrameCount.current,
        averageFrameSendMs: averageFrameSendDuration(),
        p95FrameSendMs: p95FrameSendDuration(),
        lastFrameSendMs: frameSendDurations.current.at(-1) ?? 0,
        rustFrameWriteMs: microsToMs(result.rustFrameWriteMicros),
        resolution: `${result.width}x${result.height}`,
        message: result.message,
        skippedFrame: result.skippedFrame
      });
    }

    function scheduleTransport(delayMs: number) {
      if (disposed) return;
      if (transportTimer) window.clearTimeout(transportTimer);
      transportTimer = window.setTimeout(() => {
        transportTimer = null;
        void flushLatestFrame();
      }, delayMs);
    }

    void video.play().catch(() => undefined);
    setState((current) => ({
      ...current,
      status: "waitingForTarget",
      resolution: `${TARGET_WIDTH}x${TARGET_HEIGHT}`,
      message: "Phone stream is ready. Select LensBridge Camera in the target app to start the direct bridge."
    }));
    scheduleCapture();
    scheduleTransport(250);

    return () => {
      disposed = true;
      latestFrame.current = null;
      if (captureRaf !== null) window.cancelAnimationFrame(captureRaf);
      if (captureVideoFrameCallback !== null && "cancelVideoFrameCallback" in video) {
        video.cancelVideoFrameCallback(captureVideoFrameCallback);
      }
      if (transportTimer) window.clearTimeout(transportTimer);
      video.pause();
      video.srcObject = null;
      void resetUnityCaptureBridge();
    };
  }, [stream, mirror]);

  return useMemo(() => state, [state]);
}

function nextActiveDelay(startedAt: number, receiverSkippedFrame: boolean) {
  const elapsedMs = performance.now() - startedAt;
  const targetInterval = receiverSkippedFrame ? ACTIVE_INTERVAL_MS * 1.2 : ACTIVE_INTERVAL_MS;
  return Math.max(0, targetInterval - elapsedMs);
}

function microsToMs(value?: number) {
  return value ? value / 1000 : 0;
}

function drawDirectShowFrame(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  targetWidth: number,
  targetHeight: number
) {
  const sourceWidth = video.videoWidth || targetWidth;
  const sourceHeight = video.videoHeight || targetHeight;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  let drawWidth = targetWidth;
  let drawHeight = targetHeight;
  let drawX = 0;
  let drawY = 0;

  if (sourceRatio > targetRatio) {
    drawHeight = targetHeight;
    drawWidth = targetHeight * sourceRatio;
    drawX = (targetWidth - drawWidth) / 2;
  } else {
    drawWidth = targetWidth;
    drawHeight = targetWidth / sourceRatio;
    drawY = (targetHeight - drawHeight) / 2;
  }

  context.save();
  context.fillStyle = "#000";
  context.fillRect(0, 0, targetWidth, targetHeight);
  context.translate(0, targetHeight);
  context.scale(1, -1);
  context.drawImage(video, drawX, drawY, drawWidth, drawHeight);
  context.restore();
}
