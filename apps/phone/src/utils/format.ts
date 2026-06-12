export function formatFps(value: number | undefined) {
  return value ? `${Math.round(value)} fps` : "FPS unavailable";
}
