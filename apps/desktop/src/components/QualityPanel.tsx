import { selectableQualityProfiles } from "@lensbridge/shared";
import { Card } from "./ui/Card";

export function QualityPanel() {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-white">Capture profiles</h3>
        <p className="mt-1 text-sm text-slate-400">Phone camera constraints used for the WebRTC sender.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {selectableQualityProfiles.map((profile) => (
          <div key={profile.id} className="border border-line bg-white/[0.025] p-3">
            <div className="text-sm font-medium text-white">{profile.label}</div>
            <div className="mt-1 text-xs text-slate-400">
              {profile.width}x{profile.height} · {profile.fps}fps
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
