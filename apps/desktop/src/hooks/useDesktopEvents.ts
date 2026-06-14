import type { ConnectionStatus, PairingPayload, SignalingEnvelope, SignalingMessage, StreamMetrics } from "@lensbridge/shared";
import { useEffect, useRef, useState } from "react";

const SOCKET_RETRY_WINDOW_MS = 15000;
const SOCKET_RETRY_DELAY_MS = 450;

export function useDesktopReceiver(session: PairingPayload | null) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("waiting");
  const [metrics, setMetrics] = useState<Partial<StreamMetrics>>({});
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!session) return;

    let disposed = false;
    let opened = false;
    let retryTimer: number | null = null;
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

    const ensurePeer = () => {
      if (peerRef.current) return peerRef.current;
      const peer = new RTCPeerConnection({ iceServers: [] });
      peerRef.current = peer;
      peer.ontrack = (event) => {
        if (disposed) return;
        const [stream] = event.streams;
        setRemoteStream(stream ?? new MediaStream([event.track]));
        setStatus("connected");
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
        if (peer.connectionState === "failed") setStatus("failed");
        if (peer.connectionState === "disconnected") setStatus("disconnected");
        if (peer.connectionState === "connected") setStatus("connected");
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
            setStatus("disconnected");
            setRemoteStream(null);
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
      peerRef.current?.close();
      peerRef.current = null;
      socketRef.current?.close();
      socketRef.current = null;
      setRemoteStream(null);
    };
  }, [session]);

  function disconnect() {
    socketRef.current?.send(
      JSON.stringify({
        from: "desktop",
        to: "phone",
        message: { type: "disconnect", sessionId: session?.sessionId ?? "", reason: "Desktop disconnected" },
        sentAt: new Date().toISOString()
      } satisfies SignalingEnvelope)
    );
    peerRef.current?.close();
    setRemoteStream(null);
    setStatus("disconnected");
  }

  return { remoteStream, status, metrics, error, disconnect };
}

function desktopSignalingUrl(session: PairingPayload) {
  const url = new URL(session.signalingUrl);

  if ("__TAURI_INTERNALS__" in window) {
    url.hostname = "127.0.0.1";
    url.port = String(session.port);
  }

  return url;
}
