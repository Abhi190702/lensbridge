import type { PairingPayload } from "@lensbridge/shared";
import { invoke } from "@tauri-apps/api/core";

interface RuntimeStatus {
  localHost: string;
  signalingPort: number;
  desktopName: string;
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
