import { getTranslations } from "next-intl/server";
import { getHeroSlider, mediaUrl } from "@/lib/api";
import { HomeHeroClient, type HeroSlidePayload } from "./HomeHeroClient";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000&q=80";

export async function HomeHero({ locale }: { locale: string }) {
  const tHero = await getTranslations("hero");
  const tHome = await getTranslations("home.hero");

  const isEn = locale === "en";
  const slidesRaw = await getHeroSlider().catch(() => []);
  const activeSlides = slidesRaw.filter((s) => s.active !== false);

  let slides: HeroSlidePayload[];

  if (activeSlides.length > 0) {
    slides = activeSlides.map((s) => ({
      image: mediaUrl(s.image),
      title: isEn ? (s.titleEn ?? s.title) : s.title,
      subtitle: isEn ? (s.subtitleEn ?? s.subtitle ?? "") : (s.subtitle ?? ""),
      ctaText: (isEn ? (s.ctaTextEn ?? s.ctaText) : s.ctaText) ?? tHome("cta"),
      ctaLink: s.ctaLink ?? "/iletisim",
    }));
  } else {
    slides = [
      {
        image: FALLBACK_IMAGE,
        title: tHero("title"),
        subtitle: tHero("description"),
        ctaText: tHome("cta"),
        ctaLink: "/iletisim",
      },
    ];
  }

  const features = [
    { label: tHero("productionProcess"), href: "/uretim-sureci" },
    { label: tHero("productGroups"),     href: "/urunler" },
    { label: tHero("sustainability"),    href: "/surdurulebilirlik" },
  ];

  return (
    <HomeHeroClient
      slides={slides}
      title={tHero("title")}
      description={tHero("description")}
      features={features}
      ctaText={tHero("cta")}
      ctaLink="/kurumsal"
    />
  );
}
