import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n";
import { digits } from "@/lib/i18n/digits";
import { firm } from "@/lib/site";

export function Footer({ d, locale }: { d: Dict; locale: Locale }) {
  const year = new Intl.NumberFormat(locale === "ne" ? "ne-NP" : "en", { useGrouping: false }).format(new Date().getFullYear());
  const link = "text-white/75 underline-offset-4 hover:text-white hover:underline";

  return (
    <footer className="on-dark bg-ink pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-white xl:pb-0">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-3xl">{d.brand.name}</p>
          <p className="mt-2 text-white/70">{d.brand.tagline}</p>
        </div>

        <nav aria-label={d.footer.explore}>
          <h2 className="text-sm font-semibold text-white/60">{d.footer.explore}</h2>
          <ul className="mt-3 grid gap-1">
            {d.nav.map((l) => (
              <li key={l.id}><a href={`#${l.id}`} className={link}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-white/60">{d.footer.contact}</h2>
          <ul className="mt-3 grid gap-1 text-[15px]">
            {firm.phones.map((p) => (
              <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className={link}>{digits(p, locale)}</a></li>
            ))}
            <li className="mt-2 text-white/75">{d.address.map((l) => <span key={l} className="block">{l}</span>)}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white/60">{d.footer.follow}</h2>
          <ul className="mt-3 grid gap-1">
            {firm.socials.map((s) => (
              <li key={s.label}><a href={s.href} rel="noopener noreferrer" target="_blank" className={link}>{d.footer.social[s.label] ?? s.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-line">
        <p className="container-page py-6 text-sm text-white/60">
          © {year} {d.brand.name}. {d.footer.rights} {d.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
