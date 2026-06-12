import type { LensBridgePlugin } from "./pluginTypes";

export function definePlugin<TPlugin extends LensBridgePlugin>(plugin: TPlugin): TPlugin {
  return plugin;
}
