import { ClipboardList } from "lucide-react";
import { OBS_CAPTURE_WINDOW_LABEL, OBS_SETUP_STEPS } from "../lib/obsWorkflow";
import { Button } from "./ui/Button";

const steps = [
  "Connect phone",
  "Open OBS Output",
  "Add Window Capture",
  `Select ${OBS_CAPTURE_WINDOW_LABEL}`,
  "Use Windows Graphics Capture first",
  "Transform -> Fit to Screen",
  "Start OBS Virtual Camera",
  "Choose OBS Virtual Camera in your app"
];

export function ObsSetupWizard() {
  return (
    <div className="rounded-xl border border-line bg-panel/70 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">OBS workflow</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Use LensBridge as a webcam today</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            LensBridge creates the live source. OBS exposes that source as a system camera.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void navigator.clipboard.writeText(OBS_SETUP_STEPS)}>
          <ClipboardList className="h-4 w-4" />
          Copy steps
        </Button>
      </div>
      <ol className="mt-4 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
