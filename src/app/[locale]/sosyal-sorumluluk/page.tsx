import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CorporateSidebar } from "@/components/layout/CorporateSidebar";
import { Heart, TreePine, Users, Lightbulb, ImageIcon } from "lucide-react";
import { mediaUrl } from "@/lib/api";
import Image from "next/image";
import { unoptimized } from "@/lib/nextImagePolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sosyal Sorumluluk | Bantaş",
  description: "Bantaş sosyal sorumluluk projeleri, çevre duyarlılığı ve toplum katkıları.",
};

interface ApiProject {
  title: string;
  titleEn?: string;
  paragraphs: string[];
  paragraphsEn?: string[];
  icon?: string;
  colorClass?: string;
}

interface ApiSections {
  intro?: {
    title?: string; titleEn?: string;
    paragraphs?: string[]; paragraphsEn?: string[];
    image?: string;
  };
  projectsTitle?: string;
  projectsTitleEn?: string;
  projects?: ApiProject[];
  footer?: { title?: string; titleEn?: string; description?: string; descriptionEn?: string };
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
    const res = await fetch(`${API_URL}/api/content-pages/sosyal-sorumluluk`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

const PROJECT_STYLES = [
  { icon: TreePine, bg: "bg-gradient-to-br from-green-50 to-emerald-50", border: "border-green-200", iconColor: "text-green-600", badge: "bg-green-100 text-green-700" },
  { icon: Users,    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",   border: "border-blue-200",  iconColor: "text-blue-600",  badge: "bg-blue-100 text-blue-700" },
  { icon: Lightbulb,bg: "bg-gradient-to-br from-purple-50 to-pink-50",   border: "border-purple-200",iconColor: "text-purple-600",badge: "bg-purple-100 text-purple-700" },
];

export default async function SosyalSorumlulukPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("socialResponsibility");
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

  const introTitle = pick(sec.intro?.title || t("intro.title"), sec.intro?.titleEn);
  const introParas = isEn && sec.intro?.paragraphsEn?.length
    ? sec.intro.paragraphsEn
    : sec.intro?.paragraphs?.length
    ? sec.intro.paragraphs
    : [t("intro.paragraph1"), t("intro.paragraph2"), t("intro.paragraph3")];

  const introImage = sec.intro?.image ? mediaUrl(sec.intro.image) : null;

  const projectsHeading = pick(
    sec.projectsTitle || t("projects.title"),
    sec.projectsTitleEn
  );

  const hasApiProjects = Array.isArray(sec.projects) && sec.projects.length > 0;
  const defaultProjects = [
    { title: t("projects.environment.title"), paragraphs: [t("projects.environment.paragraph1"), t("projects.environment.paragraph2")] },
    { title: t("projects.community.title"),   paragraphs: [t("projects.community.paragraph1"),   t("projects.community.paragraph2")]   },
    { title: t("projects.education.title"),   paragraphs: [t("projects.education.paragraph1"),   t("projects.education.paragraph2")]   },
  ];

  const projects = hasApiProjects
    ? sec.projects!.map((p) => ({
        title:     pick(p.title, p.titleEn),
        paragraphs: isEn && p.paragraphsEn?.length ? p.paragraphsEn : p.paragraphs,
      }))
    : defaultProjects;

  const footerTitle = pick(sec.footer?.title || t("footer.title"), sec.footer?.titleEn);
  const footerDesc  = pick(sec.footer?.description || t("footer.description"), sec.footer?.descriptionEn);

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Heart className="h-8 w-8 text-green-400" />
              <span className="text-sm font-light uppercase tracking-widest text-green-400">{heroSubtitle}</span>
            </div>
            <h1 className="mb-4 text-5xl font-light md:text-6xl">{heroTitle}</h1>
            <p className="max-w-3xl text-xl font-light leading-relaxed text-gray-300">{heroDesc}</p>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <CorporateSidebar />

            <div className="min-w-0 flex-1 space-y-10">
              {/* Intro: text + image side by side */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">{introTitle}</h2>
                  <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                    {introParas.filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>

                <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  {introImage ? (
                    <div className="relative w-full aspect-square max-w-sm">
                      <Image
                        src={introImage}
                        alt={introTitle}
                        fill
                        className="object-contain"
                        unoptimized={unoptimized(introImage)}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-300">
                      <ImageIcon className="h-16 w-16" />
                      <p className="text-sm">Görsel henüz eklenmedi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900">{projectsHeading}</h2>
                <div className="space-y-5">
                  {projects.map((proj, idx) => {
                    const style = PROJECT_STYLES[idx % PROJECT_STYLES.length];
                    const Icon  = style.icon;
                    return (
                      <div key={idx} className={`rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${style.bg} ${style.border}`}>
                        <div className="mb-4 flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm`}>
                            <Icon className={`h-5 w-5 ${style.iconColor}`} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{proj.title}</h3>
                        </div>
                        <div className="space-y-2 text-sm leading-relaxed text-gray-700">
                          {proj.paragraphs.filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-center text-white">
                <Heart className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-3 text-2xl font-light md:text-3xl">{footerTitle}</h2>
                <p className="mx-auto max-w-3xl text-base font-light leading-relaxed text-green-100">{footerDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
