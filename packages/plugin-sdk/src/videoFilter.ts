import type { LensBridgePlugin } from "./pluginTypes";

export interface VideoFilterPlugin extends LensBridgePlugin {
  type: "video-filter";
  processFrame(frame: VideoFrame): VideoFrame | Promise<VideoFrame>;
}
