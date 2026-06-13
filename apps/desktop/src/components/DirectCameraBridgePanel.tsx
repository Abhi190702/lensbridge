import { AlertTriangle, Camera, CheckCircle2, Copy, Radio } from "lucide-react";
import type { DirectCameraBridgeState } from "../hooks/useUnityCaptureBridge";
import { Button } from "./ui/Button";

interface DirectCameraBridgePanelProps {
  bridge: DirectCameraBridgeState;
  compact?: boolean;
}

const INSTALL_COMMAND = "pnpm install:windows-camera";
const TEST_STEPS =
  "1. Run pnpm install:windows-camera as Administrator.\n2. Start LensBridge Desktop and connect your phone.\n3. Open TEST-CAMERAS.html in Chrome.\n4. Select LensBridge Camera.\n5. The phone feed should appear in Chrome.";

export function DirectCameraBridgePanel({ bridge, compact = false }: DirectCameraBridgePanelProps) {
  const isStreaming = bridge.status === "streaming";
  const isWaiting = bridge.status === "waitingForTarget";
  const isError = bridge.status === "error";

  return (
    <section className="rounded-xl border border-line bg-panel/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Camera className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">Direct Windows camera</p>
            <h3 className="mt-1 text-lg font-semibold text-white">LensBridge Camera</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
              {compact
                ? "Experimental DirectShow output using the bundled UnityCapture driver."
                : "This bypasses OBS. The phone stream is pumped into the LensBridge Camera DirectShow device when a target app opens it."}
            </p>
          </div>
        </div>
        <StatusPill status={bridge.status} />
      </div>

      <div className="mt-4 rounded-lg border border-line bg-black/20 p-3">
        <p className={isError ? "text-sm text-rose-200" : isStreaming ? "text-sm text-accent" : "text-sm text-slate-300"}>
          {bridge.message}
        </p>
        <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
          <Metric label="Resolution" value={bridge.resolution} />
          <Metric label="FPS" value={isStreaming ? String(bridge.fps || "-") : "-"} />
          <Metric label="Frames" value={bridge.framesDelivered ? bridge.framesDelivered.toLocaleString() : "0"} />
        </div>
      </div>

      {!compact || isWaiting || isError ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(INSTALL_COMMAND)}>
            <Copy className="h-4 w-4" />
            Copy driver install
          </Button>
          <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(TEST_STEPS)}>
            <Copy className="h-4 w-4" />
            Copy test steps
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: DirectCameraBridgeState["status"] }) {
  const content = {
    idle: { label: "Idle", className: "border-slate-500/30 bg-slate-500/10 text-slate-200", icon: Radio },
    waitingForTarget: {
      label: "Waiting",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-100",
      icon: Radio
    },
    streaming: {
      label: "Streaming",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
      icon: CheckCircle2
    },
    error: { label: "Needs attention", className: "border-rose-400/30 bg-rose-400/10 text-rose-100", icon: AlertTriangle }
  }[status];
  const Icon = content.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${content.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {content.label}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.03] px-3 py-2">
      <div className="text-[0.68rem] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-200">{value}</div>
    </div>
  );
}
