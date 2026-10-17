import type { Dict } from "@/lib/i18n";
import { LeadLink } from "./LeadLink";

export function Advise({ d }: { d: Dict }) {
  return (
    <section id="advise" aria-labelledby="advise-h" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 id="advise-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.advise.title}</h2>
          <p className="mt-4 text-lg text-muted">{d.advise.intro}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {d.advise.items.map((a) => (
            <article key={a.id} className="flex flex-col rounded-lg border border-line border-t-4 border-t-ink bg-white p-7 sm:p-8">
              <h3 className="text-[15px] font-semibold text-crimson">{a.label}</h3>
              <p className="display mt-2 text-[1.6rem]">{a.headline}</p>
              <p className="mt-4 text-muted">{a.body}</p>
              <ul aria-label={d.advise.servicesLabel} className="mt-6 flex flex-wrap gap-2">
                {a.services.map((s) => (
                  <li key={s} className="rounded-md bg-paper px-3 py-1 text-sm text-ink/85">{s}</li>
                ))}
              </ul>
              <LeadLink event="lead-type" detail={a.id} className="mt-auto inline-flex min-h-11 items-center pt-6 font-semibold text-ink underline decoration-crimson decoration-2 underline-offset-4 hover:text-crimson">
                {d.advise.link}
              </LeadLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
