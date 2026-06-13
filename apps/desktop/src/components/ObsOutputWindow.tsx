import { useEffect, useRef, useState } from "react";
import { VideoOff } from "lucide-react";
import { ObsOutputControls, type ObsBackgroundMode, type ObsFitMode, type ObsRotation } from "./ObsOutputControls";

interface ObsOutputWindowProps {
  stream: MediaStream | null;
  onExit: () => void;
}

export function ObsOutputWindow({ stream, onExit }: ObsOutputWindowProps) {
  const videoRef = useVideoStream(stream);
  const [fitMode, setFitMode] = useState<ObsFitMode>("fit");
  const [backgroundMode, setBackgroundMode] = useState<ObsBackgroundMode>("black");
  const [mirrored, setMirrored] = useState(false);
  const [rotation, setRotation] = useState<ObsRotation>(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
      if (event.key.toLowerCase() === "h") setControlsVisible((value) => !value);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onExit]);

  useEffect(() => {
    scheduleControlHide();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  function scheduleControlHide() {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 2000);
  }

  function revealControls() {
    setControlsVisible(true);
    scheduleControlHide();
  }

  const transform = `${mirrored ? "scaleX(-1) " : ""}rotate(${rotation}deg)`;

  return (
    <main
      className={backgroundMode === "black" ? "obs-output-window bg-black" : "obs-output-window bg-neutral-950"}
      onMouseMove={revealControls}
      onClick={revealControls}
    >
      <section className="obs-output-stage" aria-label="LensBridge OBS output">
        {stream ? (
          <video
            ref={videoRef}
            className={fitMode === "fit" ? "obs-output-video object-contain" : "obs-output-video object-cover"}
            style={{ transform }}
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-black text-neutral-500">
            <VideoOff className="mb-3 h-10 w-10" />
            <p className="text-sm">Waiting for phone stream</p>
          </div>
        )}
      </section>

      {controlsVisible ? (
        <ObsOutputControls
          fitMode={fitMode}
          backgroundMode={backgroundMode}
          mirrored={mirrored}
          rotation={rotation}
          onFitModeChange={setFitMode}
          onBackgroundModeChange={setBackgroundMode}
          onToggleMirror={() => setMirrored((value) => !value)}
          onRotate={() => setRotation((value) => ((value + 90) % 360) as ObsRotation)}
          onHide={() => setControlsVisible(false)}
          onExit={onExit}
        />
      ) : null}
    </main>
  );
}

function useVideoStream(stream: MediaStream | null) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return ref;
}
