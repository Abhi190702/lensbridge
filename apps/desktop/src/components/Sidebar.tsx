import type React from "react";
import { Camera, Grid2X2, Info, MonitorCog, ShieldCheck, SlidersHorizontal } from "lucide-react";
import type { PageId } from "./AppShell";

const navItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "Dashboard", icon: Camera },
  { id: "sources", label: "Sources", icon: Grid2X2 },
  { id: "virtualCamera", label: "Virtual Camera", icon: MonitorCog },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
  { id: "about", label: "About", icon: Info }
];

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-ink/85 px-4 py-5 backdrop-blur">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/40 bg-brand/10 text-brand">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide text-white">LensBridge</div>
          <div className="text-xs text-slate-400">Desktop v0.1</div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              className={[
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
                selected
                  ? "bg-white text-ink"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              ].join(" ")}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-line bg-white/[0.03] p-3 text-xs leading-5 text-slate-400">
        Local-first. No accounts, no telemetry, no cloud relay by default.
      </div>
    </aside>
  );
}
