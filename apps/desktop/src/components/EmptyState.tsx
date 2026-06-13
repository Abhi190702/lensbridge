import { Camera } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/[0.025] p-8 text-center">
      <Camera className="mx-auto mb-3 h-8 w-8 text-brand" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}
