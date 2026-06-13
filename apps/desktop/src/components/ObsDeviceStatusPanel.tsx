import { useEffect, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { getObsVirtualCameraStatus, type ObsVirtualCameraStatus } from "../lib/api";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function ObsDeviceStatusPanel() {
  const [status, setStatus] = useState<ObsVirtualCameraStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setStatus(await getObsVirtualCameraStatus());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-brand">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">OBS fallback detection</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
              Use this only for the OBS fallback path. For the direct Windows path, Chrome should show{" "}
              <span className="text-slate-200">LensBridge Camera</span> after installing the driver.
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={refresh} disabled={loading}>
          <RefreshCw className="h-4 w-4" />
          {loading ? "Checking" : "Check again"}
        </Button>
      </div>

      <div className="mt-4 border border-line bg-black/20 p-4">
        <div
          className={status?.detected ? "text-sm font-semibold text-accent" : "text-sm font-semibold text-amber-100"}
        >
          {status
            ? status.detected
              ? "OBS Virtual Camera detected by Windows"
              : "OBS Virtual Camera not detected"
            : "Checking devices"}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {status?.message ?? "Inspecting Windows camera devices..."}
        </p>
        {status?.devices.length ? (
          <div className="mt-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Windows camera devices</div>
            <ul className="mt-2 grid gap-1 text-sm text-slate-300">
              {status.devices.map((device) => (
                <li key={device} className="border border-white/[0.04] bg-white/[0.025] px-2 py-1">
                  {device}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
