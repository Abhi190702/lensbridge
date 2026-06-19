import type { PairingPayload, SecurityAuditEvent, TrustedDeviceRecord } from "@lensbridge/shared";
import { ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "./ui/Card";
import { formatDateTime } from "../lib/format";
import { listSecurityAuditEvents, listTrustedDevices, revokeTrustedDevice } from "../lib/api";

interface SecurityPanelProps {
  session: PairingPayload | null;
}

export function SecurityPanel({ session }: SecurityPanelProps) {
  const [trustedDevices, setTrustedDevices] = useState<TrustedDeviceRecord[]>([]);
  const [auditEvents, setAuditEvents] = useState<SecurityAuditEvent[]>([]);

  useEffect(() => {
    void refreshSecurityState();
  }, []);

  async function refreshSecurityState() {
    const [devices, events] = await Promise.all([listTrustedDevices(), listSecurityAuditEvents()]);
    setTrustedDevices(devices);
    setAuditEvents(events);
  }

  async function revoke(deviceId: string) {
    await revokeTrustedDevice(deviceId);
    await refreshSecurityState();
  }

  return (
    <Card className="grid gap-5 p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-line text-accent">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Security posture</h2>
          <p className="text-sm text-slate-400">Local-first defaults with short-lived sessions.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SecurityRow label="Local-only mode" value="Enabled" />
        <SecurityRow label="Cloud relay" value="Disabled" />
        <SecurityRow label="Media encryption" value="WebRTC DTLS-SRTP" />
        <SecurityRow label="Pairing approval" value="Required for unknown devices" />
        <SecurityRow label="Transport mode" value={session?.secure ? "HTTPS/WSS configured" : "Dev HTTP/WS"} warning={!session?.secure} />
        <SecurityRow label="Session expires" value={session ? formatDateTime(session.expiresAt) : "No session"} />
      </div>

      {!session?.secure ? (
        <div className="flex gap-3 border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-50">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Development transport is plain HTTP/WS. Use it only on a trusted LAN until local TLS is configured.</p>
        </div>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Trusted devices</h3>
        <div className="mt-3 grid gap-2">
          {trustedDevices.length ? (
            trustedDevices.map((device) => (
              <div key={device.deviceId} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white/[0.025] p-3">
                <div>
                  <div className="font-medium text-white">{device.label}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {device.platform ?? "Unknown platform"} · fingerprint {device.fingerprint}
                  </div>
                </div>
                <button
                  className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-semibold text-slate-200 hover:border-rose-300/40 hover:text-rose-100"
                  onClick={() => void revoke(device.deviceId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Revoke
                </button>
              </div>
            ))
          ) : (
            <p className="border border-line bg-white/[0.025] p-3 text-sm text-slate-400">
              No trusted devices yet. Approve a phone once or trust it from the pairing request.
            </p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Recent security events</h3>
        <div className="mt-3 grid gap-2">
          {auditEvents.length ? (
            auditEvents.map((event) => (
              <div key={event.id} className="border border-line bg-white/[0.025] p-3 text-sm">
                <div className="font-medium text-white">{event.message}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {event.kind} · {formatDateTime(event.createdAt)}
                </div>
              </div>
            ))
          ) : (
            <p className="border border-line bg-white/[0.025] p-3 text-sm text-slate-400">
              Audit events will appear after pairing requests, approvals, and revocations.
            </p>
          )}
        </div>
      </section>
    </Card>
  );
}

function SecurityRow({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.025] p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-sm font-medium ${warning ? "text-amber-100" : "text-white"}`}>{value}</div>
    </div>
  );
}
