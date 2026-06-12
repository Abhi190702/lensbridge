import { Camera } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen bg-ink px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-brand/40 bg-brand/10 text-brand">
          <Camera className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-brand">LensBridge</p>
        <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">Bridge any camera source into any app.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A local-first open-source camera bridge starting with phone-to-desktop WebRTC, built to grow into phones,
          computers, IP cameras, OBS, screen capture, and community plugins.
        </p>
      </div>
    </section>
  );
}
