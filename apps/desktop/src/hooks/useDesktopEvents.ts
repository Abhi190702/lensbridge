import type { ConnectionStatus, PairingPayload, SignalingEnvelope, SignalingMessage, StreamMetrics } from "@lensbridge/shared";
import { useCallback, useEffect, useRef, useState } from "react";

const SOCKET_RETRY_WINDOW_MS = 15000;
const SOCKET_RETRY_DELAY_MS = 450;
const STATS_INTERVAL_MS = 1500;

interface InboundStatsSample {
  bytesReceived: number;
  framesDecoded: number;
  timestamp: number;
}

export function useDesktopReceiver(session: PairingPayload | null) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("waiting");
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const statsTimerRef = useRef<number | null>(null);
  const inboundStatsSampleRef = useRef<InboundStatsSample | null>(null);

  const stopStatsPolling = useCallback(() => {
    if (statsTimerRef.current !== null) {
      window.clearInterval(statsTimerRef.current);
      statsTimerRef.current = null;
    }
    inboundStatsSampleRef.current = null;
  }, []);

  useEffect(() => {
    if (!session) return;

    let disposed = false;
    let opened = false;
    let retryTimer: number | null = null;
    let iceRestartRequested = false;
    const retryStartedAt = performance.now();
    setStatus("waiting");
    setError(null);

    const send = (message: SignalingMessage) => {
      const socket = socketRef.current;
      if (socket?.readyState === WebSocket.OPEN) {
        const envelope: SignalingEnvelope = {
          from: "desktop",
          to: "phone",
          message,
          sentAt: new Date().toISOString()
        };
        socket.send(JSON.stringify(envelope));
      }
    };

    const closePeer = () => {
      stopStatsPolling();
      peerRef.current?.close();
      peerRef.current = null;
      setRemoteStream(null);
    };

    const startStatsPolling = (peer: RTCPeerConnection) => {
      stopStatsPolling();
      statsTimerRef.current = window.setInterval(async () => {
        if (disposed || peer.connectionState === "closed") return;
        const { metrics, sample } = await readInboundMetrics(peer, inboundStatsSampleRef.current);
        inboundStatsSampleRef.current = sample;
        if (Object.keys(metrics).length > 0) {
          setMetrics((current) => ({ ...current, ...metrics }));
        }
      }, STATS_INTERVAL_MS);
    };

    const ensurePeer = () => {
      if (peerRef.current) return peerRef.current;
      const peer = new RTCPeerConnection({ iceServers: [] });
      peerRef.current = peer;
      peer.ontrack = (event) => {
        if (disposed) return;
        const [stream] = event.streams;
        setRemoteStream(stream ?? new MediaStream([event.track]));
        setStatus("connected");
        startStatsPolling(peer);
        const settings = event.track.getSettings();
        setMetrics((current) => ({
          ...current,
          width: settings.width,
          height: settings.height,
          fps: settings.frameRate,
          connectedAt: current.connectedAt ?? new Date().toISOString(),
          lastFrameAt: new Date().toISOString()
        }));
      };
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          send({ type: "ice-candidate", sessionId: session.sessionId, candidate: event.candidate.toJSON() });
        }
      };
      peer.onconnectionstatechange = () => {
        if (peer.connectionState === "failed") {
          setStatus("failed");
          if (!iceRestartRequested) {
            iceRestartRequested = true;
            peer.restartIce();
            send({ type: "ice-restart-request", sessionId: session.sessionId, reason: "Desktop ICE failed" });
          }
        }
        if (peer.connectionState === "disconnected") setStatus("disconnected");
        if (peer.connectionState === "connected") {
          iceRestartRequested = false;
          setStatus("connected");
        }
      };
      return peer;
    };

    const connect = () => {
      if (disposed) return;

      const url = desktopSignalingUrl(session);
      url.searchParams.set("sessionId", session.sessionId);
      url.searchParams.set("token", session.token);
      url.searchParams.set("role", "desktop");

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        opened = true;
        setError(null);
        setStatus("pairing");
        send({
          type: "hello",
          role: "desktop",
          sessionId: session.sessionId,
          token: session.token,
          deviceName: "LensBridge Desktop"
        });
      };

      socket.onmessage = async (event) => {
        try {
          const envelope = JSON.parse(String(event.data)) as SignalingEnvelope;
          if (envelope.from === "desktop") return;
          const message = envelope.message;
          if (message.type === "hello-ack" && !message.accepted) {
            setError(message.reason ?? "Pairing was rejected.");
            setStatus("failed");
            return;
          }
          if (message.type === "offer") {
            setStatus("connecting");
            closePeer();
            const peer = ensurePeer();
            await peer.setRemoteDescription(message.sdp);
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            send({ type: "answer", sessionId: session.sessionId, sdp: answer });
          }
          if (message.type === "ice-candidate") {
            const peer = ensurePeer();
            await peer.addIceCandidate(message.candidate);
          }
          if (message.type === "metrics") {
            setMetrics((current) => ({ ...current, ...message.metrics }));
          }
          if (message.type === "stream-stopped" || message.type === "disconnect") {
            closePeer();
            setStatus("disconnected");
          }
          if (message.type === "error") {
            setError(message.message);
            setStatus("failed");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not process signaling message.");
        }
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onclose = () => {
        if (disposed) return;

        const stillStarting = !opened && performance.now() - retryStartedAt < SOCKET_RETRY_WINDOW_MS;
        if (stillStarting) {
          setStatus("waiting");
          setError(null);
          retryTimer = window.setTimeout(connect, SOCKET_RETRY_DELAY_MS);
          return;
        }

        if (!opened) {
          setError(
            "Desktop signaling socket failed. Start LensBridge with pnpm dev:desktop so the local server runs with the Tauri app."
          );
          setStatus("failed");
          return;
        }

        setStatus((current) => (current === "connected" ? "disconnected" : current));
      };
    };

    connect();

    return () => {
      disposed = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      closePeer();
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [session, stopStatsPolling]);

  function disconnect() {
    socketRef.current?.send(
      JSON.stringify({
        from: "desktop",
        to: "phone",
        message: { type: "disconnect", sessionId: session?.sessionId ?? "", reason: "Desktop disconnected" },
        sentAt: new Date().toISOString()
      } satisfies SignalingEnvelope)
    );
    stopStatsPolling();
    peerRef.current?.close();
    peerRef.current = null;
    setRemoteStream(null);
    setStatus("disconnected");
  }

  return { remoteStream, status, metrics, error, disconnect };
}

async function readInboundMetrics(
  peer: RTCPeerConnection,
  previousSample: InboundStatsSample | null
): Promise<{ metrics: Partial<StreamMetrics>; sample: InboundStatsSample | null }> {
  const stats = await peer.getStats();
  let metrics: Partial<StreamMetrics> = {
    lastFrameAt: new Date().toISOString()
  };
  let sample: InboundStatsSample | null = null;

  stats.forEach((report) => {
    if (report.type === "inbound-rtp" && report.kind === "video") {
      const record = report as RTCStats & Record<string, unknown>;
      const bytesReceived = Number(record.bytesReceived ?? 0);
      const framesDecoded = Number(record.framesDecoded ?? 0);
      sample = {
        bytesReceived,
        framesDecoded,
        timestamp: Number(record.timestamp ?? performance.now())
      };
      metrics = {
        ...metrics,
        bitrateKbps: bitrateFromSamples(previousSample, sample),
        fps: framesPerSecondFromSamples(previousSample, sample, record.framesPerSecond),
        jitter: secondsToMs(record.jitter),
        latencyMs: jitterBufferLatencyMs(record),
        packetLoss: numberOrUndefined(record.packetsLost)
      };
    }
    if (report.type === "track" && report.kind === "video") {
      const record = report as RTCStats & Record<string, unknown>;
      metrics = {
        ...metrics,
        width: numberOrUndefined(record.frameWidth),
        height: numberOrUndefined(record.frameHeight)
      };
    }
  });

  return { metrics, sample };
}

function bitrateFromSamples(previousSample: InboundStatsSample | null, currentSample: InboundStatsSample | null) {
  if (!previousSample || !currentSample) return undefined;
  const elapsedMs = currentSample.timestamp - previousSample.timestamp;
  const bytesDelta = currentSample.bytesReceived - previousSample.bytesReceived;
  if (elapsedMs <= 0 || bytesDelta < 0) return undefined;
  return Math.round((bytesDelta * 8) / elapsedMs);
}

function framesPerSecondFromSamples(
  previousSample: InboundStatsSample | null,
  currentSample: InboundStatsSample | null,
  reportedFps: unknown
) {
  const fps = numberOrUndefined(reportedFps);
  if (fps !== undefined) return fps;
  if (!previousSample || !currentSample) return undefined;

  const elapsedMs = currentSample.timestamp - previousSample.timestamp;
  const frameDelta = currentSample.framesDecoded - previousSample.framesDecoded;
  if (elapsedMs <= 0 || frameDelta < 0) return undefined;
  return Math.round((frameDelta * 1000) / elapsedMs);
}

function jitterBufferLatencyMs(record: Record<string, unknown>) {
  const delay = numberOrUndefined(record.jitterBufferDelay);
  const emitted = numberOrUndefined(record.jitterBufferEmittedCount);
  if (delay === undefined || emitted === undefined || emitted <= 0) return undefined;
  return Math.round((delay / emitted) * 1000);
}

function secondsToMs(value: unknown) {
  const number = numberOrUndefined(value);
  return number === undefined ? undefined : Math.round(number * 1000);
}

function numberOrUndefined(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function desktopSignalingUrl(session: PairingPayload) {
  const url = new URL(session.signalingUrl);

  if ("__TAURI_INTERNALS__" in window) {
    url.hostname = "127.0.0.1";
    url.port = String(session.port);
  }

  return url;
}
