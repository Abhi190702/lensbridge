import type { StreamMetrics } from "@lensbridge/shared";

export interface OutboundMetricsSample {
  bytesSent: number;
  timestamp: number;
}

export interface OutboundMetricsResult {
  metrics: Partial<StreamMetrics>;
  sample: OutboundMetricsSample | null;
}

export async function readOutboundMetrics(
  peer: RTCPeerConnection,
  previousSample: OutboundMetricsSample | null = null
): Promise<OutboundMetricsResult> {
  const stats = await peer.getStats();
  let metrics: Partial<StreamMetrics> = {
    lastFrameAt: new Date().toISOString()
  };
  let sample: OutboundMetricsSample | null = null;

  stats.forEach((report) => {
    if (report.type === "outbound-rtp" && report.kind === "video") {
      const bytesSent = Number(report.bytesSent ?? 0);
      sample = {
        bytesSent,
        timestamp: Number(report.timestamp ?? performance.now())
      };

      metrics = {
        ...metrics,
        fps: report.framesPerSecond,
        bitrateKbps: bitrateFromSamples(previousSample, sample),
        packetLoss: report.packetsLost,
        codec: report.codecId
      };
    }
    if (report.type === "track" && report.kind === "video") {
      metrics = {
        ...metrics,
        width: report.frameWidth,
        height: report.frameHeight
      };
    }
  });

  return { metrics, sample };
}

function bitrateFromSamples(
  previousSample: OutboundMetricsSample | null,
  currentSample: OutboundMetricsSample | null
) {
  if (!previousSample || !currentSample) return undefined;

  const elapsedMs = currentSample.timestamp - previousSample.timestamp;
  const bytesDelta = currentSample.bytesSent - previousSample.bytesSent;

  if (elapsedMs <= 0 || bytesDelta < 0) return undefined;

  return Math.round((bytesDelta * 8) / elapsedMs);
}
