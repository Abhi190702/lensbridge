import { describe, expect, it } from "vitest";
import { constraintsForQuality } from "./constraints";

describe("constraintsForQuality", () => {
  it("maps low latency to 720p camera constraints", () => {
    const constraints = constraintsForQuality("low-latency");
    expect((constraints.video as MediaTrackConstraints).width).toEqual({ ideal: 1280 });
    expect((constraints.video as MediaTrackConstraints).height).toEqual({ ideal: 720 });
  });
});
