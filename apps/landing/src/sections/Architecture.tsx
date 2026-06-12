export function Architecture() {
  return (
    <section className="bg-ink px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold">V1 architecture</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Phone PWA camera", "Local signaling", "Desktop preview"].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-medium">{item}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">Small, inspectable pieces that avoid fake native driver claims.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
