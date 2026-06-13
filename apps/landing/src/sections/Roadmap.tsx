const roadmap = ["V1 phone preview", "V2 OBS reliability", "V3 universal sources", "V4 local AI + plugins"];

export function Roadmap() {
  return (
    <section className="bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold">Roadmap</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {roadmap.map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
