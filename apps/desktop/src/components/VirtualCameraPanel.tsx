import { MonitorCog } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function VirtualCameraPanel() {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <MonitorCog className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">LensBridge Cam</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Virtual camera output is platform-specific. Linux support uses v4l2loopback in the V2 path. Windows and
            macOS currently use OBS Virtual Camera fallback while native drivers remain on the roadmap.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => void navigator.clipboard.writeText("cd drivers/linux && ./setup-v4l2loopback.sh")}>
              Copy Linux setup command
            </Button>
            <Button variant="ghost" onClick={() => window.open("https://obsproject.com/", "_blank")}>Open OBS</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
