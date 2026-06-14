import { describe, expect, it } from "vitest";
import { constraintsForQuality } from "./constraints";

describe("constraintsForQuality", () => {
  it("maps low latency to 720p camera constraints", () => {
    const constraints = constraintsForQuality("low-latency");
    expect((constraints.video as MediaTrackConstraints).width).toEqual({ min: 640, ideal: 1280 });
    expect((constraints.video as MediaTrackConstraints).height).toEqual({ min: 480, ideal: 720 });
    expect((constraints.video as MediaTrackConstraints).frameRate).toEqual({ min: 24, ideal: 30, max: 30 });
  });
});
