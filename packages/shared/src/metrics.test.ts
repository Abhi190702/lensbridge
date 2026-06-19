import { describe, expect, it } from "vitest";
import { summarizeFramePumpBenchmark } from "./metrics";

describe("benchmark metrics", () => {
  it("summarizes frame pump samples", () => {
    const summary = summarizeFramePumpBenchmark(
      {
        capturedFrames: 120,
        deliveredFrames: 100,
        droppedFrames: 12,
        frameSendDurationsMs: [1, 2, 3, 4, 20]
      },
      10
    );

    expect(summary.actualFps).toBe(10);
    expect(summary.droppedFrames).toBe(20);
    expect(summary.averageFrameSendMs).toBe(6);
    expect(summary.p95FrameSendMs).toBe(4);
  });
});
