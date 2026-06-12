export function nextReconnectDelay(attempt: number) {
  return Math.min(15000, 500 * 2 ** attempt);
}
