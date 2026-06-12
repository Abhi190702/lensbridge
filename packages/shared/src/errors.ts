export type LensBridgeErrorCode =
  | "camera-permission-denied"
  | "camera-unavailable"
  | "browser-unsupported"
  | "insecure-context"
  | "network-unreachable"
  | "desktop-unavailable"
  | "invalid-pairing-token"
  | "expired-session"
  | "webrtc-failed"
  | "signaling-failed"
  | "virtual-camera-unavailable"
  | "not-implemented";

export interface LensBridgeErrorShape {
  code: LensBridgeErrorCode;
  message: string;
  technicalDetail?: string;
  suggestedFix?: string;
}
