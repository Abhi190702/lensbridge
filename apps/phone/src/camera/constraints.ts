import { getQualityProfile, type QualityProfileId } from "@lensbridge/shared";

export function constraintsForQuality(quality: QualityProfileId, facingMode: "user" | "environment" = "environment"): MediaStreamConstraints {
  const profile = getQualityProfile(quality);

  return {
    audio: false,
    video: {
      width: { ideal: profile.width },
      height: { ideal: profile.height },
      frameRate: { ideal: profile.fps, max: profile.fps },
      facingMode: { ideal: facingMode }
    }
  };
}
