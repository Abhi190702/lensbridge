import { Card } from "../components/ui/Card";

export function About() {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-brand">LensBridge v0.1</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">A local-first camera bridge.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        The first version focuses on a real phone-to-desktop path. The broader mission is to bridge phones, other
        computers, IP cameras, OBS, screen capture, and community plugins into reliable webcam workflows.
      </p>
    </Card>
  );
}
