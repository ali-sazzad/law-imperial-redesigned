import type { Dict } from "@/lib/i18n";

/** Credibility strip: three plain facts, then the directories that recognise the firm. */
export function Trust({ d }: { d: Dict }) {
  return (
    <section aria-label={d.trust.recognitionTitle} className="border-b border-line bg-white">
      <dl className="container-page grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {d.trust.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse py-7 sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <dt className="mt-1 text-muted">{s.label}</dt>
            <dd className="display text-5xl text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-line bg-paper">
        <div className="container-page flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:gap-8">
          <p className="shrink-0 text-sm font-semibold text-ink">{d.trust.recognitionTitle}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-1 text-[15px] text-muted">
            {d.trust.recognition.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
