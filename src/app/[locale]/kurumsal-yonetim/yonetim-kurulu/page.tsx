import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Users } from "lucide-react";
import { YonetimKuruluClient, type YonetimKuruluData } from "./_components/YonetimKuruluClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim Kurulu | Bantaş",
  description: "Bantaş A.Ş. yönetim kurulu üyeleri ve görevleri.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const STATIC: YonetimKuruluData = {
  boardMembers: [
    {
      name: "Adnan ERDAN",
      title: "Yönetim Kurulu Başkanı",
      details: `07.03.1952 tarihinde İstanbul'da doğmuştur. Marmara Üniversitesi İktisadi ve İdari Bilimler Fakültesi Kamu Yönetimi Bölümü Mezunu olan Sn.Adnan ERDAN, 11 yaşında başladığı çalışma hayatı içinde Muhasebe mesleği ile iştigal olduktan sonra, 1975 yılında Sn.Fikret ÇETİN ile Tapaş Koll.Şti'ni kurarak 1985 yılına kadar İnşaat taahhüt işleri ile çalışma hayatına devam etmişlerdir. 1986 yılından itibaren Bantaş Bandırma Ambalaj San.ve Tic.A.Ş.'ye ortak olarak Yönetim Kurulu Başkanlığı görevini sürdürmeye devam etmektedir.`,
    },
    {
      name: "Muammer BİRAV",
      title: "Yönetim Kurulu Bşk. Vekili",
      details: `3.05.1966 tarihinde Manyas'da doğmuştur. İstanbul Üniversitesi İktisat Fakültesi İktisat bölümünden mezun olduktan sonra, Yüksek Lisansını Marmara Üniversitesi Güzel Sanatlar Fakültesi Endüstri Ürünleri Tasarımı bölümünde yapan Sn. Muammer BİRAV, 1992 yılından bu yana Bantaş Bandırma Ambalaj San.ve Tic. A.Ş.'de Yönetim Kurulu Üyeliğine devam etmektedir.`,
    },
    {
      name: "Melis ÇETİN",
      title: "Yönetim Kurulu Üyesi",
      details: `24.04.1981 yılında İstanbul'da doğmuştur. Bilgi üniversitesi iletişim fakültesi halkla ilişkiler bölümünden mezun olduktan sonra işletme yüksek lisans eğitimini UC San Diego'da tamamlamıştır. İleri seviyede İngilizce ve Almanca bilen Çetin, Koç Holding, Borusan Holding ve Apple Türkiye'de uzun süre Pazarlama Yöneticiliği yaptıktan sonra 2024 yılı itibari ile Bantaş Yönetim Kurulu'nda yerini almıştır.`,
    },
    {
      name: "Ayça ÖZEKİN",
      title: "Yönetim Kurulu Bağımsız Üyesi",
      details: `Dr. Öğr. Üyesi Ayça ÖZEKİN 1985 yılında Bandırma'da dünyaya gelmiştir. İlk, orta ve lise eğitimini Bandırma'da tamamlayan Özekin, 2008 yılında Gazi Üniversitesi İktisadi ve İdari Bilimler Fakültesi Ekonometri Bölümü'nden mezun olmuştur. Daha sonra, Yükseklisans eğitimine aynı zamanda Araştırma Görevlisi olarak göreve başladığı Balıkesir Üniversitesi'nin, Sosyal Bilimler Enstitüsü İktisat Anabilim Dalı'nda devam etmiştir. Doktora eğitimini, 2017 yılında Marmara Üniversitesi Sosyal Bilimler Enstitüsü Yöneylem Araştırması Anabilim Dalı'nda tamamlamıştır. 2018 yılından itibaren aynı kurumda Doktor Öğretim Üyesi olarak çalışmaktadır. Evli ve bir çocuk sahibidir.`,
    },
    {
      name: "Burak OKBAY",
      title: "Yönetim Kurulu Bağımsız Üyesi",
      details: `03.03.1985 Bandırma'da doğdum. Evyapan ilkokulu, Bandırma Orta Okulu ve ŞMG Süper lisesinden mezun oldum. 2005-2007 yılları arasında Bandırma Meslek Yüksek Okulu Gıda Teknolojisi bölümünü bitirdikten sonra dikey geçiş ile 2008-2011 yılları arasında Çanakkale 18 Mart Üniversitesi Ziraat Fakültesi Bitki koruma bölümünü bitirdim. Aynı dönem Anadolu Üniversitesi Çalışma Ekonomisi bölümünden de mezun oldum. Şuan Bandırma'da açmış olduğum Zirai ilaç gübre bayisini işletmekteyim ve çiftçilik ile uğraşmaktayım. Orta düzeyde ingilizce biliyorum. Evliyim bir çocuğum var.`,
    },
  ],
  stats: [
    { label: "Toplam Üye",    value: "5", sublabel: "Yönetim Kurulu Üyesi"          },
    { label: "Bağımsız Üye",  value: "2", sublabel: "Kurumsal yönetim ilkeleri"     },
    { label: "Başkan",        value: "Adnan ERDAN", sublabel: "Yönetim Kurulu Başkanı" },
  ],
  infoTitle: "Kurumsal Yönetim İlkeleri",
  infoText:  "Yönetim Kurulumuz, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda şirketimizin stratejik hedeflerini belirlemekte ve faaliyetlerini yönlendirmektedir. Bağımsız üyelerimiz, kurumsal yönetim standartlarının uygulanmasını gözetmektedir.",
  ctaTitle: "Kurumsal Yönetim",
  ctaText:  "Yönetim kurulumuz ve komitelerimiz hakkında daha fazla bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

async function getPageData(): Promise<YonetimKuruluData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/yonetim-kurulu`, { cache: "no-store" });
    if (!res.ok) return STATIC;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return STATIC;
    const parsed: YonetimKuruluData = JSON.parse(page.sections);
    if (!parsed?.boardMembers?.length) return STATIC;
    return parsed;
  } catch {
    return STATIC;
  }
}

export default async function YonetimKuruluPage({
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
              <Users className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">
                Kurumsal Yönetim
              </span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">Yönetim Kurulu</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Şirketimizin yönetim kurulu üyeleri ve görevleri
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:w-52">
              <InvestorSidebar />
            </div>
            <YonetimKuruluClient data={data} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
