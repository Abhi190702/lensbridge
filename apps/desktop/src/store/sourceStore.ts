import type { LensBridgeSource } from "@lensbridge/shared";

export interface SourceStoreSnapshot {
  sources: LensBridgeSource[];
  activeSourceId: string | null;
}

export const emptySourceSnapshot: SourceStoreSnapshot = {
  sources: [],
  activeSourceId: null
};
