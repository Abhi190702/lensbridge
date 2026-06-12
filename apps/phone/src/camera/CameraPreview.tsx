import { useEffect, useRef } from "react";

interface CameraPreviewProps {
  stream: MediaStream | null;
}

export function CameraPreview({ stream }: CameraPreviewProps) {
  const ref = useVideoStream(stream);

  return (
    <div className="absolute inset-0 bg-black">
      {stream ? <video ref={ref} className="h-full w-full object-cover" autoPlay playsInline muted /> : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
    </div>
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
