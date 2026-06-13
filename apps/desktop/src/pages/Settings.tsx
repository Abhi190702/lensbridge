import { SettingsPanel } from "../components/SettingsPanel";

export function Settings() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Small, explicit controls. No background behavior without permission.
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}
