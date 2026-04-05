import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Users } from "lucide-react";
import { KomitelerClient, type KomitelerData } from "./_components/KomitelerClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komiteler | Bantaş",
  description: "Bantaş A.Ş. yönetim kurulu komiteleri ve üyeleri.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATIC: KomitelerData = {
  committees: [
    {
      name: "Denetimden Sorumlu Komite",
      members: [
        { name: "Dr. Ayça ÖZEKİN", role: "Denetim Komitesi Başkanı" },
        { name: "Burak OKBAY",      role: "Denetim Komitesi Üyesi" },
      ],
    },
    {
      name: "Kurumsal Yönetim Komitesi",
      members: [
        { name: "Burak OKBAY",      role: "Kurumsal Yönetim Komitesi Başkanı" },
        { name: "Dr. Ayça ÖZEKİN", role: "Kurumsal Yönetim Komitesi Üyesi" },
        { name: "Volkan EROL",      role: "Kurumsal Yönetim Komitesi Üyesi" },
      ],
    },
    {
      name: "Riskin Erken Saptanması Komitesi",
      members: [
        { name: "Dr. Ayça ÖZEKİN",  role: "Riskin Erken Saptanması Komitesi Başkanı" },
        { name: "Burak OKBAY",       role: "Riskin Erken Saptanması Komitesi Üyesi" },
        { name: "Perihan KÜÇÜKOĞLU", role: "Riskin Erken Saptanması Komitesi Üyesi" },
      ],
    },
  ],
  stats: [
    { label: "Toplam Komite",  value: "3", sublabel: "Aktif Komite" },
    { label: "Denetim",        value: "2", sublabel: "Denetim Komitesi Üyesi" },
    { label: "Risk Yönetimi",  value: "3", sublabel: "Risk Komitesi Üyesi" },
  ],
  infoTitle: "Komite Görevleri",
  infoText:
    "Yönetim Kurulu bünyesinde oluşturulan komiteler, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda görev yapmaktadır. Komiteler, ilgili alanlarda detaylı inceleme ve değerlendirme yaparak Yönetim Kurulu'na tavsiyelerde bulunmaktadır.",
  ctaTitle: "Kurumsal Yönetim",
  ctaText:
    "Komitelerimiz ve kurumsal yönetim yapımız hakkında daha fazla bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

async function getPageData(): Promise<KomitelerData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/komiteler`, {
      cache: "no-store",
    });
    if (!res.ok) return STATIC;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return STATIC;
    const parsed: KomitelerData = JSON.parse(page.sections);
    if (!parsed?.committees?.length) return STATIC;
    return parsed;
  } catch {
    return STATIC;
  }
}

export default async function KomitelerPage({
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
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                Kurumsal Yönetim
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">Komiteler</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Yönetim kurulumuz bünyesinde faaliyet gösteren komiteler ve üyeleri
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:w-52">
              <InvestorSidebar />
            </div>
            <KomitelerClient data={data} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
