import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={clsx("rounded-xl border border-line bg-panel/70 shadow-panel backdrop-blur", className)} {...props}>
      {children}
    </div>
  );
}
