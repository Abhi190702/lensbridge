import type { PairingPayload } from "@lensbridge/shared";
import { invoke } from "@tauri-apps/api/core";

interface RuntimeStatus {
  localHost: string;
  signalingPort: number;
  desktopName: string;
}

export interface ObsVirtualCameraStatus {
  detected: boolean;
  devices: string[];
  message: string;
}

export interface UnityCaptureFramePayload {
  width: number;
  height: number;
  rgbaBytes: Uint8Array;
  mirror: boolean;
}

export interface UnityCapturePublishResult {
  ready: boolean;
  delivered: boolean;
  skippedFrame: boolean;
  framesDelivered: number;
  width: number;
  height: number;
  message: string;
}

function isTauriRuntime() {
  return "__TAURI_INTERNALS__" in window;
}

export async function getPairingSession(): Promise<PairingPayload> {
  if (isTauriRuntime()) {
    return invoke<PairingPayload>("get_pairing_session");
  }
  return createBrowserMockSession();
}

export async function regeneratePairingSession(): Promise<PairingPayload> {
  if (isTauriRuntime()) {
    return invoke<PairingPayload>("regenerate_pairing_session");
  }
  return createBrowserMockSession();
}

export async function getRuntimeStatus(): Promise<RuntimeStatus> {
  if (isTauriRuntime()) {
    return invoke<RuntimeStatus>("get_runtime_status");
  }
  return {
    localHost: window.location.hostname || "127.0.0.1",
    signalingPort: 48173,
    desktopName: "LensBridge Dev"
  };
}

export async function disconnectSession(): Promise<void> {
  if (isTauriRuntime()) {
    await invoke("disconnect_session");
  }
}

export async function getObsVirtualCameraStatus(): Promise<ObsVirtualCameraStatus> {
  if (isTauriRuntime()) {
    return invoke<ObsVirtualCameraStatus>("get_obs_virtual_camera_status");
  }

  return {
    detected: false,
    devices: [],
    message: "Camera-device detection is available in the Tauri desktop app."
  };
}

export async function publishUnityCaptureFrame(frame: UnityCaptureFramePayload): Promise<UnityCapturePublishResult> {
  if (isTauriRuntime()) {
    return invoke<UnityCapturePublishResult>("publish_unity_capture_frame_binary", encodeUnityCaptureFrame(frame));
  }

  return {
    ready: false,
    delivered: false,
    skippedFrame: false,
    framesDelivered: 0,
    width: frame.width,
    height: frame.height,
    message: "Direct camera bridge is available in the Tauri desktop app."
  };
}

function encodeUnityCaptureFrame(frame: UnityCaptureFramePayload) {
  const headerBytes = 9;
  const payload = new Uint8Array(headerBytes + frame.rgbaBytes.byteLength);
  const header = new DataView(payload.buffer, payload.byteOffset, headerBytes);
  header.setUint32(0, frame.width, true);
  header.setUint32(4, frame.height, true);
  payload[8] = frame.mirror ? 1 : 0;
  payload.set(frame.rgbaBytes, headerBytes);
  return payload;
}

export async function resetUnityCaptureBridge(): Promise<void> {
  if (isTauriRuntime()) {
    await invoke("reset_unity_capture_bridge");
  }
}

function createBrowserMockSession(): PairingPayload {
  const host = window.location.hostname || "127.0.0.1";
  const port = 48173;
  const sessionId = crypto.randomUUID();
  const token = crypto.randomUUID().replace(/-/g, "");
  return {
    app: "LensBridge",
    version: "0.1",
    desktopName: "LensBridge Dev",
    host,
    port,
    sessionId,
    token,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    transport: "wifi-webrtc",
    secure: false,
    signalingUrl: `ws://${host}:${port}/signal`
  };
}
