import { mockSources } from "../lib/mockData";

export function useSources() {
  return {
    sources: mockSources,
    activeSource: mockSources.find((source) => source.type === "phone-webrtc") ?? null
  };
}
