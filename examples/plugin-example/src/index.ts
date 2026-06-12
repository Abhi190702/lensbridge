import { definePlugin } from "@lensbridge/plugin-sdk";

export default definePlugin({
  name: "example-grayscale-filter",
  version: "0.1.0",
  type: "video-filter",
  setup(context) {
    context.log("Example grayscale filter loaded.");
  },
  processFrame(frame: VideoFrame) {
    return frame;
  }
});
