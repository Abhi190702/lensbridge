import type { PairingPayload } from "@lensbridge/shared";

export interface PairingState {
  payload: PairingPayload | null;
  error: string | null;
}
