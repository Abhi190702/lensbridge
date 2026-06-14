import { selectableQualityProfiles, type QualityProfileId } from "@lensbridge/shared";
import { Card } from "./ui/Card";
import { Select } from "./ui/Select";
import { Toggle } from "./ui/Toggle";
import { useAppPreferences } from "../store/appStore";

export function SettingsPanel() {
  const { preferences, updatePreferences } = useAppPreferences();

  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      <div className="mt-5 grid gap-5">
        <Select
          label="Default quality"
          value={preferences.defaultQuality}
          options={selectableQualityProfiles.map((profile) => ({ label: profile.label, value: profile.id }))}
          onChange={(value) => updatePreferences({ defaultQuality: value as QualityProfileId })}
        />
        <Toggle
          label="Auto-reconnect"
          description="Ask the phone app to reconnect when Wi-Fi briefly drops."
          checked={preferences.autoReconnect}
          onChange={(autoReconnect) => updatePreferences({ autoReconnect })}
        />
        <Toggle
          label="Start minimized"
          description="Planned desktop tray behavior. Not enabled in V1."
          checked={false}
          disabled
        />
        <Toggle
          label="Remote relay"
          description="Future TURN relay for cross-network use. Disabled by design in V1."
          checked={false}
          disabled
        />
      </div>
    </Card>
  );
}
