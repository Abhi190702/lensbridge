import { selectableQualityProfiles, type QualityProfileId } from "@lensbridge/shared";

interface QualitySelectorProps {
  value: QualityProfileId;
  onChange: (value: QualityProfileId) => void;
}

export function QualitySelector({ value, onChange }: QualitySelectorProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">Quality</span>
      <select
        className="w-full rounded-lg border border-line bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-brand"
        value={value}
        onChange={(event) => onChange(event.target.value as QualityProfileId)}
      >
        {selectableQualityProfiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.label}
          </option>
        ))}
      </select>
    </label>
  );
}
