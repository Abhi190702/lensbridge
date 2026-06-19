import type { PairingPayload, SecurityAuditEvent, TrustedDeviceRecord } from "@lensbridge/shared";
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
  rustFrameWriteMicros?: number;
}

export interface TrustDeviceRequest {
  deviceId: string;
  label: string;
  platform?: string;
  userAgent?: string;
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

export async function listTrustedDevices(): Promise<TrustedDeviceRecord[]> {
  if (isTauriRuntime()) {
    return invoke<TrustedDeviceRecord[]>("list_trusted_devices");
  }
  return readBrowserTrustedDevices();
}

export async function isTrustedDevice(deviceId: string): Promise<boolean> {
  if (isTauriRuntime()) {
    return invoke<boolean>("is_trusted_device", { deviceId });
  }
  return readBrowserTrustedDevices().some((device) => device.deviceId === deviceId);
}

export async function trustDevice(request: TrustDeviceRequest): Promise<TrustedDeviceRecord> {
  if (isTauriRuntime()) {
    return invoke<TrustedDeviceRecord>("trust_device", { request });
  }

  const now = new Date().toISOString();
  const record: TrustedDeviceRecord = {
    deviceId: request.deviceId,
    label: request.label,
    platform: request.platform,
    userAgent: request.userAgent,
    fingerprint: request.deviceId.slice(0, 8),
    trustedAt: now,
    lastSeenAt: now
  };
  const devices = readBrowserTrustedDevices().filter((device) => device.deviceId !== request.deviceId);
  writeBrowserTrustedDevices([...devices, record]);
  return record;
}

export async function markTrustedDeviceSeen(deviceId: string): Promise<void> {
  if (isTauriRuntime()) {
    await invoke("mark_trusted_device_seen", { deviceId });
  }
}

export async function revokeTrustedDevice(deviceId: string): Promise<boolean> {
  if (isTauriRuntime()) {
    return invoke<boolean>("revoke_trusted_device", { deviceId });
  }
  const devices = readBrowserTrustedDevices();
  writeBrowserTrustedDevices(devices.filter((device) => device.deviceId !== deviceId));
  return devices.some((device) => device.deviceId === deviceId);
}

export async function recordSecurityAuditEvent(
  kind: SecurityAuditEvent["kind"],
  message: string,
  deviceId?: string,
  label?: string
): Promise<SecurityAuditEvent | null> {
  if (isTauriRuntime()) {
    return invoke<SecurityAuditEvent>("record_security_audit_event", { kind, deviceId, label, message });
  }
  return null;
}

export async function listSecurityAuditEvents(): Promise<SecurityAuditEvent[]> {
  if (isTauriRuntime()) {
    return invoke<SecurityAuditEvent[]>("list_security_audit_events");
  }
  return [];
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

function encodeUnityCaptureFrame(frame: UnityCaptureFramePayload): Uint8Array {
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

const BROWSER_TRUSTED_DEVICES_KEY = "lensbridge.desktop.trustedDevices.dev.v1";

function readBrowserTrustedDevices() {
  try {
    const raw = localStorage.getItem(BROWSER_TRUSTED_DEVICES_KEY);
    return raw ? (JSON.parse(raw) as TrustedDeviceRecord[]) : [];
  } catch {
    return [];
  }
}

function writeBrowserTrustedDevices(devices: TrustedDeviceRecord[]) {
  localStorage.setItem(BROWSER_TRUSTED_DEVICES_KEY, JSON.stringify(devices));
}
