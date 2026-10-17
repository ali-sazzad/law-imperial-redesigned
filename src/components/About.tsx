import type { Dict } from "@/lib/i18n";

export function About({ d }: { d: Dict }) {
  return (
    <section id="about" aria-labelledby="about-h" className="bg-paper py-[clamp(4rem,8vw,7rem)]">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 id="about-h" className="display text-[clamp(2rem,3.6vw,3rem)]">{d.about.title}</h2>
          <p className="display mt-6 max-w-[34ch] text-[clamp(1.35rem,2.2vw,1.85rem)] text-ink/85">{d.about.statement}</p>
        </div>
        <ul className="grid gap-0">
          {d.about.principles.map((p) => (
            <li key={p.title} className="border-t border-line py-6 first:border-t-2 first:border-t-ink">
              <h3 className="display text-2xl">{p.title}</h3>
              <p className="mt-2 max-w-[48ch] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
