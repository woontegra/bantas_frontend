import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickActionBar } from "@/components/home/QuickActionBar";
import { ProductGrid } from "@/components/home/ProductGrid";
import { FeaturesRow } from "@/components/home/FeaturesRow";
import { QualitySection } from "@/components/home/QualitySection";
import { IntroBlock } from "@/components/home/IntroBlock";
import { AboutBlock } from "@/components/home/AboutBlock";

export default async function HomePage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await Promise.resolve(params);
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero locale={locale} />
        <QuickActionBar />
        <ProductGrid locale={locale} />
        <FeaturesRow locale={locale} />
        <QualitySection locale={locale} />
        <IntroBlock />
        <AboutBlock locale={locale} />
      </main>
      <SiteFooter />
    </>
  );
}
