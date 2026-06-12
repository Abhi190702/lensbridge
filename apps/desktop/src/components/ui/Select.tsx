interface SelectProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
}

export function Select({ label, value, options }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      <select className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand" value={value} onChange={() => undefined}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
