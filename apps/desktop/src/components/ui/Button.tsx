import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-white text-ink hover:bg-brand",
        variant === "secondary" && "border border-line bg-white/[0.04] text-white hover:bg-white/[0.08]",
        variant === "ghost" && "text-slate-300 hover:bg-white/[0.05] hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
