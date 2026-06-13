import type { ReactNode } from "react";

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <section className="w-full max-w-lg rounded-lg border border-line bg-panel p-5 shadow-panel">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
