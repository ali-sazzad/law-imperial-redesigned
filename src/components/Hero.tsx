import type { Dict } from "@/lib/i18n";
import { digits } from "@/lib/i18n/digits";
import type { Locale } from "@/lib/i18n/config";
import { firm } from "@/lib/site";

export function Hero({ d }: { d: Dict }) {
  const locale = d.htmlLang as Locale;
  return (
    <section id="top" aria-labelledby="hero-h" className="on-dark relative isolate overflow-hidden bg-ink text-white">
      {/* Himalayan ridge line: quiet, decorative, and cheap (one inline SVG). */}
      <svg aria-hidden="true" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 -z-10 h-[60%] w-full">
        <path d="M0 250 L120 190 L210 230 L360 120 L450 180 L600 70 L740 200 L880 130 L1020 210 L1180 100 L1320 190 L1440 140 V360 H0Z" fill="#14293f" />
        <path d="M0 300 L170 240 L300 280 L470 200 L610 270 L790 220 L960 285 L1130 230 L1300 280 L1440 240 V360 H0Z" fill="#102338" />
        <path d="M0 250 L120 190 L210 230 L360 120 L450 180 L600 70 L740 200 L880 130 L1020 210 L1180 100 L1320 190 L1440 140" fill="none" stroke="#2d4866" strokeWidth="2" />
      </svg>

      <div className="container-page grid items-center gap-12 py-[clamp(3.5rem,8vw,7rem)] lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <h1 id="hero-h" className="display max-w-[16ch] text-[clamp(2.5rem,5.6vw,4.75rem)]">{d.hero.title}</h1>
          <p className="mt-6 max-w-[52ch] text-lg text-white/80 sm:text-xl">{d.hero.lead}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#contact" className="btn bg-crimson px-7 text-white hover:bg-crimson-dark">{d.cta}</a>
            <a href="#practice" className="btn border border-white/40 px-7 text-white hover:bg-white/10">{d.hero.secondary}</a>
          </div>
        </div>

        <aside className="on-dark rounded-lg bg-white p-7 text-ink shadow-xl shadow-black/20" aria-label={d.hero.cardTitle}>
          <h2 className="display text-2xl">{d.hero.cardTitle}</h2>
          <p className="mt-3 text-[15px] text-muted">{d.hero.cardBody}</p>
          <ul className="mt-5 grid gap-1 text-lg font-semibold">
            {firm.phones.map((p) => (
              <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-crimson">{digits(p, locale)}</a></li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
            <span className="font-semibold text-ink">{d.hero.officeHours}:</span> {d.hours}
          </p>
        </aside>
      </div>
    </section>
  );
}
