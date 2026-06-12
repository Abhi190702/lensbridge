import type { LensBridgePlugin } from "./pluginTypes";

export interface UiPanelPlugin extends LensBridgePlugin {
  type: "ui-panel";
  mount(element: HTMLElement): void | Promise<void>;
}
