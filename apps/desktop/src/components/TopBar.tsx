import { Settings } from "lucide-react";
import type { ConnectionStatus, StreamMetrics } from "@lensbridge/shared";
import { statusLabel } from "@lensbridge/shared";
import { Badge } from "./ui/Badge";
import { formatMetric } from "../lib/format";

interface TopBarProps {
  status: ConnectionStatus;
  metrics: Partial<StreamMetrics>;
}

export function TopBar({ status, metrics }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ink/55 px-6 backdrop-blur">
      <div>
        <h1 className="text-base font-semibold text-white">Bridge any camera source into any app.</h1>
        <p className="text-xs text-slate-400">V1 focuses on phone to desktop preview over local WebRTC.</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={status === "connected" ? "success" : status === "failed" ? "danger" : "neutral"}>
          {statusLabel(status)}
        </Badge>
        <div className="hidden rounded-lg border border-line bg-white/[0.03] px-3 py-2 text-xs text-slate-300 md:block">
          Latency {formatMetric(metrics.latencyMs, "ms")}
        </div>
        <button className="rounded-lg border border-line p-2 text-slate-300 transition hover:bg-white/5 hover:text-white" title="Settings">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
