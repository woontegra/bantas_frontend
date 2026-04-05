import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { FileBarChart2, FileText, Download, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faaliyet Raporları | Bantaş",
  description: "Bantaş A.Ş. yıllık ve dönemsel faaliyet raporları.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface FRReport { title: string; pdfUrl: string; }
export interface FRYear {
  year: string;
  reports: FRReport[];
}

const YEAR_COLORS: Record<string, string> = {
  "2025": "from-blue-600 to-indigo-600",
  "2024": "from-indigo-600 to-purple-600",
  "2023": "from-purple-600 to-pink-600",
  "2022": "from-pink-600 to-rose-600",
  "2021": "from-rose-600 to-red-600",
};
const DEFAULT_COLOR = "from-gray-600 to-gray-700";

const STATIC_YEARS: FRYear[] = [
  { year: "2025", reports: [
    { title: "2025 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2025-yil.pdf" },
    { title: "2025 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-9-aylik.pdf" },
    { title: "2025 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-6-aylik.pdf" },
    { title: "2025 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-3-aylik.pdf" },
  ]},
  { year: "2024", reports: [
    { title: "2024 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2024-yil.pdf" },
    { title: "2024 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-9-aylik.pdf" },
    { title: "2024 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-6-aylik.pdf" },
    { title: "2024 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-3-aylik.pdf" },
  ]},
  { year: "2023", reports: [
    { title: "2023 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2023-yil.pdf" },
    { title: "2023 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-9-aylik.pdf" },
    { title: "2023 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-6-aylik.pdf" },
    { title: "2023 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-3-aylik.pdf" },
  ]},
  { year: "2022", reports: [
    { title: "2022 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2022-yil.pdf" },
    { title: "2022 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-9-aylik.pdf" },
    { title: "2022 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-6-aylik.pdf" },
    { title: "2022 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-3-aylik.pdf" },
  ]},
  { year: "2021", reports: [
    { title: "2021 - 12 Aylık Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2021-12-aylik.pdf" },
    { title: "2021 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-9-aylik.pdf" },
    { title: "2021 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-6-aylik.pdf" },
    { title: "2021 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-3-aylik.pdf" },
  ]},
  { year: "2020", reports: [
    { title: "2020 - 12 Aylık Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2020-12-aylik.pdf" },
    { title: "2020 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-9-aylik.pdf" },
    { title: "2020 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-6-aylik.pdf" },
    { title: "2020 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-3-aylik.pdf" },
  ]},
  { year: "2019", reports: [{ title: "2019 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2019-yil.pdf" }] },
  { year: "2018", reports: [{ title: "2018 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2018-yil.pdf" }] },
  { year: "2017", reports: [{ title: "2017 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2017-yil.pdf" }] },
  { year: "2016", reports: [{ title: "2016 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2016-yil.pdf" }] },
  { year: "2015", reports: [{ title: "2015 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2015-yil.pdf" }] },
];

async function fetchYears(): Promise<FRYear[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/faaliyet-raporlari`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.sections) return null;
    const sec = JSON.parse(data.sections);
    if (Array.isArray(sec.years) && sec.years.length > 0) return sec.years;
    return null;
  } catch { return null; }
}

function pdfHref(url: string) {
  if (!url) return "#";
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default async function FaaliyetRaporlariPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const isEn = params.locale === "en";

  const apiYears = await fetchYears();
  const years = apiYears ?? STATIC_YEARS;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <FileBarChart2 className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                {isEn ? "Investor Relations" : "Yatırımcı İlişkileri"}
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">
              {isEn ? "Activity Reports" : "Faaliyet Raporları"}
            </h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              {isEn
                ? "Access our annual and periodic activity reports."
                : "Yıllık ve dönemsel faaliyet raporlarımıza buradan ulaşabilirsiniz."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Sidebar */}
            <div className="shrink-0 lg:w-52">
              <InvestorSidebar />
            </div>

            {/* Main */}
            <div className="min-w-0 flex-1 space-y-6">
              {years.map((yd, yi) => {
                const color = YEAR_COLORS[yd.year] ?? DEFAULT_COLOR;
                const isRecent = parseInt(yd.year) >= 2021;
                return (
                  <div key={yi} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Year header */}
                    <div className={`flex items-center gap-3 bg-gradient-to-r ${color} px-6 py-4`}>
                      <FileBarChart2 className="h-5 w-5 text-white/80" />
                      <h2 className="text-xl font-bold text-white">{yd.year}</h2>
                      <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                        {yd.reports.length} rapor
                      </span>
                    </div>

                    {/* Reports grid */}
                    <div className="p-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {yd.reports.map((rep, ri) => (
                          rep.pdfUrl && rep.pdfUrl !== "#" ? (
                            <a
                              key={ri}
                              href={pdfHref(rep.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                                isRecent
                                  ? "border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5"
                                  : "border-gray-200 bg-gray-50 hover:border-gray-400 hover:shadow-sm"
                              }`}
                            >
                              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isRecent ? "bg-gradient-to-br from-indigo-500 to-blue-500" : "bg-gray-500"}`}>
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`truncate text-sm font-semibold ${isRecent ? "text-gray-900 group-hover:text-indigo-700" : "text-gray-700"}`}>
                                  {rep.title}
                                </p>
                                <p className="text-xs text-gray-400">{isEn ? "PDF Document" : "PDF Belgesi"}</p>
                              </div>
                              <Download className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-y-0.5 ${isRecent ? "text-indigo-500" : "text-gray-500"}`} />
                            </a>
                          ) : (
                            <div key={ri} className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-white p-4 opacity-50">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                                <FileText className="h-5 w-5 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-gray-500">{rep.title}</p>
                                <p className="text-xs text-gray-400">{isEn ? "PDF not uploaded yet" : "Henüz yüklenmedi"}</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Info box */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 font-semibold text-blue-900 text-sm">
                    {isEn ? "Information" : "Bilgilendirme"}
                  </p>
                  <p className="text-sm leading-relaxed text-blue-800">
                    {isEn
                      ? "All activity reports are available in PDF format. Please contact our investor relations department for any questions."
                      : "Tüm faaliyet raporlarına PDF formatında ulaşabilirsiniz. Raporlarla ilgili sorularınız için yatırımcı ilişkileri departmanımızla iletişime geçebilirsiniz."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
