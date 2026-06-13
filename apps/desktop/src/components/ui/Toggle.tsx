import { clsx } from "clsx";

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
}

export function Toggle({ label, description, checked, disabled }: ToggleProps) {
  return (
    <label
      className={clsx(
        "flex items-center justify-between gap-4 rounded-md border border-line bg-white/[0.025] p-3",
        disabled && "opacity-60"
      )}
    >
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-slate-400">{description}</span> : null}
      </span>
      <input className="h-5 w-5 accent-brand" type="checkbox" checked={checked} disabled={disabled} readOnly />
    </label>
  );
}
