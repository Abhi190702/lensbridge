import type { StreamMetrics } from "@lensbridge/shared";
import { Activity } from "lucide-react";
import { formatMetric } from "../lib/format";

interface StreamHealthCardProps {
  metrics: Partial<StreamMetrics>;
}

export function StreamHealthCard({ metrics }: StreamHealthCardProps) {
  return (
    <div className="rounded-xl border border-line bg-panel/70 p-4 text-sm text-slate-300">
      <div className="mb-3 flex items-center gap-2 font-semibold text-white">
        <Activity className="h-4 w-4 text-brand" />
        Stream health
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="FPS" value={formatMetric(metrics.fps)} />
        <Metric
          label="Resolution"
          value={metrics.width && metrics.height ? `${metrics.width}x${metrics.height}` : "Unknown"}
        />
        <Metric label="Bitrate" value={formatMetric(metrics.bitrateKbps, "kbps")} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-white">{value}</div>
    </div>
  );
}
