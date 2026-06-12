export type LensBridgePluginType = "video-filter" | "source-driver" | "transport-driver" | "ui-panel";

export interface PluginContext {
  log(message: string, metadata?: Record<string, unknown>): void;
  version: string;
}

export interface LensBridgePlugin {
  name: string;
  version: string;
  type: LensBridgePluginType;
  setup?: (context: PluginContext) => void | Promise<void>;
  dispose?: () => void | Promise<void>;
}
