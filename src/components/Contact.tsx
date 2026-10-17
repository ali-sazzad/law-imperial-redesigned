import type { Dict } from "@/lib/i18n";
import { digits } from "@/lib/i18n/digits";
import type { Locale } from "@/lib/i18n/config";
import { firm } from "@/lib/site";
import { LeadForm } from "./LeadForm";

export function Contact({ d }: { d: Dict }) {
  const locale = d.htmlLang as Locale;
  return (
    <section id="contact" aria-labelledby="contact-h" className="bg-paper py-[clamp(4rem,8vw,7rem)]">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <h2 id="contact-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.contact.title}</h2>
          <p className="mt-4 max-w-[44ch] text-lg text-muted">{d.contact.lead}</p>
          <dl className="mt-9 grid gap-6">
            <div>
              <dt className="text-sm font-semibold text-muted">{d.contact.phone}</dt>
              {firm.phones.map((p) => (
                <dd key={p}><a className="text-lg font-semibold hover:text-crimson" href={`tel:${p.replace(/\s/g, "")}`}>{digits(p, locale)}</a></dd>
              ))}
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted">{d.contact.office}</dt>
              <dd>{d.address.map((l) => <span key={l} className="block">{l}</span>)}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted">{d.contact.hours}</dt>
              <dd>{d.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <LeadForm d={d} />
        </div>
      </div>
    </section>
  );
}
