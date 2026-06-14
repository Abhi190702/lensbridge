import { describe, expect, it } from "vitest";
import { constraintsForQuality } from "./constraints";

describe("constraintsForQuality", () => {
  it("caps low latency at 540p camera constraints", () => {
    const constraints = constraintsForQuality("low-latency");
    expect((constraints.video as MediaTrackConstraints).width).toEqual({ ideal: 960, max: 960 });
    expect((constraints.video as MediaTrackConstraints).height).toEqual({ ideal: 540, max: 540 });
    expect((constraints.video as MediaTrackConstraints).frameRate).toEqual({ ideal: 30, max: 30 });
  });

  it("caps balanced at 720p camera constraints", () => {
    const constraints = constraintsForQuality("balanced");
    expect((constraints.video as MediaTrackConstraints).width).toEqual({ ideal: 1280, max: 1280 });
    expect((constraints.video as MediaTrackConstraints).height).toEqual({ ideal: 720, max: 720 });
    expect((constraints.video as MediaTrackConstraints).frameRate).toEqual({ ideal: 30, max: 30 });
  });
});
