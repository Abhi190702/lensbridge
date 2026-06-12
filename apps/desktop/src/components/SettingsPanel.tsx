import { Card } from "./ui/Card";
import { Select } from "./ui/Select";
import { Toggle } from "./ui/Toggle";

export function SettingsPanel() {
  return (
    <Card className="p-5">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      <div className="mt-5 grid gap-5">
        <Select label="Default quality" value="balanced" options={[
          { label: "Balanced", value: "balanced" },
          { label: "Low latency", value: "low-latency" },
          { label: "High quality", value: "high-quality" },
          { label: "Battery saver", value: "battery-saver" }
        ]} />
        <Toggle label="Auto-reconnect" description="Ask the phone app to reconnect when Wi-Fi briefly drops." checked />
        <Toggle label="Start minimized" description="Planned desktop tray behavior. Not enabled in V1." checked={false} disabled />
        <Toggle label="Remote relay" description="Future TURN relay for cross-network use. Disabled by design in V1." checked={false} disabled />
      </div>
    </Card>
  );
}
