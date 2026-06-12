import type { StreamMetrics } from "@lensbridge/shared";

export async function readOutboundMetrics(peer: RTCPeerConnection): Promise<Partial<StreamMetrics>> {
  const stats = await peer.getStats();
  let result: Partial<StreamMetrics> = {
    lastFrameAt: new Date().toISOString()
  };

  stats.forEach((report) => {
    if (report.type === "outbound-rtp" && report.kind === "video") {
      result = {
        ...result,
        fps: report.framesPerSecond,
        bitrateKbps: report.bytesSent ? Math.round((Number(report.bytesSent) * 8) / 1000) : undefined,
        packetLoss: report.packetsLost,
        codec: report.codecId
      };
    }
    if (report.type === "track" && report.kind === "video") {
      result = {
        ...result,
        width: report.frameWidth,
        height: report.frameHeight
      };
    }
  });

  return result;
}
