import type { StreamMetrics } from "./metrics";

export type SignalingRole = "desktop" | "phone";

export type SignalingMessage =
  | {
      type: "hello";
      role: SignalingRole;
      sessionId: string;
      token: string;
      deviceId?: string;
      deviceName?: string;
      platform?: string;
      userAgent?: string;
      pairingCode?: string;
    }
  | {
      type: "hello-ack";
      sessionId: string;
      accepted: boolean;
      reason?: string;
    }
  | {
      type: "pairing-approved";
      sessionId: string;
      deviceId?: string;
      trusted: boolean;
    }
  | {
      type: "pairing-rejected";
      sessionId: string;
      deviceId?: string;
      reason: string;
    }
  | {
      type: "offer";
      sessionId: string;
      deviceId?: string;
      sdp: RTCSessionDescriptionInit;
    }
  | {
      type: "answer";
      sessionId: string;
      sdp: RTCSessionDescriptionInit;
    }
  | {
      type: "ice-candidate";
      sessionId: string;
      deviceId?: string;
      candidate: RTCIceCandidateInit;
    }
  | {
      type: "stream-started";
      sessionId: string;
      deviceId?: string;
      metrics?: Partial<StreamMetrics>;
    }
  | {
      type: "stream-stopped";
      sessionId: string;
      deviceId?: string;
      reason?: string;
    }
  | {
      type: "metrics";
      sessionId: string;
      deviceId?: string;
      metrics: Partial<StreamMetrics>;
    }
  | {
      type: "ice-restart-request";
      sessionId: string;
      reason?: string;
    }
  | {
      type: "error";
      sessionId?: string;
      code: string;
      message: string;
      technicalDetail?: string;
    }
  | {
      type: "disconnect";
      sessionId: string;
      deviceId?: string;
      reason?: string;
    };

export interface SignalingEnvelope {
  from: SignalingRole;
  to?: SignalingRole;
  message: SignalingMessage;
  sentAt: string;
}

export function isSignalingMessage(value: unknown): value is SignalingMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return typeof message.type === "string";
}
