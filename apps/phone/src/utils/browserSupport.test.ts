import { describe, expect, it, vi } from "vitest";
import { browserSupport } from "./browserSupport";

describe("browserSupport", () => {
  it("reports support when required APIs exist", () => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn() }
    });
    Object.defineProperty(globalThis, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(globalThis, "RTCPeerConnection", { configurable: true, value: vi.fn() });
    Object.defineProperty(globalThis, "WebSocket", { configurable: true, value: vi.fn() });
    expect(browserSupport().supported).toBe(true);
  });

  it("explains insecure HTTP instead of calling the browser unsupported", () => {
    Object.defineProperty(globalThis, "isSecureContext", { configurable: true, value: false });
    Object.defineProperty(globalThis, "location", { configurable: true, value: { href: "http://192.168.1.5:5174" } });
    const result = browserSupport();
    expect(result.supported).toBe(false);
    expect(result.title).toBe("Camera blocked on insecure HTTP");
  });
});
