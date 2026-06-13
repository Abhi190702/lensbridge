import type { ConnectionStatus } from "@lensbridge/shared";
import { CheckCircle2, CircleDashed } from "lucide-react";

interface ConnectedSourceCardProps {
  status: ConnectionStatus;
  streamReady: boolean;
}

export function ConnectedSourceCard({ status, streamReady }: ConnectedSourceCardProps) {
  const items = [
    { label: "Phone connected", active: status === "connected" || streamReady },
    { label: "Preview active", active: streamReady },
    { label: "OBS output ready", active: streamReady }
  ];

  return (
    <div className="grid gap-3 rounded-xl border border-line bg-panel/70 p-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          {item.active ? (
            <CheckCircle2 className="h-4 w-4 text-accent" />
          ) : (
            <CircleDashed className="h-4 w-4 text-slate-500" />
          )}
          <span className={item.active ? "text-white" : "text-slate-500"}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
