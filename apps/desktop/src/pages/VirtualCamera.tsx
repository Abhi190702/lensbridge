import { VirtualCameraPanel } from "../components/VirtualCameraPanel";

export function VirtualCamera() {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Virtual Camera</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          V1 previews the stream in LensBridge Desktop. Sending frames to an OS virtual camera is the V2 target.
        </p>
      </div>
      <VirtualCameraPanel />
    </div>
  );
}
