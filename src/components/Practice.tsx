import type { Dict } from "@/lib/i18n";
import { LeadLink } from "./LeadLink";

export function Practice({ d }: { d: Dict }) {
  return (
    <section id="practice" aria-labelledby="practice-h" className="bg-paper py-[clamp(4rem,8vw,7rem)]">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 id="practice-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.practice.title}</h2>
          <p className="mt-4 text-lg text-muted">{d.practice.intro}</p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {d.practice.areas.map((a) => (
            <li key={a.name} className="flex flex-col bg-white p-6">
              <h3 className="display text-[1.2rem]">{a.name}</h3>
              <p className="mt-2 text-[15px] text-muted">{a.body}</p>
              <LeadLink event="lead-topic" detail={a.name} className="mt-auto inline-flex min-h-11 items-center pt-4 text-[15px] font-semibold text-crimson hover:underline">
                {d.practice.link}
              </LeadLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
