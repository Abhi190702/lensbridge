export function browserSupport(): { supported: true; reason: null } | { supported: false; reason: string } {
  const runtime = globalThis as typeof globalThis & {
    navigator?: Navigator;
    RTCPeerConnection?: typeof RTCPeerConnection;
    WebSocket?: typeof WebSocket;
  };

  if (!runtime.navigator?.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      reason: "This browser does not expose MediaDevices.getUserMedia(). Try a current version of Chrome, Edge, Safari, or Firefox."
    };
  }

  if (!runtime.RTCPeerConnection) {
    return {
      supported: false,
      reason: "This browser does not support RTCPeerConnection, which LensBridge V1 uses for local streaming."
    };
  }

  if (!runtime.WebSocket) {
    return {
      supported: false,
      reason: "This browser does not support WebSocket signaling."
    };
  }

  return { supported: true, reason: null };
}
