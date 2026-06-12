import type { ConnectionStatus } from "@lensbridge/shared";
import { useMemo } from "react";

export function useConnectionStatus(status: ConnectionStatus) {
  return useMemo(
    () => ({
      status,
      connected: status === "connected",
      waiting: status === "waiting" || status === "pairing" || status === "connecting",
      failed: status === "failed"
    }),
    [status]
  );
}
