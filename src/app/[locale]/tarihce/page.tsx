import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CorporateSidebar } from "@/components/layout/CorporateSidebar";
import { Calendar, Globe, Factory, Award, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarihçe | Bantaş",
  description: "1986'dan bu yana metal ambalaj sektöründe büyüyen Bantaş'ın yolculuğu.",
};

type Category = "company" | "product" | "achievement";

interface ApiEvent {
  year: string;
  category: Category;
  text: string;
  textEn?: string;
}

interface ApiSections {
  stats?: { experience?: string; capacity?: string; products?: string };
  cta?: { title?: string; titleEn?: string; description?: string; descriptionEn?: string };
  events?: ApiEvent[];
}

interface ContentPageData {
  title?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  content?: string;
  contentEn?: string;
  sections?: string;
}

const DEFAULT_EVENTS: ApiEvent[] = [
  { year: "1986", category: "company",      text: "1986" },
  { year: "1994", category: "company",      text: "1994" },
  { year: "1998", category: "achievement",  text: "1998_1" },
  { year: "1998", category: "company",      text: "1998_2" },
  { year: "2005", category: "product",      text: "2005" },
  { year: "2008", category: "achievement",  text: "2008" },
  { year: "2009", category: "product",      text: "2009" },
  { year: "2010", category: "company",      text: "2010" },
  { year: "2011", category: "product",      text: "2011" },
  { year: "2016", category: "achievement",  text: "2016" },
  { year: "2017", category: "product",      text: "2017" },
];

const categoryConfig = {
  company: {
    icon: Factory,
    card: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    year: "bg-blue-600",
  },
  product: {
    icon: Award,
    card: "bg-emerald-50 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    year: "bg-emerald-600",
  },
  achievement: {
    icon: TrendingUp,
    card: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    year: "bg-purple-600",
  },
} satisfies Record<Category, object>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchHistoryPage(): Promise<ContentPageData | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/tarihce`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TarihcePage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("history");
  const locale = params.locale;

  const apiData = await fetchHistoryPage();
  let sections: ApiSections = {};
  if (apiData?.sections) {
    try { sections = JSON.parse(apiData.sections); } catch { /* ignore */ }
  }

  const isEn = locale === "en";

  // Hero
  const heroTitle = isEn
    ? apiData?.titleEn || apiData?.title || t("title")
    : apiData?.title || t("title");
  const heroSubtitle = isEn
    ? apiData?.subtitleEn || apiData?.subtitle || t("subtitle")
    : apiData?.subtitle || t("subtitle");
  const heroDesc = isEn
    ? apiData?.contentEn || apiData?.content || t("description")
    : apiData?.content || t("description");

  // Stats
  const stats = sections.stats ?? {};
  const expVal   = stats.experience ?? "38+";
  const capVal   = stats.capacity ?? "1M+";
  const prodVal  = stats.products ?? "727";

  // CTA
  const ctaTitle = isEn
    ? sections.cta?.titleEn || sections.cta?.title || t("cta.title")
    : sections.cta?.title || t("cta.title");
  const ctaDesc = isEn
    ? sections.cta?.descriptionEn || sections.cta?.description || t("cta.description")
    : sections.cta?.description || t("cta.description");

  // Events: if API has events use them, else use translation keys
  const events: ApiEvent[] = sections.events?.length
    ? sections.events
    : DEFAULT_EVENTS;

  // Helper: get event text (API events have raw text; default events use translation key)
  function getEventText(ev: ApiEvent): string {
    if (sections.events?.length) {
      return isEn ? (ev.textEn || ev.text) : ev.text;
    }
    // Default events: text field is actually a translation key
    return t(`events.${ev.text}`);
  }

  return (
    <>
      <SiteHeader />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-emerald-400" />
              <span className="text-sm font-light uppercase tracking-widest text-emerald-400">
                {heroSubtitle}
              </span>
            </div>
            <h1 className="mb-4 text-5xl font-light md:text-6xl">{heroTitle}</h1>
            <p className="max-w-3xl text-xl font-light leading-relaxed text-gray-300">
              {heroDesc}
            </p>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="border-b border-gray-100 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-slate-900">{expVal}</p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.experience")}</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-3xl font-bold text-slate-900">{capVal}</p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.capacity")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{prodVal}</p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.products")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <CorporateSidebar />

            <div className="min-w-0 flex-1">
              {/* Legend */}
              <div className="mb-10 flex flex-wrap gap-3">
                {(["company", "product", "achievement"] as Category[]).map((cat) => {
                  const c = categoryConfig[cat];
                  const Icon = c.icon;
                  const label = t(`categories.${cat}`);
                  return (
                    <span key={cat} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.badge}`}>
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                  );
                })}
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute bottom-0 left-5 top-0 w-0.5 bg-gradient-to-b from-emerald-200 via-slate-300 to-purple-200 md:left-1/2 md:-translate-x-px" />

                <div className="space-y-10">
                  {events.map((event, idx) => {
                    const c = categoryConfig[event.category] ?? categoryConfig.company;
                    const Icon = c.icon;
                    const isLeft = idx % 2 === 0;
                    const label = t(`categories.${event.category}`);
                    const text = getEventText(event);

                    return (
                      <div key={idx} className="relative flex gap-5 md:gap-0">
                        {/* Mobile */}
                        <div className="flex flex-col items-center md:hidden">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md ${c.year}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="my-1 w-px flex-1 bg-gray-200" />
                        </div>
                        <div className="flex-1 pb-2 md:hidden">
                          <div className="mb-1 text-xs font-bold text-gray-400">{event.year}</div>
                          <div className={`rounded-xl border p-4 shadow-sm ${c.card}`}>
                            <span className={`mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`}>
                              <Icon className="h-3 w-3" />{label}
                            </span>
                            <p className="text-sm leading-relaxed text-gray-700">{text}</p>
                          </div>
                        </div>

                        {/* Desktop left */}
                        <div className={`hidden w-[calc(50%-2.5rem)] md:block ${isLeft ? "pr-6" : ""}`}>
                          {isLeft && (
                            <div className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${c.card}`}>
                              <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
                                <Icon className="h-3 w-3" />{label}
                              </span>
                              <p className="text-sm leading-relaxed text-gray-700">{text}</p>
                            </div>
                          )}
                        </div>

                        {/* Desktop year badge */}
                        <div className="hidden w-20 shrink-0 flex-col items-center md:flex">
                          <div className={`z-10 whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold text-white shadow-lg ${c.year}`}>
                            {event.year}
                          </div>
                        </div>

                        {/* Desktop right */}
                        <div className={`hidden w-[calc(50%-2.5rem)] md:block ${!isLeft ? "pl-6" : ""}`}>
                          {!isLeft && (
                            <div className={`rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${c.card}`}>
                              <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
                                <Icon className="h-3 w-3" />{label}
                              </span>
                              <p className="text-sm leading-relaxed text-gray-700">{text}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <h2 className="mb-4 text-3xl font-light">{ctaTitle}</h2>
            <p className="text-lg font-light leading-relaxed text-emerald-50">{ctaDesc}</p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
