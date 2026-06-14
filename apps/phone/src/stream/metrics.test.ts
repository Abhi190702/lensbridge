import { describe, expect, it } from "vitest";
import { readOutboundMetrics, type OutboundMetricsSample } from "./metrics";

describe("readOutboundMetrics", () => {
  it("reports bitrate from byte deltas instead of cumulative bytes", async () => {
    const previous: OutboundMetricsSample = {
      bytesSent: 1_000,
      timestamp: 1_000
    };

    const { metrics, sample } = await readOutboundMetrics(
      fakePeerStats([
        {
          type: "outbound-rtp",
          kind: "video",
          bytesSent: 4_000,
          timestamp: 2_000,
          framesPerSecond: 30,
          codecId: "codec-1"
        },
        {
          type: "track",
          kind: "video",
          frameWidth: 1280,
          frameHeight: 720
        }
      ]),
      previous
    );

    expect(metrics.bitrateKbps).toBe(24);
    expect(metrics.fps).toBe(30);
    expect(metrics.width).toBe(1280);
    expect(metrics.height).toBe(720);
    expect(sample).toEqual({ bytesSent: 4_000, timestamp: 2_000 });
  });
});

function fakePeerStats(reports: Array<Record<string, unknown>>) {
  return {
    getStats: async () => ({
      forEach(callback: (report: Record<string, unknown>) => void) {
        reports.forEach(callback);
      }
    })
  } as unknown as RTCPeerConnection;
}
