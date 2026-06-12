export type BrowserSupportResult =
  | { supported: true; title: null; reason: null }
  | { supported: false; title: string; reason: string };

export function browserSupport(): BrowserSupportResult {
  const runtime = globalThis as typeof globalThis & {
    isSecureContext?: boolean;
    location?: Location;
    navigator?: Navigator;
    RTCPeerConnection?: typeof RTCPeerConnection;
    WebSocket?: typeof WebSocket;
  };

  if (runtime.isSecureContext === false) {
    const currentUrl = runtime.location?.href ?? "this page";
    return {
      supported: false,
      title: "Camera blocked on insecure HTTP",
      reason: `Chrome is hiding camera access because ${currentUrl} is not HTTPS or localhost. The QR code is shown in LensBridge Desktop, not on this phone page. Open the desktop app first, then scan/copy its pairing link from your phone.`
    };
  }

  if (!runtime.navigator?.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      title: "Camera API unavailable",
      reason: "This browser does not expose MediaDevices.getUserMedia(). Try a current version of Chrome, Edge, Safari, or Firefox."
    };
  }

  if (!runtime.RTCPeerConnection) {
    return {
      supported: false,
      title: "WebRTC unavailable",
      reason: "This browser does not support RTCPeerConnection, which LensBridge V1 uses for local streaming."
    };
  }

  if (!runtime.WebSocket) {
    return {
      supported: false,
      title: "WebSocket unavailable",
      reason: "This browser does not support WebSocket signaling."
    };
  }

  return { supported: true, title: null, reason: null };
}
