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
    <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-[#080d15] px-3 py-4">
      <div className="mb-7 px-2">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          <Camera className="h-4 w-4 text-brand" />
          LensBridge
        </div>
        <div>
          <div className="mt-1 text-xs text-slate-500">Direct camera bridge</div>
        </div>
      </div>

      <nav className="space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              className={[
                "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition",
                selected ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
              ].join(" ")}
              onClick={() => onNavigate(item.id)}
            >
              {selected ? <span className="absolute left-0 h-5 w-0.5 bg-brand" /> : null}
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line px-2 pt-3 text-xs leading-5 text-slate-500">
        Local stream. No account. No relay unless you add one.
      </div>
    </aside>
  );
}
