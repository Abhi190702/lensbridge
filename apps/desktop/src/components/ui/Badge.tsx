import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "danger";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "border-slate-500/30 bg-slate-500/10 text-slate-300",
        tone === "success" && "border-accent/30 bg-accent/10 text-accent",
        tone === "danger" && "border-red-400/30 bg-red-400/10 text-red-200"
      )}
    >
      {children}
    </span>
  );
}
