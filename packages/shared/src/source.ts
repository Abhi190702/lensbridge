export type SourceType =
  | "phone-webrtc"
  | "desktop-webrtc"
  | "ip-camera-rtsp"
  | "obs-source"
  | "screen-capture"
  | "raspberry-pi"
  | "dslr"
  | "gopro"
  | "plugin";

export type SourceStatus = "available" | "planned" | "experimental" | "connected" | "disconnected" | "failed";

export interface SourceCapabilities {
  video: boolean;
  audio: boolean;
  resolutions: string[];
  frameRates: number[];
  supportsFocus: boolean;
  supportsZoom: boolean;
  supportsTorch: boolean;
  supportsAudio: boolean;
  supportsPTZ: boolean;
  supportsHardwareEncoding: boolean;
}

export interface LensBridgeSource {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  capabilities: SourceCapabilities;
  roadmap?: string;
}

export const defaultPhoneCapabilities: SourceCapabilities = {
  video: true,
  audio: false,
  resolutions: ["480p", "720p", "1080p"],
  frameRates: [24, 30, 60],
  supportsFocus: true,
  supportsZoom: true,
  supportsTorch: true,
  supportsAudio: false,
  supportsPTZ: false,
  supportsHardwareEncoding: true
};
