import type { LensBridgeSource } from "@lensbridge/shared";
import type { LensBridgePlugin } from "./pluginTypes";

export interface SourceDriverPlugin extends LensBridgePlugin {
  type: "source-driver";
  discover(): Promise<LensBridgeSource[]>;
}
