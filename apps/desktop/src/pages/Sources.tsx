import { SourceGrid } from "../components/SourceGrid";

export function Sources() {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-white">Sources</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Only phone WebRTC is active in V1. Other source types are scaffolded so contributors can add them cleanly.
        </p>
      </div>
      <SourceGrid />
    </div>
  );
}
