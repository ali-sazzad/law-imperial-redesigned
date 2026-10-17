import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Advise } from "@/components/Advise";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Practice } from "@/components/Practice";
import { Process } from "@/components/Process";
import { Trust } from "@/components/Trust";
import { isLocale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Hero d={d} />
      <Trust d={d} />
      <About d={d} />
      <Advise d={d} />
      <Practice d={d} />
      <Process d={d} />
      <Faq d={d} />
      <Contact d={d} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
