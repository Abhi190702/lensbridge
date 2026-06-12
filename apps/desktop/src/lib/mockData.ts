import type { LensBridgeSource } from "@lensbridge/shared";
import { defaultPhoneCapabilities } from "@lensbridge/shared";

export const mockSources: LensBridgeSource[] = [
  {
    id: "phone-webrtc",
    name: "Phone Camera",
    type: "phone-webrtc",
    status: "available",
    capabilities: defaultPhoneCapabilities,
    roadmap: "Implemented as the V1 source path through the phone PWA and WebRTC."
  },
  {
    id: "desktop-webrtc",
    name: "Another Computer",
    type: "desktop-webrtc",
    status: "planned",
    capabilities: { ...defaultPhoneCapabilities, supportsTorch: false },
    roadmap: "Planned V3 source for sharing another computer's webcam."
  },
  {
    id: "ip-camera-rtsp",
    name: "IP Camera",
    type: "ip-camera-rtsp",
    status: "planned",
    capabilities: { ...defaultPhoneCapabilities, supportsFocus: false, supportsZoom: false, supportsTorch: false, supportsPTZ: true },
    roadmap: "Planned V3 RTSP/ONVIF ingest. Not active in V1."
  },
  {
    id: "obs-source",
    name: "OBS Source",
    type: "obs-source",
    status: "planned",
    capabilities: { ...defaultPhoneCapabilities, supportsFocus: false, supportsZoom: false, supportsTorch: false },
    roadmap: "Planned integration for users who want to bridge OBS scenes."
  },
  {
    id: "screen-capture",
    name: "Screen Capture",
    type: "screen-capture",
    status: "planned",
    capabilities: { ...defaultPhoneCapabilities, supportsFocus: false, supportsZoom: false, supportsTorch: false },
    roadmap: "Planned source for presenting a screen as a camera feed."
  },
  {
    id: "plugin",
    name: "Community Plugin",
    type: "plugin",
    status: "planned",
    capabilities: { ...defaultPhoneCapabilities },
    roadmap: "Plugin contracts exist now. Runtime loading is V4."
  }
];
