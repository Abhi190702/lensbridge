export interface AppPreferences {
  theme: "dark" | "light" | "system";
  defaultQuality: "low-latency" | "balanced" | "high-quality" | "battery-saver";
  autoReconnect: boolean;
}

export const defaultPreferences: AppPreferences = {
  theme: "dark",
  defaultQuality: "balanced",
  autoReconnect: true
};
