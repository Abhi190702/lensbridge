import type { StreamMetrics } from "@lensbridge/shared";

export function ConnectionHUD({ status, metrics }: { status: string; metrics: Partial<StreamMetrics> }) {
  return (
    <div className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs text-white backdrop-blur">
      {status} · FPS {metrics.fps ? Math.round(metrics.fps) : "unavailable"}
    </div>
  );
}
