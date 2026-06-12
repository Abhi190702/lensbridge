import { useEffect, useRef } from "react";
import type { StreamMetrics } from "@lensbridge/shared";
import { FlipHorizontal2, MonitorPlay, VideoOff } from "lucide-react";
import { formatMetric } from "../lib/format";

interface SourcePreviewProps {
  stream: MediaStream | null;
  metrics: Partial<StreamMetrics>;
  mirrored: boolean;
  onToggleMirror: () => void;
}

export function SourcePreview({ stream, metrics, mirrored, onToggleMirror }: SourcePreviewProps) {
  const videoRef = useVideoStream(stream);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black shadow-panel">
      <div className="video-grid relative aspect-video bg-slate-950">
        {stream ? (
          <video
            ref={videoRef}
            className="h-full w-full object-contain transition-transform duration-200"
            style={{ transform: mirrored ? "scaleX(-1)" : undefined }}
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <VideoOff className="mb-3 h-10 w-10" />
            <p className="text-sm">Waiting for camera stream</p>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white backdrop-blur">
          {stream ? "Live preview" : "No source connected"}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-panel px-4 py-3 text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <MonitorPlay className="h-4 w-4 text-brand" />
          Phone WebRTC source
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-medium text-slate-200 transition hover:border-brand/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onToggleMirror}
          disabled={!stream}
          title="Flip the desktop preview for OBS/window capture when the browser preview feels reversed."
        >
          <FlipHorizontal2 className="h-3.5 w-3.5 text-brand" />
          {mirrored ? "Mirrored output" : "Mirror output"}
        </button>
        <span>
          FPS {formatMetric(metrics.fps)} · {metrics.width && metrics.height ? `${metrics.width}x${metrics.height}` : "Resolution unavailable"} ·{" "}
          {formatMetric(metrics.bitrateKbps, "kbps")}
        </span>
      </div>
    </div>
  );
}

function useVideoStream(stream: MediaStream | null) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return ref;
}
