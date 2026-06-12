import { describe, expect, it, vi } from "vitest";
import { browserSupport } from "./browserSupport";

describe("browserSupport", () => {
  it("reports support when required APIs exist", () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn() }
    });
    Object.defineProperty(globalThis, "RTCPeerConnection", { configurable: true, value: vi.fn() });
    Object.defineProperty(globalThis, "WebSocket", { configurable: true, value: vi.fn() });
    expect(browserSupport().supported).toBe(true);
  });
});
