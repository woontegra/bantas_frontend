import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";
import { Award, FileText, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İmtiyazlı Paylara İlişkin Bilgiler | Bantaş",
  description: "Bantaş A.Ş. imtiyazlı pay yapısı ve yönetim kurulu üyeliklerine ilişkin bilgiler.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Shareholder { name: string; amount: string; }
interface PageSections {
  block1?: { title?: string; text?: string };
  block2?: { text?: string };
  block3?: { text?: string };
  shareholders?: Shareholder[];
  totalAmount?: string;
  summaryTitle?: string;
  summaryBullets?: string[];
  infoTitle?: string;
  infoText?: string;
  ctaTitle?: string;
  ctaText?: string;
}
interface ContentPageData { title?: string; sections?: string; }

const STATIC: Required<PageSections> = {
  block1: {
    title: "A Grubu Paylar",
    text: "A Grubu payların, Esas Sözleşme'nin 8. maddesindeki esaslar çerçevesinde yönetim kurulu üyelerinin yarısını seçiminde aday gösterme imtiyazı vardır. Yönetim Kurulu üye sayısının tek olması durumunda küsurat, aşağıya doğru en yakın tam sayıya yuvarlanır.",
  },
  block2: {
    text: "Olağan ve Olağanüstü Genel Kurul toplantılarında hazır bulunan pay sahiplerinin veya yetkilillerinin her bir A veya B grubu pay için bir oyu vardır.",
  },
  block3: {
    text: "Nama yazılı A Grubu imtiyazlı paylara ilişkin bilgiler aşağıda sunulmuştur.",
  },
  shareholders: [
    { name: "Adnan ERDAN",   amount: "1.874.812,50" },
    { name: "Fikret ÇETİN",  amount: "1.874.812,50" },
    { name: "Muammer BİRAV", amount: "1.312.875,00" },
    { name: "Mutlu HASEKİ", amount: "562.500,00" },
  ],
  totalAmount: "5.625.000,00",
  summaryTitle: "İmtiyaz Özeti",
  summaryBullets: [
    "A Grubu paylar, yönetim kurulu üyelerinin yarısını aday gösterme imtiyazına sahiptir",
    "Her A ve B grubu pay için bir oy hakkı bulunmaktadır",
  ],
  infoTitle: "Yasal Bilgilendirme",
  infoText: "İmtiyazlı paylara ilişkin detaylı bilgiler şirketimizin Esas Sözleşmesi'nin 8. maddesinde düzenlenmiştir. Esas Sözleşme metnine Yatırımcı İlişkileri bölümünden ulaşabilirsiniz.",
  ctaTitle: "Daha Fazla Bilgi",
  ctaText: "İmtiyazlı paylar ve yönetim kurulu yapısı hakkında detaylı bilgi almak için Esas Sözleşme ve Yönetim Kurulu sayfalarımızı inceleyebilirsiniz.",
};

async function fetchPage(): Promise<PageSections | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/imtiyazli-paylar`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data: ContentPageData = await res.json();
    if (!data?.sections) return null;
    return JSON.parse(data.sections);
  } catch { return null; }
}

export default async function ImtiyazliPaylarPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  const api = await fetchPage();
  const d: Required<PageSections> = {
    block1:        { ...STATIC.block1,        ...(api?.block1        ?? {}) },
    block2:        { ...STATIC.block2,        ...(api?.block2        ?? {}) },
    block3:        { ...STATIC.block3,        ...(api?.block3        ?? {}) },
    shareholders:  api?.shareholders?.length  ? api.shareholders  : STATIC.shareholders,
    totalAmount:   api?.totalAmount           ?? STATIC.totalAmount,
    summaryTitle:  api?.summaryTitle          ?? STATIC.summaryTitle,
    summaryBullets:api?.summaryBullets?.length? api.summaryBullets : STATIC.summaryBullets,
    infoTitle:     api?.infoTitle             ?? STATIC.infoTitle,
    infoText:      api?.infoText              ?? STATIC.infoText,
    ctaTitle:      api?.ctaTitle              ?? STATIC.ctaTitle,
    ctaText:       api?.ctaText               ?? STATIC.ctaText,
  };

  const totalBullets = [
    ...d.summaryBullets,
    `Toplam imtiyazlı pay tutarı: ${d.totalAmount} TL`,
    `İmtiyazlı pay sahibi sayısı: ${d.shareholders.length} ortak`,
  ];

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-blue-400" />
              <span className="text-sm font-light uppercase tracking-widest text-blue-400">Kurumsal Yönetim</span>
            </div>
            <h1 className="mb-3 text-4xl font-light md:text-5xl">İmtiyazlı Paylara İlişkin Bilgiler</h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Şirketimizin imtiyazlı pay yapısı ve yönetim kurulu üyeliklerine ilişkin bilgiler
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="shrink-0 lg:w-52"><InvestorSidebar /></div>

            <div className="min-w-0 flex-1 space-y-6">
              {/* Main card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <FileText className="h-5 w-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">İmtiyazlı Pay Bilgileri</h2>
                </div>
                <div className="space-y-4 p-6 sm:p-8">
                  {/* Info blocks */}
                  <div className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50 p-5">
                    <h3 className="mb-2 font-semibold text-indigo-900">{d.block1.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{d.block1.text}</p>
                  </div>
                  <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">
                    <p className="text-sm leading-relaxed text-gray-700">{d.block2.text}</p>
                  </div>
                  <div className="rounded-xl border-l-4 border-purple-500 bg-purple-50 p-5">
                    <p className="text-sm leading-relaxed text-gray-700">{d.block3.text}</p>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                          <th className="px-5 py-3 text-left font-semibold">Ortağın Ticaret Unvanı / Adı Soyadı</th>
                          <th className="px-5 py-3 text-right font-semibold">Toplam (TL)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {d.shareholders.map((s, i) => (
                          <tr key={i} className="hover:bg-indigo-50 transition-colors">
                            <td className="px-5 py-3.5 text-gray-900">{s.name}</td>
                            <td className="px-5 py-3.5 text-right font-mono text-gray-900">{s.amount}</td>
                          </tr>
                        ))}
                        <tr className="bg-indigo-50 font-semibold">
                          <td className="px-5 py-3.5 text-indigo-900">Toplam</td>
                          <td className="px-5 py-3.5 text-right font-mono text-indigo-900">{d.totalAmount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
                <div className="flex items-start gap-4">
                  <Award className="h-7 w-7 shrink-0 text-indigo-600 mt-0.5" />
                  <div>
                    <h3 className="mb-3 font-semibold text-indigo-900">{d.summaryTitle}</h3>
                    <ul className="space-y-2">
                      {totalBullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-1 text-indigo-500">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 font-semibold text-blue-900 text-sm">{d.infoTitle}</p>
                  <p className="text-sm leading-relaxed text-blue-800">{d.infoText}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center text-white">
                <Award className="mx-auto mb-4 h-12 w-12 opacity-80" />
                <h2 className="mb-3 text-2xl font-light md:text-3xl">{d.ctaTitle}</h2>
                <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-blue-100">{d.ctaText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
