import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CorporateSidebar } from "@/components/layout/CorporateSidebar";
import { ImageCarousel, SizesList } from "./_components/TeknolojiClient";
import { Cog, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teknoloji | Bantaş",
  description:
    "Bantaş'ın modern üretim tesisleri, metal ofset baskı ve teneke kutu üretim teknolojileri.",
};

interface ApiSection {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  details?: string;
  detailsEn?: string;
  images?: string[];
  isSizesList?: boolean;
  sizes?: string[];
}

interface ApiSections {
  stats?: { established?: string; capacity?: string; certified?: string };
  sections?: ApiSection[];
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchTeknolojiPage(): Promise<ContentPageData | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/teknoloji`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function TeknolojiPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("technology");
  const locale = params.locale;
  const isEn = locale === "en";

  const apiData = await fetchTeknolojiPage();
  let apiSections: ApiSections = {};
  if (apiData?.sections) {
    try { apiSections = JSON.parse(apiData.sections); } catch { /* ignore */ }
  }

  const heroTitle    = isEn ? (apiData?.titleEn    || apiData?.title    || t("title"))       : (apiData?.title    || t("title"));
  const heroSubtitle = isEn ? (apiData?.subtitleEn || apiData?.subtitle || t("subtitle"))    : (apiData?.subtitle || t("subtitle"));
  const heroDesc     = isEn ? (apiData?.contentEn  || apiData?.content  || t("description")) : (apiData?.content  || t("description"));

  const stats = apiSections.stats ?? {};

  // Build sections — API first, fallback to translations
  const hasSections = Array.isArray(apiSections.sections) && apiSections.sections.length > 0;

  type Section = {
    id: string;
    title: string;
    description: string;
    subtitle?: string;
    details?: string;
    images: string[];
    isSizesList?: boolean;
    sizes?: string[];
  };

  let sections: Section[];
  if (hasSections) {
    sections = apiSections.sections!.map((s, i) => ({
      id: String(i),
      title:       isEn ? (s.titleEn       || s.title)       : s.title,
      description: isEn ? (s.descriptionEn || s.description) : s.description,
      subtitle:    isEn ? (s.subtitleEn    || s.subtitle)     : s.subtitle,
      details:     isEn ? (s.detailsEn     || s.details)      : s.details,
      images:      s.images ?? [],
      isSizesList: s.isSizesList,
      sizes:       s.sizes ?? [],
    }));
  } else {
    // Fallback to translation data
    const sizeItems = Array.from({ length: 11 }, (_, i) => {
      try { return t(`tenekeEbatlari.sizes.items.${i}`); } catch { return null; }
    }).filter(Boolean) as string[];

    sections = [
      {
        id: "metal-offset-baski",
        title:       t("metalOffsetBaski.title"),
        description: t("metalOffsetBaski.description"),
        subtitle:    t("metal-offset-baski.subtitle"),
        details:     t("metal-offset-baski.details"),
        images:      [],
      },
      {
        id: "teneke-kutu",
        title:       t("tenekeKutu.title"),
        description: t("tenekeKutu.description"),
        subtitle:    t("teneke-kutu.subtitle"),
        details:     t("teneke-kutu.details"),
        images:      [],
      },
      {
        id: "teneke-ebatlari",
        title:       t("tenekeEbatlari.title"),
        description: t("tenekeEbatlari.description"),
        images:      [],
        isSizesList: true,
        sizes:       sizeItems,
      },
    ];
  }

  return (
    <>
      <SiteHeader />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Cog className="h-8 w-8 text-indigo-400" />
              <span className="text-sm font-light uppercase tracking-widest text-indigo-400">
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
                <p className="text-3xl font-bold text-slate-900">
                  {stats.established ?? "1986"}
                </p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.established")}</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-3xl font-bold text-slate-900">
                  {stats.capacity ?? "750K+"}
                </p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.capacity")}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.certified ?? "ISO"}
                </p>
                <p className="mt-1 text-sm text-gray-500">{t("stats.certified")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <CorporateSidebar />

            <div className="min-w-0 flex-1 space-y-20">
              {sections.map((section, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div key={section.id} className="space-y-6">
                    {/* Section heading */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                          {section.title}
                        </h2>
                        <p className="mt-2 text-base leading-relaxed text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {/* Image + detail — alternating */}
                    <div
                      className={`flex flex-col gap-6 md:items-start ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Carousel */}
                      <div className="h-64 w-full shrink-0 md:h-80 md:w-1/2">
                        <ImageCarousel
                          images={section.images}
                          alt={section.title}
                        />
                      </div>

                      {/* Detail */}
                      <div className="w-full md:w-1/2">
                        {section.isSizesList ? (
                          <SizesList
                            title={t("tenekeEbatlari.sizes.title")}
                            items={section.sizes ?? []}
                          />
                        ) : (
                          <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100 h-full">
                            {section.subtitle && (
                              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600">
                                {section.subtitle}
                              </p>
                            )}
                            {section.details && (
                              <p className="text-sm leading-relaxed text-gray-700">
                                {section.details}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {index < sections.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
