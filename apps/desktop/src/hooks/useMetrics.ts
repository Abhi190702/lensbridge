import type { StreamMetrics } from "@lensbridge/shared";

export function useMetrics(metrics: Partial<StreamMetrics>) {
  return {
    fps: metrics.fps ?? null,
    latencyMs: metrics.latencyMs ?? null,
    bitrateKbps: metrics.bitrateKbps ?? null,
    resolution: metrics.width && metrics.height ? `${metrics.width}x${metrics.height}` : "Unavailable"
  };
}
