import { getQualityProfile, type QualityProfileId } from "@lensbridge/shared";

export function constraintsForQuality(
  quality: QualityProfileId,
  facingMode: "user" | "environment" = "environment"
): MediaStreamConstraints {
  const profile = getQualityProfile(quality);
  const video: MediaTrackConstraints & { resizeMode?: "crop-and-scale" } = {
    width: { ideal: profile.width, max: profile.width },
    height: { ideal: profile.height, max: profile.height },
    frameRate: { ideal: profile.fps, max: profile.fps },
    aspectRatio: { ideal: profile.width / profile.height },
    resizeMode: "crop-and-scale",
    facingMode: { ideal: facingMode }
  };

  return {
    audio: false,
    video
  };
}
