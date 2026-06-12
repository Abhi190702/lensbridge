export type TransportType =
  | "wifi-webrtc"
  | "usb-adb"
  | "bluetooth-pairing"
  | "wifi-direct"
  | "remote-turn"
  | "rtsp"
  | "ndi"
  | "srt";

export type TransportStatus = "available" | "planned" | "experimental" | "connected" | "disconnected" | "failed";

export interface TransportHealth {
  latencyMs?: number;
  jitterMs?: number;
  packetLoss?: number;
  signal?: "excellent" | "good" | "fair" | "poor" | "unavailable";
}

export interface LensBridgeTransport {
  id: string;
  name: string;
  type: TransportType;
  status: TransportStatus;
  description: string;
  health?: TransportHealth;
}
