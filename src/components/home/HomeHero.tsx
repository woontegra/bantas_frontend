import { getTranslations } from "next-intl/server";
import { getHeroSlider, mediaUrl } from "@/lib/api";
import { HomeHeroClient, type HeroSlidePayload, type HeroFeature, type HeroStat } from "./HomeHeroClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2000&q=80";

interface SettingStat    { value: string; label: string; labelEn: string }
interface SettingFeature { label: string; labelEn: string; href: string }

interface HeroSettings {
  heroBadge?:       string;
  heroBadgeEn?:     string;
  heroBtn2Text?:    string;
  heroBtn2TextEn?:  string;
  heroBtn2Url?:     string;
  heroStats?:       SettingStat[];
  heroFeatures?:    SettingFeature[];
}

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/anasayfa-settings`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return {};
    return JSON.parse(page.sections) as HeroSettings;
  } catch {
    return {};
  }
}

export async function HomeHero({ locale }: { locale: string }) {
  const tHero   = await getTranslations("hero");
  const tHome   = await getTranslations("home.hero");
  const settings = await getHeroSettings();

  const isEn = locale === "en";
  const slidesRaw    = await getHeroSlider().catch(() => []);
  const activeSlides = slidesRaw.filter((s) => s.active !== false);

  let slides: HeroSlidePayload[];

  if (activeSlides.length > 0) {
    slides = activeSlides.map((s) => ({
      image:    mediaUrl(s.image),
      title:    isEn ? (s.titleEn    ?? s.title)        : s.title,
      subtitle: isEn ? (s.subtitleEn ?? s.subtitle ?? "") : (s.subtitle ?? ""),
      ctaText:  (isEn ? (s.ctaTextEn ?? s.ctaText) : s.ctaText) ?? tHome("cta"),
      ctaLink:  s.ctaLink ?? "/iletisim",
    }));
  } else {
    slides = [{
      image:    FALLBACK_IMAGE,
      title:    tHero("title"),
      subtitle: tHero("description"),
      ctaText:  tHome("cta"),
      ctaLink:  "/iletisim",
    }];
  }

  /* Badge */
  const badge = (isEn ? settings.heroBadgeEn : settings.heroBadge)
    ?? (isEn ? "Bantaş Inc. — Metal Packaging" : "Bantaş A.Ş. — Metal Ambalaj");

  /* 2nd button */
  const btn2Text = (isEn ? settings.heroBtn2TextEn : settings.heroBtn2Text)
    ?? (isEn ? "Our Products" : "Ürünlerimiz");
  const btn2Url  = settings.heroBtn2Url ?? "/urunler";

  /* Stats */
  const defaultStats: HeroStat[] = [
    { value: "25+",  label: isEn ? "Years Experience"  : "Yıl Deneyim",      },
    { value: "50+",  label: isEn ? "Export Countries"  : "İhracat Ülkesi",   },
    { value: "ISO",  label: isEn ? "9001 Certified"    : "9001 Sertifikalı", },
    { value: "500+", label: isEn ? "Product Varieties" : "Ürün Çeşidi",      },
  ];

  const stats: HeroStat[] = (settings.heroStats ?? []).length > 0
    ? (settings.heroStats!).map(s => ({
        value: s.value,
        label: isEn ? s.labelEn : s.label,
      }))
    : defaultStats;

  /* Feature links */
  const defaultFeatures: HeroFeature[] = [
    { label: isEn ? "Our Production Process" : "Üretim Sürecimiz",  href: "/uretim-sureci"     },
    { label: isEn ? "Product Groups"         : "Ürün Grupları",     href: "/urunler"            },
    { label: isEn ? "Sustainability"         : "Sürdürülebilirlik", href: "/surdurulebilirlik"  },
  ];

  const features: HeroFeature[] = (settings.heroFeatures ?? []).length > 0
    ? (settings.heroFeatures!).map(f => ({
        label: isEn ? f.labelEn : f.label,
        href:  f.href,
      }))
    : defaultFeatures;

  return (
    <HomeHeroClient
      slides={slides}
      title={tHero("title")}
      description={tHero("description")}
      badge={badge}
      btn2Text={btn2Text}
      btn2Url={btn2Url}
      stats={stats}
      features={features}
      ctaText={tHero("cta")}
      ctaLink="/kurumsal"
    />
  );
}
