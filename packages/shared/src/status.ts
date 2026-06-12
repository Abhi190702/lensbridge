export type ConnectionStatus =
  | "idle"
  | "waiting"
  | "pairing"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "failed";

export function statusLabel(status: ConnectionStatus): string {
  const labels: Record<ConnectionStatus, string> = {
    idle: "Idle",
    waiting: "Waiting for phone",
    pairing: "Pairing securely",
    connecting: "Connecting",
    connected: "Receiving camera stream",
    reconnecting: "Reconnecting",
    disconnected: "Disconnected",
    failed: "Connection failed"
  };

  return labels[status];
}
