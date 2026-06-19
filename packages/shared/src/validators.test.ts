import { describe, expect, it } from "vitest";
import { createPairingCode, isPairingPayload, isSignalingMessage } from ".";

describe("shared validators", () => {
  it("accepts a valid pairing payload", () => {
    expect(
      isPairingPayload({
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
      })
    ).toBe(true);
  });

  it("rejects non LensBridge payloads", () => {
    expect(isPairingPayload({ app: "Other" })).toBe(false);
  });

  it("recognizes signaling messages by type", () => {
    expect(isSignalingMessage({ type: "disconnect", sessionId: "session" })).toBe(true);
  });

  it("creates stable six digit pairing codes without exposing the long token", () => {
    const code = createPairingCode({ sessionId: "session", token: "secret-token" }, "phone-1");

    expect(code).toMatch(/^\d{6}$/);
    expect(createPairingCode({ sessionId: "session", token: "secret-token" }, "phone-1")).toBe(code);
    expect(createPairingCode({ sessionId: "session", token: "other-token" }, "phone-1")).not.toBe(code);
  });
});
