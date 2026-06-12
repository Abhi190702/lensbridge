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
