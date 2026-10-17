import type { Dict } from "@/lib/i18n";

/** A true sequence, so the numbering carries meaning. */
export function Process({ d }: { d: Dict }) {
  return (
    <section id="process" aria-labelledby="process-h" className="on-dark bg-ink py-[clamp(4rem,8vw,7rem)] text-white">
      <div className="container-page">
        <h2 id="process-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.process.title}</h2>
        <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-0">
          {d.process.steps.map((s, i) => (
            <li key={s.title} className="relative lg:pr-10">
              <div className="flex items-center gap-4">
                <span aria-label={`${d.process.stepLabel} ${i + 1}`} className="display flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 text-xl">
                  {new Intl.NumberFormat(d.htmlLang === "ne" ? "ne-NP" : "en").format(i + 1)}
                </span>
                {i < d.process.steps.length - 1 && <span aria-hidden="true" className="hidden h-px flex-1 bg-ink-line lg:block" />}
              </div>
              <h3 className="display mt-5 text-2xl">{s.title}</h3>
              <p className="mt-2 max-w-[36ch] text-white/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
