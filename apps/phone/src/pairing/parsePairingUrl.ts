import {
  decodePairingPayload,
  isPairingPayload,
  isQualityProfileId,
  type PairingPayload,
  type QualityProfileId
} from "@lensbridge/shared";

export interface ParsePairingResult {
  payload: PairingPayload | null;
  error: string | null;
}

export function parsePairingFromLocation(location: Location): ParsePairingResult {
  return parsePairingUrl(location.search);
}

export function parseQualityFromLocation(location: Location): QualityProfileId | null {
  const quality = new URLSearchParams(location.search).get("quality");
  return quality && isQualityProfileId(quality) ? quality : null;
}

export function parseAutoReconnectFromLocation(location: Location): boolean {
  return new URLSearchParams(location.search).get("autoReconnect") !== "false";
}

export function parsePairingUrl(search: string): ParsePairingResult {
  const params = new URLSearchParams(search);
  const encoded = params.get("pairing");
  if (!encoded) return { payload: null, error: null };

  try {
    const payload = decodePairingPayload(encoded);
    return { payload, error: null };
  } catch (error) {
    return {
      payload: null,
      error: error instanceof Error ? error.message : "Invalid pairing payload."
    };
  }
}

export function parseManualPayload(input: string): ParsePairingResult {
  const trimmed = input.trim();
  if (!trimmed) return { payload: null, error: "Paste a LensBridge pairing link or payload." };

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return parsePairingUrl(new URL(trimmed).search);
    }
    const json = JSON.parse(trimmed) as unknown;
    if (!isPairingPayload(json)) throw new Error("Manual JSON is not a LensBridge pairing payload.");
    return { payload: json, error: null };
  } catch {
    try {
      const payload = decodePairingPayload(trimmed);
      return { payload, error: null };
    } catch (error) {
      return { payload: null, error: error instanceof Error ? error.message : "Could not parse pairing details." };
    }
  }
}
