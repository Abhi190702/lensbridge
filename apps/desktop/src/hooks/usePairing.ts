import type { PairingPayload } from "@lensbridge/shared";
import { encodePairingPayload } from "@lensbridge/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPairingSession, regeneratePairingSession } from "../lib/api";
import { createQrDataUrl } from "../lib/qr";
import { useAppPreferences } from "../store/appStore";

export function usePairing() {
  const { preferences } = useAppPreferences();
  const [session, setSession] = useState<PairingPayload | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const phoneUrl = useMemo(() => {
    if (!session) return null;
    const encoded = encodePairingPayload(session);
    const url = new URL(session.phoneUrl ?? `http://${session.host}:5174/`);
    url.searchParams.set("pairing", encoded);
    url.searchParams.set("quality", preferences.defaultQuality);
    url.searchParams.set("autoReconnect", String(preferences.autoReconnect));
    return url.toString();
  }, [preferences.autoReconnect, preferences.defaultQuality, session]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await getPairingSession();
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load pairing session.");
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await regeneratePairingSession();
      setSession(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not regenerate pairing session.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!phoneUrl) {
      setQrDataUrl(null);
      return;
    }
    void createQrDataUrl(phoneUrl).then(setQrDataUrl).catch(() => setQrDataUrl(null));
  }, [phoneUrl]);

  const expiresInSeconds = session ? Math.max(0, Math.floor((Date.parse(session.expiresAt) - now) / 1000)) : 0;

  return {
    session,
    qrDataUrl,
    phoneUrl,
    expiresInSeconds,
    loading,
    error,
    refresh,
    regenerate
  };
}
