import {
  getQualityProfile,
  type PairingPayload,
  type QualityProfileId,
  type SignalingMessage,
  type StreamMetrics
} from "@lensbridge/shared";
import { SignalingClient } from "./signalingClient";
import { readOutboundMetrics } from "./metrics";

export interface PhonePeer {
  stop: () => void;
}

export interface StartPhonePeerOptions {
  pairing: PairingPayload;
  stream: MediaStream;
  quality: QualityProfileId;
  onStatus: (status: string) => void;
  onMetrics: (metrics: Partial<StreamMetrics>) => void;
}

export async function startPhonePeer({
  pairing,
  stream,
  quality,
  onStatus,
  onMetrics
}: StartPhonePeerOptions): Promise<PhonePeer> {
  const client = new SignalingClient(pairing, "phone");
  const peer = new RTCPeerConnection({ iceServers: [] });
  let metricsTimer = 0;

  for (const track of stream.getTracks()) {
    if (track.kind === "video") {
      (track as MediaStreamTrack & { contentHint?: string }).contentHint = "motion";
    }
    const sender = peer.addTrack(track, stream);
    if (track.kind === "video") {
      await configureVideoSender(sender, quality);
    }
  }

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

async function configureVideoSender(sender: RTCRtpSender, quality: QualityProfileId) {
  const profile = getQualityProfile(quality);
  const parameters = sender.getParameters();
  const [firstEncoding = {}] = parameters.encodings ?? [];
  parameters.encodings = [
    {
      ...firstEncoding,
      maxBitrate: (profile.bitrateKbps ?? 3500) * 1000,
      maxFramerate: Math.min(profile.fps, 30),
      scaleResolutionDownBy: 1
    }
  ];

  const tunedParameters = parameters as RTCRtpSendParameters & {
    degradationPreference?: "maintain-framerate" | "maintain-resolution" | "balanced";
  };
  tunedParameters.degradationPreference = "maintain-framerate";

  try {
    await sender.setParameters(tunedParameters);
  } catch {
    // Some mobile browsers expose read-only sender parameters. The camera constraints still carry the quality target.
  }
}
