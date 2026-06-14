import { useCallback, useEffect, useState } from "react";
import { isQualityProfileId, type QualityProfileId } from "@lensbridge/shared";

export interface AppPreferences {
  theme: "dark" | "light" | "system";
  defaultQuality: QualityProfileId;
  autoReconnect: boolean;
}

export const defaultPreferences: AppPreferences = {
  theme: "dark",
  defaultQuality: "balanced",
  autoReconnect: true
};

const STORAGE_KEY = "lensbridge.preferences.v1";
const listeners = new Set<(preferences: AppPreferences) => void>();
let cachedPreferences: AppPreferences | null = null;

export function useAppPreferences() {
  const [preferences, setPreferences] = useState<AppPreferences>(() => currentPreferences());

  useEffect(() => {
    listeners.add(setPreferences);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = loadPreferences();
      cachedPreferences = next;
      listeners.forEach((listener) => listener(next));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(setPreferences);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const updatePreferences = useCallback((patch: Partial<AppPreferences>) => {
    savePreferences(normalizePreferences({ ...currentPreferences(), ...patch }));
  }, []);

  return { preferences, updatePreferences };
}

function currentPreferences(): AppPreferences {
  cachedPreferences ??= loadPreferences();
  return cachedPreferences;
}

function savePreferences(preferences: AppPreferences) {
  cachedPreferences = preferences;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  listeners.forEach((listener) => listener(preferences));
}

function loadPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    return normalizePreferences(JSON.parse(raw) as Partial<AppPreferences>);
  } catch {
    return defaultPreferences;
  }
}

function normalizePreferences(value: Partial<AppPreferences>): AppPreferences {
  return {
    theme: value.theme === "light" || value.theme === "system" ? value.theme : defaultPreferences.theme,
    defaultQuality:
      typeof value.defaultQuality === "string" && isQualityProfileId(value.defaultQuality)
        ? value.defaultQuality
        : defaultPreferences.defaultQuality,
    autoReconnect: typeof value.autoReconnect === "boolean" ? value.autoReconnect : defaultPreferences.autoReconnect
  };
}
