import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Users } from "lucide-react";
import { OrtaklikClient, type OrtaklikData } from "./_components/OrtaklikClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ortaklık Yapısı | Bantaş",
  description: "Bantaş A.Ş. sermaye yapısı ve ortaklık dağılımı.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATIC: OrtaklikData = {
  shareholders: [
    { name: "Fikret ÇETİN",      shares: "31.749.628,75",  currency: "TRY", percentage: "13,13" },
    { name: "Adnan ERDAN",        shares: "31.078.916,87",  currency: "TRY", percentage: "12,85" },
    { name: "Muammer BİRAV",      shares: "17.585.110",     currency: "TRY", percentage: "7,27"  },
    { name: "Mutlu HASEN",        shares: "16.087.500",     currency: "TRY", percentage: "6,65"  },
    { name: "Melis ÇETİN",        shares: "2.000.000",      currency: "TRY", percentage: "0,83"  },
    { name: "Fatih ERDAN",        shares: "1.462.500",      currency: "TRY", percentage: "0,60"  },
    { name: "Mahmut ERDAN",       shares: "1.462.500",      currency: "TRY", percentage: "0,60"  },
    { name: "Emine Sevgi BİRAV",  shares: "162.500",        currency: "TRY", percentage: "0,07"  },
    { name: "Halka Açık Kısım",   shares: "140.286.344,38", currency: "TRY", percentage: "58,00" },
  ],
  stats: [
    { label: "Toplam Ortak",   value: "8",      sublabel: "+ Halka Açık Kısım"      },
    { label: "Halka Açıklık",  value: "58,00%", sublabel: "Borsada işlem gören pay" },
    { label: "En Büyük Ortak", value: "13,13%", sublabel: "Fikret ÇETİN"            },
  ],
  infoTitle: "Bilgilendirme",
  infoText:
    "Bu sayfada yer alan ortaklık yapısı bilgileri, şirketimizin güncel sermaye dağılımını göstermektedir. Ortaklık yapısındaki değişiklikler Kamuyu Aydınlatma Platformu (KAP) üzerinden düzenli olarak açıklanmaktadır.",
  ctaTitle: "Yatırımcı İlişkileri",
  ctaText:
    "Ortaklık yapısı ve sermaye değişiklikleri hakkında detaylı bilgi almak için yatırımcı ilişkileri departmanımız ile iletişime geçebilirsiniz.",
};

async function getPageData(): Promise<OrtaklikData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/ortaklik-yapisi`, {
      cache: "no-store",
    });
    if (!res.ok) return STATIC;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return STATIC;
    const parsed: OrtaklikData = JSON.parse(page.sections);
    if (!parsed?.shareholders?.length) return STATIC;
    return parsed;
  } catch {
    return STATIC;
  }
}

export default async function OrtaklikYapisiPage({
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
            <h1 className="mb-3 text-4xl font-light md:text-5xl">Ortaklık Yapısı</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Şirketimizin sermaye yapısı ve ortaklık dağılımı
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:w-52">
              <InvestorSidebar />
            </div>
            <OrtaklikClient data={data} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
