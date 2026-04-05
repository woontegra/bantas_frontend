import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CorporateSidebar } from "@/components/layout/CorporateSidebar";
import { Users, Briefcase, Heart, UserCheck, ImageIcon } from "lucide-react";
import { mediaUrl } from "@/lib/api";
import Image from "next/image";
import { shouldUnoptimizeRemoteImage as unoptimized } from "@/lib/nextImagePolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İnsan Kaynakları | Bantaş",
  description: "Bantaş insan kaynakları politikası ve işe alım süreçleri.",
};

interface ApiSections {
  policy?: {
    title?: string; titleEn?: string;
    paragraphs?: string[]; paragraphsEn?: string[];
  };
  recruitment?: {
    title?: string; titleEn?: string;
    paragraphs?: string[]; paragraphsEn?: string[];
  };
  imageSection?: {
    title?: string; titleEn?: string;
    description?: string; descriptionEn?: string;
    image?: string;
  };
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
    const res = await fetch(`${API_URL}/api/content-pages/insan-kaynaklari`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function InsanKaynaklariPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("humanResources");
  const isEn = params.locale === "en";

  const apiData = await fetchPage();
  let sec: ApiSections = {};
  if (apiData?.sections) {
    try { sec = JSON.parse(apiData.sections); } catch { /* ignore */ }
  }

  const pick = (tr: string, en?: string | null) => isEn && en ? en : tr;

  const heroTitle    = pick(apiData?.title    || t("title"),       apiData?.titleEn);
  const heroSubtitle = pick(apiData?.subtitle || t("subtitle"),    apiData?.subtitleEn);
  const heroDesc     = pick(apiData?.content  || t("description"), apiData?.contentEn);

  // Policy
  const policyTitle = pick(
    sec.policy?.title || t("policy.title"),
    sec.policy?.titleEn
  );
  const policyParas = isEn && sec.policy?.paragraphsEn?.length
    ? sec.policy.paragraphsEn
    : sec.policy?.paragraphs?.length
    ? sec.policy.paragraphs
    : [t("policy.paragraph1"), t("policy.paragraph2"), t("policy.paragraph3"), t("policy.paragraph4")];

  // Recruitment
  const recruitTitle = pick(
    sec.recruitment?.title || t("recruitment.title"),
    sec.recruitment?.titleEn
  );
  const recruitParas = isEn && sec.recruitment?.paragraphsEn?.length
    ? sec.recruitment.paragraphsEn
    : sec.recruitment?.paragraphs?.length
    ? sec.recruitment.paragraphs
    : [t("recruitment.paragraph1"), t("recruitment.paragraph2"), t("recruitment.paragraph3"), t("recruitment.paragraph4")];

  // Image section
  const imgTitle = pick(
    sec.imageSection?.title || t("imageSection.title"),
    sec.imageSection?.titleEn
  );
  const imgDesc = pick(
    sec.imageSection?.description || t("imageSection.description"),
    sec.imageSection?.descriptionEn
  );
  const imgSrc = sec.imageSection?.image ? mediaUrl(sec.imageSection.image) : null;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-400" />
              <span className="text-sm font-light uppercase tracking-widest text-purple-400">{heroSubtitle}</span>
            </div>
            <h1 className="mb-4 text-5xl font-light md:text-6xl">{heroTitle}</h1>
            <p className="max-w-3xl text-xl font-light leading-relaxed text-gray-300">{heroDesc}</p>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <CorporateSidebar />

            <div className="min-w-0 flex-1 space-y-8">
              {/* Two columns: policy + recruitment */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Policy */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{policyTitle}</h2>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                    {policyParas.filter(Boolean).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                {/* Recruitment */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                      <UserCheck className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{recruitTitle}</h2>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                    {recruitParas.filter(Boolean).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Image section */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative aspect-video bg-gray-100">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={imgTitle}
                      fill
                      className="object-cover"
                      unoptimized={unoptimized(imgSrc)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-16 w-16 text-gray-200" />
                        <p className="mt-2 text-sm text-gray-400">Görsel henüz eklenmedi</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-5 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">{imgTitle}</h3>
                  <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600">{imgDesc}</p>
                </div>
              </div>

              {/* Purple CTA banner */}
              <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-center text-white">
                <Heart className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-3 text-2xl font-light md:text-3xl">
                  {isEn ? "Join Our Team" : "Ekibimize Katılın"}
                </h2>
                <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-purple-100">
                  {isEn
                    ? "We are looking for talented and passionate individuals to join our team. Apply now and be part of our success story."
                    : "Yetenekli ve tutkulu bireyleri ekibimize katılmaya davet ediyoruz. Başvurunuzu yapın, başarı hikayemizin bir parçası olun."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
