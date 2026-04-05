import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CorporateSidebar } from "@/components/layout/CorporateSidebar";
import { Award, CheckCircle, Shield } from "lucide-react";
import { mediaUrl } from "@/lib/api";
import Image from "next/image";
import { unoptimized } from "@/lib/nextImagePolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalite Belgelerimiz | Bantaş",
  description:
    "Bantaş'ın ISO 9001, ISO 14001, ISO 45001, ISO 22000 ve Helal Gıda kalite belgeleri.",
};

interface ApiCertificate {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  standards?: string[];
  image?: string;
  active?: boolean;
}

interface ApiSections {
  intro?: { title?: string; titleEn?: string; text?: string; textEn?: string };
  footer?: { title?: string; titleEn?: string; description?: string; descriptionEn?: string };
  certificates?: ApiCertificate[];
}

interface ContentPageData {
  title?: string; titleEn?: string;
  subtitle?: string; subtitleEn?: string;
  content?: string; contentEn?: string;
  sections?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchPage(): Promise<ContentPageData | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/kalite-belgelerimiz`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function KaliteBelgelerimizPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("certificates");
  const isEn = params.locale === "en";

  const apiData = await fetchPage();
  let sec: ApiSections = {};
  if (apiData?.sections) {
    try { sec = JSON.parse(apiData.sections); } catch { /* ignore */ }
  }

  const heroTitle    = isEn ? (apiData?.titleEn    || apiData?.title    || t("title"))       : (apiData?.title    || t("title"));
  const heroSubtitle = isEn ? (apiData?.subtitleEn || apiData?.subtitle || t("subtitle"))    : (apiData?.subtitle || t("subtitle"));
  const heroDesc     = isEn ? (apiData?.contentEn  || apiData?.content  || t("description")) : (apiData?.content  || t("description"));

  const introTitle = isEn ? (sec.intro?.titleEn || sec.intro?.title || t("intro.title"))  : (sec.intro?.title || t("intro.title"));
  const introText  = isEn ? (sec.intro?.textEn  || sec.intro?.text  || t("intro.text"))   : (sec.intro?.text  || t("intro.text"));

  const footerTitle = isEn ? (sec.footer?.titleEn       || sec.footer?.title       || t("footer.title"))       : (sec.footer?.title       || t("footer.title"));
  const footerDesc  = isEn ? (sec.footer?.descriptionEn || sec.footer?.description || t("footer.description")) : (sec.footer?.description || t("footer.description"));

  // Certificates: API first, fallback to translation defaults
  const hasCerts = Array.isArray(sec.certificates) && sec.certificates.length > 0;
  type Cert = { id: string; title: string; description: string; standards?: string[]; image?: string };
  let certs: Cert[];

  if (hasCerts) {
    certs = sec.certificates!
      .filter((c) => c.active !== false)
      .map((c, i) => ({
        id: String(i),
        title:       isEn ? (c.titleEn       || c.title)       : c.title,
        description: isEn ? (c.descriptionEn || c.description) : c.description,
        standards:   c.standards,
        image:       c.image,
      }));
  } else {
    certs = [
      { id: "iso9001",  title: t("iso9001.title"),  description: t("iso9001.description"),  standards: ["ISO 9001:2015"] },
      { id: "iso14001", title: t("iso14001.title"), description: t("iso14001.description"), standards: ["ISO 14001:2015"] },
      { id: "iso45001", title: t("iso45001.title"), description: t("iso45001.description"), standards: ["ISO 45001:2018"] },
      { id: "iso22000", title: t("iso22000.title"), description: t("iso22000.description"), standards: ["ISO 22000:2018"] },
      { id: "halal",    title: t("halal.title"),    description: t("halal.description") },
    ];
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">{heroSubtitle}</span>
            </div>
            <h1 className="mb-4 text-5xl font-light md:text-6xl">{heroTitle}</h1>
            <p className="max-w-3xl text-xl font-light leading-relaxed text-gray-300">{heroDesc}</p>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <CorporateSidebar />

            <div className="min-w-0 flex-1">
              {/* Intro banner */}
              <div className="mb-12 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-6">
                <div className="flex items-start gap-4">
                  <Shield className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
                  <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">{introTitle}</h2>
                    <p className="text-sm leading-relaxed text-gray-700">{introText}</p>
                  </div>
                </div>
              </div>

              {/* Certificate cards */}
              <div className="space-y-8">
                {certs.map((cert, index) => (
                  <div
                    key={cert.id}
                    className={`flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Image */}
                    <div className="w-full shrink-0 md:w-56">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        {cert.image ? (
                          <Image
                            src={mediaUrl(cert.image)}
                            alt={cert.title}
                            fill
                            className="object-contain p-3"
                            unoptimized={unoptimized(mediaUrl(cert.image))}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Award className="h-16 w-16 text-gray-200" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                        <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">{cert.title}</h3>
                      </div>

                      {cert.standards && cert.standards.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {cert.standards.map((std) => (
                            <span key={std} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                              {std}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm leading-relaxed text-gray-600 md:text-base">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white text-center">
                <Award className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-4 text-2xl font-light md:text-3xl">{footerTitle}</h2>
                <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-blue-100 md:text-lg">{footerDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
