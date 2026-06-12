import type { PairingPayload } from "@lensbridge/shared";

export interface SessionStoreSnapshot {
  activeSession: PairingPayload | null;
  connectedDeviceName: string | null;
}

export const emptySessionSnapshot: SessionStoreSnapshot = {
  activeSession: null,
  connectedDeviceName: null
};
