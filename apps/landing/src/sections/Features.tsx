const features = [
  "QR pairing instead of manual IP entry",
  "Local WebRTC transport for low-latency preview",
  "No accounts, no telemetry, no cloud by default",
  "Honest virtual camera roadmap",
  "Plugin-ready source and transport architecture",
  "Contributor-friendly docs and CI"
];

export function Features() {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold">Built for trust first.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
