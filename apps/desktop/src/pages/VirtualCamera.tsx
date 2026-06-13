import { VirtualCameraPanel } from "../components/VirtualCameraPanel";

export function VirtualCamera() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Virtual Camera</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Current Windows/macOS workflow: LensBridge creates a clean OBS output surface, and OBS Virtual Camera exposes
          it to browser and meeting apps. Native OS camera drivers are roadmap work, not shipped support.
        </p>
      </div>
      <VirtualCameraPanel />
    </div>
  );
}
