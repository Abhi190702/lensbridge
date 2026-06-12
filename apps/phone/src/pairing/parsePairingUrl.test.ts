import { describe, expect, it } from "vitest";
import { encodePairingPayload, type PairingPayload } from "@lensbridge/shared";
import { parsePairingUrl } from "./parsePairingUrl";

const payload: PairingPayload = {
  app: "LensBridge",
  version: "0.1",
  desktopName: "dev",
  host: "127.0.0.1",
  port: 48173,
  sessionId: "session",
  token: "token",
  expiresAt: new Date().toISOString(),
  transport: "wifi-webrtc",
  secure: false,
  signalingUrl: "ws://127.0.0.1:48173/signal"
};

describe("parsePairingUrl", () => {
  it("returns null when no pairing param exists", () => {
    expect(parsePairingUrl("?x=1").payload).toBeNull();
  });

  it("decodes a valid pairing payload", () => {
    const encoded = encodePairingPayload(payload);
    expect(parsePairingUrl(`?pairing=${encoded}`).payload?.sessionId).toBe("session");
  });

  it("returns an error for invalid payloads", () => {
    expect(parsePairingUrl("?pairing=bad").error).toBeTruthy();
  });
});
