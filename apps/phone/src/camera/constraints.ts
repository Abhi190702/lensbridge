import { getQualityProfile, type QualityProfileId } from "@lensbridge/shared";

export function constraintsForQuality(
  quality: QualityProfileId,
  facingMode: "user" | "environment" = "environment"
): MediaStreamConstraints {
  const profile = getQualityProfile(quality);
  const video: MediaTrackConstraints & { resizeMode?: "crop-and-scale" } = {
    width: { min: 640, ideal: profile.width },
    height: { min: 480, ideal: profile.height },
    frameRate: { min: Math.min(24, profile.fps), ideal: profile.fps, max: profile.fps },
    aspectRatio: { ideal: profile.width / profile.height },
    resizeMode: "crop-and-scale",
    facingMode: { ideal: facingMode }
  };

  return {
    audio: false,
    video
  };
}
