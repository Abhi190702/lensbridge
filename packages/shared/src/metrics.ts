export interface StreamMetrics {
  fps: number;
  bitrateKbps: number;
  width: number;
  height: number;
  latencyMs: number;
  packetLoss: number;
  jitter: number;
  codec: string;
  connectedAt: string;
  lastFrameAt: string;
}

export const unavailableMetrics: Partial<StreamMetrics> = {
  codec: "Unavailable"
};

export interface FramePumpBenchmarkSample {
  capturedFrames: number;
  deliveredFrames: number;
  droppedFrames: number;
  frameSendDurationsMs: number[];
}

export interface FramePumpBenchmarkSummary {
  actualFps: number;
  droppedFrames: number;
  averageFrameSendMs: number;
  p95FrameSendMs: number;
}

export function summarizeFramePumpBenchmark(
  sample: FramePumpBenchmarkSample,
  durationSeconds: number
): FramePumpBenchmarkSummary {
  const durations = [...sample.frameSendDurationsMs].sort((left, right) => left - right);
  const average = durations.length ? durations.reduce((total, value) => total + value, 0) / durations.length : 0;
  const p95 = durations.length ? durations[Math.floor((durations.length - 1) * 0.95)] ?? 0 : 0;

  return {
    actualFps: durationSeconds > 0 ? sample.deliveredFrames / durationSeconds : 0,
    droppedFrames: Math.max(sample.droppedFrames, Math.max(0, sample.capturedFrames - sample.deliveredFrames)),
    averageFrameSendMs: average,
    p95FrameSendMs: p95
  };
}
