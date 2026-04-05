import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Calendar } from "lucide-react";
import { GenelKurulClient, type GKMeeting } from "./_components/GenelKurulClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genel Kurul Bilgileri | Bantaş",
  description: "Bantaş A.Ş. genel kurul toplantıları ve belgelerine ulaşın.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Static fallback meetings (matching the old page data)
const STATIC_MEETINGS: GKMeeting[] = [
  {
    date: "21.05.2025", type: "Olağan", title: "21.05.2025 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2025-05-21-bilgilendirme.pdf" },
      { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2025-05-21-davetiye.pdf" },
      { name: "Esas Sözleşme Tadil Metni",           pdfUrl: "/uploads/genel-kurul/2025-05-21-esas-sozlesme.pdf" },
    ],
  },
  {
    date: "03.07.2024", type: "Olağan", title: "03.07.2024 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2024-07-03-bilgilendirme.pdf" },
      { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2024-07-03-davetiye.pdf" },
      { name: "Oya Sunulan Pay Geri Alım Programı", pdfUrl: "/uploads/genel-kurul/2024-07-03-pay-geri-alim.pdf" },
      { name: "Hazirun",                             pdfUrl: "/uploads/genel-kurul/2024-07-03-hazirun.pdf" },
      { name: "Tutanak",                             pdfUrl: "/uploads/genel-kurul/2024-07-03-tutanak.pdf" },
    ],
  },
  {
    date: "27.04.2023", type: "Olağan", title: "27.04.2023 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2023-04-27-bilgilendirme.pdf" },
      { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2023-04-27-davetiye.pdf" },
      { name: "Tutanak",                             pdfUrl: "/uploads/genel-kurul/2023-04-27-tutanak.pdf" },
      { name: "Hazirun",                             pdfUrl: "/uploads/genel-kurul/2023-04-27-hazirun.pdf" },
    ],
  },
  {
    date: "28.04.2022", type: "Olağan", title: "28.04.2022 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2022-04-28-bilgilendirme.pdf" },
      { name: "Gündem-Davetiye-Vekalet",            pdfUrl: "/uploads/genel-kurul/2022-04-28-gundem-davetiye.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2022-04-28-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2022-04-28-hazirun.pdf" },
    ],
  },
  {
    date: "29.04.2021", type: "Olağan", title: "29.04.2021 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2021-04-29-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2021-04-29-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2021-04-29-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2021-04-29-hazirun.pdf" },
    ],
  },
  {
    date: "04.06.2020", type: "Olağan", title: "04.06.2020 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2020-06-04-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2020-06-04-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2020-06-04-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2020-06-04-hazirun.pdf" },
    ],
  },
  {
    date: "03.05.2019", type: "Olağan", title: "03.05.2019 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2019-05-03-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2019-05-03-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2019-05-03-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2019-05-03-hazirun.pdf" },
    ],
  },
  {
    date: "04.04.2018", type: "Olağan", title: "04.04.2018 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2018-04-04-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2018-04-04-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2018-04-04-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2018-04-04-hazirun.pdf" },
    ],
  },
  {
    date: "25.04.2017", type: "Olağan", title: "25.04.2017 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2017-04-25-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2017-04-25-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2017-04-25-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2017-04-25-hazirun.pdf" },
    ],
  },
  {
    date: "14.04.2016", type: "Olağan", title: "14.04.2016 Tarihli Olağan Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2016-04-14-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2016-04-14-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2016-04-14-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2016-04-14-hazirun.pdf" },
    ],
  },
  {
    date: "23.12.2015", type: "Olağanüstü", title: "23.12.2015 Tarihli Olağanüstü Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2015-12-23-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2015-12-23-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2015-12-23-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2015-12-23-hazirun.pdf" },
    ],
  },
  {
    date: "29.07.2015", type: "Olağanüstü", title: "29.07.2015 Tarihli Olağanüstü Genel Kurul",
    documents: [
      { name: "Genel Kurul Daveti ve Vekaletname",  pdfUrl: "/uploads/genel-kurul/2015-07-29-daveti-vekaletname.pdf" },
      { name: "Bilgilendirme Dökümanı",             pdfUrl: "/uploads/genel-kurul/2015-07-29-bilgilendirme.pdf" },
      { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2015-07-29-tutanak.pdf" },
      { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2015-07-29-hazirun.pdf" },
    ],
  },
];

async function fetchMeetings(): Promise<GKMeeting[] | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/genel-kurul`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.sections) return null;
    const sec = JSON.parse(data.sections);
    if (Array.isArray(sec.meetings) && sec.meetings.length > 0) return sec.meetings;
    return null;
  } catch { return null; }
}

export default async function GenelKurulPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const isEn = params.locale === "en";

  const apiMeetings = await fetchMeetings();
  const meetings = apiMeetings ?? STATIC_MEETINGS;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                {isEn ? "Investor Relations" : "Yatırımcı İlişkileri"}
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">
              {isEn ? "General Assembly Information" : "Genel Kurul Bilgileri"}
            </h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              {isEn
                ? "Access all general assembly meeting documents, resolutions and related materials."
                : "Genel kurul toplantı belgelerine, kararlarına ve ilgili dökümanlarına buradan ulaşabilirsiniz."}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            <InvestorSidebar />
            <div className="min-w-0 flex-1">
              <GenelKurulClient meetings={meetings} locale={params.locale} />
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
