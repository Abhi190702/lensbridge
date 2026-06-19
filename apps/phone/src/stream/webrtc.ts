import {
  createPairingCode,
  getQualityProfile,
  type PairingPayload,
  type QualityProfileId,
  type SignalingMessage,
  type StreamMetrics
} from "@lensbridge/shared";
import { getPhoneDeviceIdentity } from "../pairing/deviceIdentity";
import { SignalingClient } from "./signalingClient";
import { readOutboundMetrics, type OutboundMetricsSample } from "./metrics";

export interface PhonePeer {
  stop: () => void;
  updateQuality: (quality: QualityProfileId) => Promise<void>;
}

export interface StartPhonePeerOptions {
  pairing: PairingPayload;
  stream: MediaStream;
  quality: QualityProfileId;
  onStatus: (status: string) => void;
  onMetrics: (metrics: Partial<StreamMetrics>) => void;
  onRemoteDisconnect?: () => void;
  onError?: (message: string) => void;
  onQualityUpdated?: () => void;
}

export async function startPhonePeer({
  pairing,
  stream,
  quality,
  onStatus,
  onMetrics,
  onRemoteDisconnect,
  onError,
  onQualityUpdated
}: StartPhonePeerOptions): Promise<PhonePeer> {
  const client = new SignalingClient(pairing, "phone");
  const peer = new RTCPeerConnection({ iceServers: [] });
  let metricsTimer = 0;
  let lastMetricsSample: OutboundMetricsSample | null = null;
  let stopped = false;
  let activeQuality = quality;
  const videoSenders: RTCRtpSender[] = [];
  const identity = getPhoneDeviceIdentity();
  const pairingCode = createPairingCode(pairing, identity.deviceId);

  for (const track of stream.getTracks()) {
    if (track.kind === "video") {
      (track as MediaStreamTrack & { contentHint?: string }).contentHint = "motion";
    }
    const sender = peer.addTrack(track, stream);
    if (track.kind === "video") {
      videoSenders.push(sender);
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
    if (stopped) return;

    if (message.type === "hello-ack" && !message.accepted) {
      const reason = message.reason ?? "LensBridge pairing was rejected.";
      onError?.(reason);
      onStatus("failed");
      stopPeer(false);
      return;
    }
    if (message.type === "pairing-approved") {
      onStatus(message.trusted ? "trusted-approved" : "approved");
      await createAndSendOffer(false);
      client.send({ type: "stream-started", sessionId: pairing.sessionId });
    }
    if (message.type === "pairing-rejected") {
      onError?.(message.reason);
      onStatus("rejected");
      stopPeer(false);
      return;
    }
    if (message.type === "answer") {
      await peer.setRemoteDescription(message.sdp);
      onStatus("connected");
    }
    if (message.type === "ice-candidate") {
      await peer.addIceCandidate(message.candidate);
    }
    if (message.type === "disconnect") {
      stopPeer(false);
      onRemoteDisconnect?.();
      onStatus("disconnected");
    }
    if (message.type === "ice-restart-request") {
      await createAndSendOffer(true);
    }
  });

  await client.connect();
  onStatus("awaiting-approval");
  client.send({
    type: "hello",
    role: "phone",
    sessionId: pairing.sessionId,
    token: pairing.token,
    deviceId: identity.deviceId,
    deviceName: identity.deviceName,
    platform: identity.platform,
    userAgent: identity.userAgent,
    pairingCode
  });

  metricsTimer = window.setInterval(async () => {
    if (stopped) return;
    const { metrics, sample } = await readOutboundMetrics(peer, lastMetricsSample);
    lastMetricsSample = sample;
    onMetrics(metrics);
    client.send({ type: "metrics", sessionId: pairing.sessionId, metrics });
  }, 1500);

  function stopPeer(notifyDesktop: boolean) {
    if (stopped) return;

    stopped = true;
    window.clearInterval(metricsTimer);

    if (notifyDesktop) {
      client.send({ type: "stream-stopped", sessionId: pairing.sessionId, reason: "Phone stopped stream" });
    }

    peer.close();
    client.close();
  }

  async function createAndSendOffer(iceRestart: boolean) {
    if (iceRestart) {
      peer.restartIce();
    }

    const offer = await peer.createOffer({ iceRestart });
    const profile = getQualityProfile(activeQuality);
    const cappedOffer = {
      type: offer.type,
      sdp: applyVideoBandwidthLimit(offer.sdp ?? "", profile.bitrateKbps ?? 3500)
    } satisfies RTCSessionDescriptionInit;

    await peer.setLocalDescription(cappedOffer);
    client.send({ type: "offer", sessionId: pairing.sessionId, sdp: cappedOffer });
  }

  return {
    async updateQuality(nextQuality: QualityProfileId) {
      activeQuality = nextQuality;
      await Promise.all(videoSenders.map((sender) => configureVideoSender(sender, nextQuality)));
      onQualityUpdated?.();
    },
    stop() {
      stopPeer(true);
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

function applyVideoBandwidthLimit(sdp: string, bitrateKbps: number) {
  const lines = sdp.split("\r\n");
  const videoLineIndex = lines.findIndex((line) => line.startsWith("m=video"));
  if (videoLineIndex === -1) return sdp;

  const nextMediaLineIndex = lines.findIndex((line, index) => index > videoLineIndex && line.startsWith("m="));
  const insertAt = nextMediaLineIndex === -1 ? lines.length : nextMediaLineIndex;
  const existingBandwidthIndex = lines.findIndex(
    (line, index) => index > videoLineIndex && index < insertAt && (line.startsWith("b=AS:") || line.startsWith("b=TIAS:"))
  );

  if (existingBandwidthIndex !== -1) {
    lines[existingBandwidthIndex] = `b=AS:${bitrateKbps}`;
  } else {
    lines.splice(videoLineIndex + 1, 0, `b=AS:${bitrateKbps}`);
  }

  return lines.join("\r\n");
}
