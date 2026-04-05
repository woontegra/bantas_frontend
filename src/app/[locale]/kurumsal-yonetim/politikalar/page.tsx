import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { FileText, ExternalLink, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politikalar | Bantaş",
  description: "Bantaş A.Ş. kurumsal yönetim politikaları ve ilkeleri.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Policy {
  title:       string;
  description: string;
  icon:        string;
  color:       string;
  pdfUrl:      string;
}

interface PageData {
  policies:  Policy[];
  infoTitle: string;
  infoText:  string;
  ctaTitle:  string;
  ctaText:   string;
}

const STATIC: PageData = {
  policies: [
    { title: "Bilgilendirme Politikası",  description: "Kamuyu aydınlatma ve bilgilendirme politikamız",                         icon: "📢", color: "from-blue-500 to-cyan-500",    pdfUrl: "/uploads/politikalar/bilgilendirme-politikasi.pdf"  },
    { title: "Ücret Politikası",           description: "Yönetim kurulu ve üst düzey yöneticilerin ücretlendirme politikası",    icon: "💰", color: "from-green-500 to-emerald-500", pdfUrl: "/uploads/politikalar/ucret-politikasi.pdf"           },
    { title: "Bağış ve Yardımlar",         description: "Bağış ve yardım politikamız",                                           icon: "🤝", color: "from-purple-500 to-pink-500",   pdfUrl: "/uploads/politikalar/bagis-yardimlar.pdf"            },
    { title: "Kar Dağıtım Politikası",    description: "Kar dağıtım politikamız ve ilkeleri",                                   icon: "📊", color: "from-orange-500 to-red-500",    pdfUrl: "/uploads/politikalar/kar-dagitim-politikasi.pdf"     },
    { title: "Geri Alım Politikası",       description: "Pay geri alım politikamız",                                             icon: "🔄", color: "from-indigo-500 to-blue-500",   pdfUrl: "/uploads/politikalar/geri-alim-politikasi.pdf"       },
  ],
  infoTitle: "Kurumsal Yönetim Politikaları",
  infoText:  "Şirketimizin kurumsal yönetim politikaları, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda hazırlanmış olup, şeffaflık, hesap verebilirlik, sorumluluk ve adillik ilkelerine dayanmaktadır. Tüm politikalarımız düzenli olarak gözden geçirilmekte ve güncellenmektedir.",
  ctaTitle:  "Kurumsal Yönetim",
  ctaText:   "Politikalarımız ve kurumsal yönetim uygulamalarımız hakkında daha fazla bilgi almak için diğer yatırımcı ilişkileri sayfalarımızı inceleyebilirsiniz.",
};

async function getPageData(): Promise<PageData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/politikalar`, { cache: "no-store" });
    if (!res.ok) return STATIC;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return STATIC;
    const parsed: PageData = JSON.parse(page.sections);
    if (!parsed?.policies?.length) return STATIC;
    return parsed;
  } catch {
    return STATIC;
  }
}

export default async function PolitikalarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await getPageData();

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                Uyum Raporları
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">Politikalar</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Şirketimizin kurumsal yönetim politikaları ve ilkeleri
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:w-52">
              <InvestorSidebar />
            </div>

            <div className="min-w-0 flex-1 space-y-6">
              {/* Policy Cards Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {data.policies.map((policy, i) => (
                  <a
                    key={i}
                    href={policy.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${policy.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                    {/* Hover border */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors group-hover:border-indigo-300" />

                    <div className="relative p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <span className="text-4xl leading-none">{policy.icon}</span>
                        <div className={`rounded-xl bg-gradient-to-br ${policy.color} p-2.5 opacity-10 transition-opacity group-hover:opacity-20`}>
                          <FileText className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                      <h3 className="mb-1.5 text-lg font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                        {policy.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed text-gray-500">{policy.description}</p>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">PDF Dökümanı</span>
                        <div className="flex items-center gap-1.5 text-indigo-600 group-hover:text-indigo-700">
                          <span className="text-sm font-semibold">Görüntüle</span>
                          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-blue-900">{data.infoTitle}</p>
                  <p className="text-sm leading-relaxed text-blue-800">{data.infoText}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center text-white">
                <FileText className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-3 text-2xl font-light md:text-3xl">{data.ctaTitle}</h2>
                <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-blue-100">{data.ctaText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
