export function formatMetric(value: number | undefined, suffix = "") {
  if (value === undefined || Number.isNaN(value)) return "Unavailable";
  return `${Math.round(value)}${suffix ? ` ${suffix}` : ""}`;
}

export function formatTimeLeft(totalSeconds: number) {
  if (totalSeconds <= 0) return "Expired";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}
