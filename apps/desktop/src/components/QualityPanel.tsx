import { qualityProfiles } from "@lensbridge/shared";
import { Card } from "./ui/Card";

export function QualityPanel() {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-white">Quality Profiles</h3>
        <p className="mt-1 text-sm text-slate-400">Profiles are shared with the phone app and mapped to getUserMedia constraints.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {qualityProfiles.map((profile) => (
          <div key={profile.id} className="rounded-lg border border-line bg-white/[0.03] p-3">
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
