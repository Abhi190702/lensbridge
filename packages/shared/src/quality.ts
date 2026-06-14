export type QualityProfileId = "low-latency" | "balanced" | "high-quality" | "battery-saver" | "custom";

export interface QualityProfile {
  id: QualityProfileId;
  label: string;
  width: number;
  height: number;
  fps: number;
  bitrateKbps?: number;
  facingMode?: "user" | "environment";
}

export const qualityProfiles: QualityProfile[] = [
  {
    id: "low-latency",
    label: "Low Latency",
    width: 960,
    height: 540,
    fps: 30,
    bitrateKbps: 1800,
    facingMode: "environment"
  },
  {
    id: "balanced",
    label: "Balanced",
    width: 1280,
    height: 720,
    fps: 30,
    bitrateKbps: 3500,
    facingMode: "environment"
  },
  {
    id: "high-quality",
    label: "High Quality",
    width: 1280,
    height: 720,
    fps: 30,
    bitrateKbps: 5000,
    facingMode: "environment"
  },
  {
    id: "battery-saver",
    label: "Battery Saver",
    width: 640,
    height: 360,
    fps: 24,
    bitrateKbps: 1200,
    facingMode: "environment"
  },
  { id: "custom", label: "Custom", width: 1280, height: 720, fps: 30, facingMode: "environment" }
];

export function getQualityProfile(id: QualityProfileId): QualityProfile {
  return qualityProfiles.find((profile) => profile.id === id) ?? qualityProfiles[1];
}
