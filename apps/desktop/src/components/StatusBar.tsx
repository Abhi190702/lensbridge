import type { ConnectionStatus, StreamMetrics } from "@lensbridge/shared";
import { formatMetric } from "../lib/format";

interface StatusBarProps {
  status: ConnectionStatus;
  metrics: Partial<StreamMetrics>;
}

export function StatusBar({ status, metrics }: StatusBarProps) {
  return (
    <footer className="flex h-9 shrink-0 items-center justify-between border-t border-line bg-[#080d15] px-5 text-xs text-slate-500">
      <span>{status}</span>
      <span>
        {metrics.width && metrics.height ? `${metrics.width}x${metrics.height}` : "Resolution unavailable"} · FPS{" "}
        {formatMetric(metrics.fps)} · Bitrate {formatMetric(metrics.bitrateKbps, "kbps")}
      </span>
    </footer>
  );
}
