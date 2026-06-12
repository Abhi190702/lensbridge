import type { PairingPayload, SignalingMessage, StreamMetrics } from "@lensbridge/shared";
import { SignalingClient } from "./signalingClient";
import { readOutboundMetrics } from "./metrics";

export interface PhonePeer {
  stop: () => void;
}

export interface StartPhonePeerOptions {
  pairing: PairingPayload;
  stream: MediaStream;
  onStatus: (status: string) => void;
  onMetrics: (metrics: Partial<StreamMetrics>) => void;
}

export async function startPhonePeer({ pairing, stream, onStatus, onMetrics }: StartPhonePeerOptions): Promise<PhonePeer> {
  const client = new SignalingClient(pairing, "phone");
  const peer = new RTCPeerConnection({ iceServers: [] });
  let metricsTimer = 0;

  stream.getTracks().forEach((track) => peer.addTrack(track, stream));

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      client.send({ type: "ice-candidate", sessionId: pairing.sessionId, candidate: event.candidate.toJSON() });
    }
  };

  peer.onconnectionstatechange = () => {
    onStatus(peer.connectionState);
  };

  client.onMessage(async (message: SignalingMessage) => {
    if (message.type === "answer") {
      await peer.setRemoteDescription(message.sdp);
      onStatus("connected");
    }
    if (message.type === "ice-candidate") {
      await peer.addIceCandidate(message.candidate);
    }
    if (message.type === "disconnect") {
      onStatus("disconnected");
    }
  });

  await client.connect();
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  client.send({ type: "offer", sessionId: pairing.sessionId, sdp: offer });
  client.send({ type: "stream-started", sessionId: pairing.sessionId });

  metricsTimer = window.setInterval(async () => {
    const metrics = await readOutboundMetrics(peer);
    onMetrics(metrics);
    client.send({ type: "metrics", sessionId: pairing.sessionId, metrics });
  }, 1500);

  return {
    stop() {
      window.clearInterval(metricsTimer);
      client.send({ type: "stream-stopped", sessionId: pairing.sessionId, reason: "Phone stopped stream" });
      peer.close();
      client.close();
    }
  };
}
