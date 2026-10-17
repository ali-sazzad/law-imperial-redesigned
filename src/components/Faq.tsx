import type { Dict } from "@/lib/i18n";

/** Native <details>: keyboard and screen-reader support for free, and no JavaScript shipped for it. */
export function Faq({ d }: { d: Dict }) {
  return (
    <section id="faq" aria-labelledby="faq-h" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <h2 id="faq-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.faq.title}</h2>
          <p className="mt-4 max-w-[38ch] text-muted">{d.faq.intro}</p>
          <a href="#contact" className="btn mt-7 border border-ink text-ink hover:bg-paper">{d.faq.ask}</a>
        </div>

        <div className="border-t border-line">
          {d.faq.items.map((f, i) => (
            <details key={f.q} name="faq" open={i === 0} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
                <h3 className="display text-[1.2rem] group-open:text-crimson">{f.q}</h3>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[62ch] pb-6 pr-12 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
