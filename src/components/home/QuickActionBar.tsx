import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/navigation";
import { FileText, BookOpen, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function resolveUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

interface AnasayfaData {
  quoteTitle?:     string;
  quoteTitleEn?:   string;
  quoteDesc?:      string;
  quoteDescEn?:    string;
  quoteUrl?:       string;
  kvkkText?:       string;
  kvkkTextEn?:     string;
  kvkkPdfUrl?:     string;
  catalogTitle?:   string;
  catalogTitleEn?: string;
  catalogDesc?:    string;
  catalogDescEn?:  string;
  catalogUrl?:     string;
}

async function getAnasayfaData(): Promise<AnasayfaData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/anasayfa-settings`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return {};
    return JSON.parse(page.sections) as AnasayfaData;
  } catch {
    return {};
  }
}

export async function QuickActionBar() {
  const t      = await getTranslations("home.quickActions");
  const locale = await getLocale();
  const isEn   = locale === "en";
  const api    = await getAnasayfaData();

  const quoteTitle   = (isEn ? api.quoteTitleEn   : api.quoteTitle)   || t("quoteTitle");
  const quoteDesc    = (isEn ? api.quoteDescEn    : api.quoteDesc)    || t("quoteDesc");
  const quoteUrl     = api.quoteUrl     || "/iletisim";
  const kvkkText     = (isEn ? api.kvkkTextEn     : api.kvkkText)     || t("kvkk");
  const kvkkPdfUrl   = resolveUrl(api.kvkkPdfUrl);
  const resolvedCatalogUrl = resolveUrl(api.catalogUrl) || "/katalog";
  const catalogTitle = (isEn ? api.catalogTitleEn : api.catalogTitle) || t("catalogTitle");
  const catalogDesc  = (isEn ? api.catalogDescEn  : api.catalogDesc)  || t("catalogDesc");
  const catalogUrl   = resolvedCatalogUrl;

  return (
    <section className="relative bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">

          {/* ── Teklif Al ── */}
          <div className="group flex flex-col justify-center gap-4 py-8 md:py-10 md:pr-10">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-sm tracking-wide">{quoteTitle}</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed pl-[52px]">{quoteDesc}</p>
            <div className="pl-[52px]">
              <Link
                href={quoteUrl as never}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 group/link"
              >
                {t("quoteLink")}
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* ── KVKK ── */}
          <div className="flex flex-col justify-center gap-3 py-8 md:py-10 md:px-10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
              <p className="text-white/60 text-xs leading-relaxed">{kvkkText}</p>
            </div>
            <div className="pl-5">
              {kvkkPdfUrl ? (
                <a
                  href={kvkkPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  {t("kvkkLink")}
                  <ArrowRight className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  href={"/politikalar/kvkk" as never}
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
                >
                  {t("kvkkLink")}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>

          {/* ── Katalog ── */}
          <div className="group flex flex-col justify-center gap-4 py-8 md:py-10 md:pl-10">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-sm tracking-wide">{catalogTitle}</h3>
            </div>
            <p className="text-white/50 text-sm leading-relaxed pl-[52px]">{catalogDesc}</p>
            <div className="pl-[52px]">
              {catalogUrl.startsWith("http") || catalogUrl.includes("/uploads/") ? (
                <a
                  href={catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 group/link"
                >
                  {t("catalogLink")}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </a>
              ) : (
                <Link
                  href={catalogUrl as never}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 group/link"
                >
                  {t("catalogLink")}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
