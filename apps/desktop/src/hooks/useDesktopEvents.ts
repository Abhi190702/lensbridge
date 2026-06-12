import type { ConnectionStatus, PairingPayload, SignalingEnvelope, SignalingMessage, StreamMetrics } from "@lensbridge/shared";
import { useEffect, useRef, useState } from "react";

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
    setStatus("waiting");
    setError(null);

    const url = new URL(session.signalingUrl);
    url.searchParams.set("sessionId", session.sessionId);
    url.searchParams.set("token", session.token);
    url.searchParams.set("role", "desktop");

    const socket = new WebSocket(url);
    socketRef.current = socket;

    const send = (message: SignalingMessage) => {
      if (socket.readyState === WebSocket.OPEN) {
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

    socket.onopen = () => {
      setStatus("pairing");
      send({ type: "hello", role: "desktop", sessionId: session.sessionId, token: session.token, deviceName: "LensBridge Desktop" });
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
      setError("Desktop signaling socket failed. Make sure the local server is running.");
      setStatus("failed");
    };

    socket.onclose = () => {
      if (!disposed) setStatus((current) => (current === "connected" ? "disconnected" : current));
    };

    return () => {
      disposed = true;
      peerRef.current?.close();
      peerRef.current = null;
      socket.close();
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
