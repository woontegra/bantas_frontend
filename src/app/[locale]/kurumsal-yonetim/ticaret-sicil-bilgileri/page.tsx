import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Building2, FileText, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticaret Sicil Bilgileri | Bantaş",
  description: "Bantaş A.Ş. resmi ticaret sicil kayıt bilgileri.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RegistryRow { label: string; value: string; }
interface PageData {
  registryData: RegistryRow[];
  infoTitle:    string;
  infoText:     string;
  infoLinkText: string;
  infoLinkUrl:  string;
  ctaTitle:     string;
  ctaText:      string;
}

const STATIC: PageData = {
  registryData: [
    { label: "Şirket Türü",                    value: "A.Ş" },
    { label: "Mersis",                          value: "0140034379000018" },
    { label: "Ticaret Sicil Memurluğu",         value: "BALIKESİR" },
    { label: "Ticaret Sicil Numarası",          value: "7140" },
    { label: "Ticaret Unvanı",                  value: "BANTAS BALIKESİR AMBALAJ SANAYİ VE TİCARET A.Ş" },
    { label: "Adres",                           value: "Ömeri Mah. 32520 Sokak No:1 BALIKESİR / BALIKESİR" },
    { label: "Taahhüt Edilen Sermaye Miktarı",  value: "" },
    { label: "Ödenen Sermaye Miktarı",          value: "120.937.500,00" },
    { label: "Kayıtlı Sermaye Tavanı",          value: "250.000.000,00" },
    { label: "Şirket Tescil Tarihi",            value: "07-04-1988" },
    { label: "Vergi Dairesi",                   value: "BALIKESİR - Bandırma Vergi Dairesi Müdürlüğü" },
    { label: "Vergi Numarası",                  value: "1400243710" },
    {
      label: "Sektör",
      value: "Demir veya çelikten yapılmış, kapaklar ve diğer ürünler için kapasite > 50 litre olan kutuların imalatı (demir veya çelikten olmayan diğer)",
    },
    {
      label: "İletişim Bilgileri",
      value: "Telefon: 02667318787\nFax: -\nİnternet Adresi: www.bantas.com.tr",
    },
  ],
  infoTitle:    "Bilgilendirme",
  infoText:     "Bu sayfada yer alan bilgiler, şirketimizin Ticaret Sicil Gazetesi'nde yayımlanan resmi kayıt bilgilerini içermektedir. Bilgilerin güncelliği için",
  infoLinkText: "Ticaret Sicil Gazetesi",
  infoLinkUrl:  "https://www.ticaretsicil.gov.tr",
  ctaTitle:     "Daha Fazla Bilgi",
  ctaText:      "Şirketimizin kurumsal yapısı ve yönetim bilgileri hakkında detaylı bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

async function getPageData(): Promise<PageData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/ticaret-sicil-bilgileri`, { cache: "no-store" });
    if (!res.ok) return STATIC;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return STATIC;
    const parsed: PageData = JSON.parse(page.sections);
    if (!parsed?.registryData?.length) return STATIC;
    return parsed;
  } catch {
    return STATIC;
  }
}

export default async function TicaretSicilPage({
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
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                Kurumsal Yönetim
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">Ticaret Sicil Bilgileri</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Şirketimizin resmi ticaret sicil kayıt bilgileri
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
              {/* Registry table */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <FileText className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Şirket Kayıt Bilgileri</h2>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="space-y-0">
                    {data.registryData.map((row, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-1 gap-2 py-4 md:grid-cols-3 md:gap-6 ${
                          i !== data.registryData.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <dt className="font-semibold text-gray-600 text-sm md:col-span-1">
                          {row.label}
                        </dt>
                        <dd className="whitespace-pre-line text-sm text-gray-900 md:col-span-2">
                          {row.value || "—"}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-blue-900">{data.infoTitle}</p>
                  <p className="text-sm leading-relaxed text-blue-800">
                    {data.infoText}{" "}
                    {data.infoLinkUrl && (
                      <a
                        href={data.infoLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:text-blue-900"
                      >
                        {data.infoLinkText}
                      </a>
                    )}
                    {" "}resmi web sitesini ziyaret edebilirsiniz.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center text-white">
                <Building2 className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-3 text-2xl font-light md:text-3xl">{data.ctaTitle}</h2>
                <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-blue-100">
                  {data.ctaText}
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
