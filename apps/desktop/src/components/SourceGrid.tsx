import { Monitor, Smartphone, Video } from "lucide-react";
import { mockSources } from "../lib/mockData";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";

const iconMap = {
  "phone-webrtc": Smartphone,
  "desktop-webrtc": Monitor,
  "ip-camera-rtsp": Video,
  "obs-source": Video,
  "screen-capture": Monitor,
  "raspberry-pi": Video,
  dslr: Video,
  gopro: Video,
  plugin: Video
} as const;

export function SourceGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {mockSources.map((source) => {
        const Icon = iconMap[source.type];
        return (
          <Card key={source.id} className="p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-line text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <Badge tone={source.status === "available" ? "success" : "neutral"}>{source.status}</Badge>
            </div>
            <h3 className="font-semibold text-white">{source.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{source.roadmap}</p>
          </Card>
        );
      })}
    </div>
  );
}
