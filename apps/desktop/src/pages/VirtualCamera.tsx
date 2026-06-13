import { VirtualCameraPanel } from "../components/VirtualCameraPanel";
import type { DirectCameraBridgeState } from "../hooks/useUnityCaptureBridge";

interface VirtualCameraProps {
  directCamera: DirectCameraBridgeState;
}

export function VirtualCamera({ directCamera }: VirtualCameraProps) {
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">Virtual Camera</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Windows V2 uses a DirectShow device named LensBridge Camera. OBS Output Mode remains as a fallback for systems
          where the DirectShow driver is not installed or a target app refuses virtual DirectShow devices.
        </p>
      </div>
      <VirtualCameraPanel directCamera={directCamera} />
    </div>
  );
}
