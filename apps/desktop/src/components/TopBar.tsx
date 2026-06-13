import type { ConnectionStatus, StreamMetrics } from "@lensbridge/shared";
import { statusLabel } from "@lensbridge/shared";
import { Badge } from "./ui/Badge";
import { formatMetric } from "../lib/format";
import type { PageId } from "./AppShell";

interface TopBarProps {
  page: PageId;
  status: ConnectionStatus;
  metrics: Partial<StreamMetrics>;
}

const pageTitles: Record<PageId, string> = {
  dashboard: "Camera desk",
  sources: "Sources",
  virtualCamera: "Output",
  security: "Security",
  settings: "Settings",
  about: "About"
};

export function TopBar({ page, status, metrics }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-ink px-5">
      <div>
        <h1 className="text-sm font-semibold text-white">{pageTitles[page]}</h1>
        <p className="text-xs text-slate-500">Local WebRTC receiver · Windows DirectShow output</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone={status === "connected" ? "success" : status === "failed" ? "danger" : "neutral"}>
          {statusLabel(status)}
        </Badge>
        <div className="hidden rounded-md border border-line bg-white/[0.025] px-3 py-1.5 text-xs text-slate-300 md:block">
          Latency {formatMetric(metrics.latencyMs, "ms")}
        </div>
      </div>
    </header>
  );
}
