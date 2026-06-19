export const LENSBRIDGE_APP_NAME = "LensBridge" as const;
export const LENSBRIDGE_PROTOCOL_VERSION = "0.1" as const;

export interface PairingPayload {
  app: typeof LENSBRIDGE_APP_NAME;
  version: string;
  desktopName: string;
  host: string;
  port: number;
  sessionId: string;
  token: string;
  expiresAt: string;
  transport: "wifi-webrtc";
  secure: boolean;
  signalingUrl: string;
  phoneUrl?: string;
}

export function isPairingPayload(value: unknown): value is PairingPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;

  return (
    payload.app === LENSBRIDGE_APP_NAME &&
    typeof payload.version === "string" &&
    typeof payload.desktopName === "string" &&
    typeof payload.host === "string" &&
    typeof payload.port === "number" &&
    typeof payload.sessionId === "string" &&
    typeof payload.token === "string" &&
    typeof payload.expiresAt === "string" &&
    payload.transport === "wifi-webrtc" &&
    typeof payload.secure === "boolean" &&
    typeof payload.signalingUrl === "string"
  );
}

export function encodePairingPayload(payload: PairingPayload): string {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePairingPayload(encoded: string): PairingPayload {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const json = decodeURIComponent(escape(atob(padded)));
  const parsed = JSON.parse(json) as unknown;

  if (!isPairingPayload(parsed)) {
    throw new Error("Invalid LensBridge pairing payload.");
  }

  return parsed;
}

export function createPairingCode(payload: Pick<PairingPayload, "sessionId" | "token">, deviceId: string): string {
  const material = `${payload.sessionId}:${payload.token}:${deviceId}`;
  const hash = fnv1a32(material);
  return String(hash % 1_000_000).padStart(6, "0");
}

function fnv1a32(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}
