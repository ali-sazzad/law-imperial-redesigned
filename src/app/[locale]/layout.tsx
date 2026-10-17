import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n";
import { firm } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    metadataBase: new URL(firm.url),
    title: { default: d.meta.title, template: `%s | ${d.brand.name}` },
    description: d.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ne: "/ne", "x-default": "/en" },
    },
    openGraph: {
      title: d.brand.name,
      description: d.brand.tagline,
      type: "website",
      siteName: d.brand.name,
      locale: d.ogLocale,
      alternateLocale: locale === "ne" ? "en_US" : "ne_NP",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: d.brand.name,
    slogan: d.brand.tagline,
    url: `${firm.url}/${locale}`,
    telephone: firm.phones[0],
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      streetAddress: d.address[0],
      addressLocality: locale === "ne" ? "काठमाडौँ" : "Kathmandu",
      postalCode: "44600",
      addressCountry: "NP",
    },
    openingHours: "Su-Fr 09:00-18:00",
  };

  return (
    <>
      <Header d={d} locale={locale} />
      <main id="main">{children}</main>
      <Footer d={d} locale={locale} />
      <BackToTop label={d.ui.homeLabel} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
