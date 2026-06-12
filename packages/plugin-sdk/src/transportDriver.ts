import type { LensBridgeTransport } from "@lensbridge/shared";
import type { LensBridgePlugin } from "./pluginTypes";

export interface TransportDriverPlugin extends LensBridgePlugin {
  type: "transport-driver";
  discover(): Promise<LensBridgeTransport[]>;
}
