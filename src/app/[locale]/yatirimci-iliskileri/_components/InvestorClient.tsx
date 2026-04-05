"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  FileBarChart2,
  Users,
  ShieldCheck,
  Mail,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { InvestorSidebar } from "@/components/layout/InvestorSidebar";

// ──────────────────────────────────────────────────────────────────────────────
// Types & defaults (mirror admin page)
// ──────────────────────────────────────────────────────────────────────────────

interface InfoCard {
  title: string;
  desc: string;
  linkLabel: string;
  href: string;
}

interface InvestorSettings {
  heroSubtitle: string;
  iframeUrl: string;
  iframeHeight: number;
  cards: InfoCard[];
  kapTitle: string;
  kapText: string;
  kapHref: string;
}

const CARD_ICONS = [FileBarChart2, Users, ShieldCheck, Mail];
const CARD_COLORS = [
  "bg-indigo-50 text-indigo-600",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
];
const CARD_LINK_COLORS = [
  "text-indigo-600 hover:text-indigo-700",
  "text-blue-600 hover:text-blue-700",
  "text-purple-600 hover:text-purple-700",
  "text-emerald-600 hover:text-emerald-700",
];

const DEFAULT: InvestorSettings = {
  heroSubtitle:
    "Şeffaf ve güvenilir yatırımcı iletişimi için finansal verilerimiz ve raporlarımız",
  iframeUrl:
    "https://web.matriksdata.com/FinanceDataCenter/Yatirimci/Default.aspx?CompanyGUID=ae65bdfc-2451-4327-945d-4e4027972990",
  iframeHeight: 900,
  cards: [
    {
      title: "Finansal Raporlar",
      desc: "Dönemsel finansal tablolarımız, faaliyet raporlarımız ve bağımsız denetim raporlarımıza ulaşabilirsiniz.",
      linkLabel: "Raporları İncele",
      href: "https://www.kap.org.tr",
    },
    {
      title: "Genel Kurul",
      desc: "Genel kurul toplantı bilgileri, gündem maddeleri ve kararlarına buradan ulaşabilirsiniz.",
      linkLabel: "Detayları Gör",
      href: "https://www.kap.org.tr",
    },
    {
      title: "Kurumsal Yönetim",
      desc: "Kurumsal yönetim ilkelerimiz, politikalarımız ve uyum raporlarımız hakkında bilgi edinin.",
      linkLabel: "İncele",
      href: "#",
    },
    {
      title: "Yatırımcı İletişim",
      desc: "Sorularınız ve talepleriniz için yatırımcı ilişkileri departmanımız ile iletişime geçin.",
      linkLabel: "İletişime Geç",
      href: "/iletisim",
    },
  ],
  kapTitle: "Önemli Bilgilendirme",
  kapText:
    "Yatırımcılarımızın bilgilendirilmesi amacıyla tüm finansal raporlarımız, önemli açıklamalarımız ve kurumsal gelişmelerimiz düzenli olarak bu sayfada paylaşılmaktadır. Kamuyu Aydınlatma Platformu (KAP) üzerinden yapılan tüm açıklamalarımıza da buradan ulaşabilirsiniz.",
  kapHref: "https://www.kap.org.tr",
};

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

export function InvestorClient() {
  const [cfg, setCfg] = useState<InvestorSettings>(DEFAULT);

  useEffect(() => {
    apiFetch("/api/investor-relations")
      .then((data) => {
        if (data) setCfg({ ...DEFAULT, ...data });
      })
      .catch(() => {
        // endpoint not implemented yet → keep defaults
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-20 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-300" />
            <span className="text-sm font-light uppercase tracking-widest text-blue-300">
              Investor Relations
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-light md:text-6xl">
            Yatırımcı İlişkileri
          </h1>
          <p className="max-w-3xl text-xl font-light leading-relaxed text-blue-100">
            {cfg.heroSubtitle}
          </p>
        </div>
      </div>

      {/* ── Sidebar + tüm içerik yan yana ── */}
      <div className="mx-auto max-w-screen-2xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Sol: Sidebar — sabit genişlik */}
          <div className="shrink-0 lg:w-52">
            <InvestorSidebar />
          </div>

          {/* Sağ: iframe + kartlar + KAP */}
          <div className="min-w-0 flex-1 space-y-8">

            {/* Matriks iframe */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <TrendingUp className="h-5 w-5 text-white/80" />
                <h2 className="text-base font-semibold text-white">
                  Hisse Senedi Bilgileri — BNTAS
                </h2>
                <a
                  href={cfg.iframeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/20"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Yeni sekme
                </a>
              </div>

              <iframe
                src={cfg.iframeUrl}
                width="100%"
                height={cfg.iframeHeight}
                style={{ border: "none", display: "block" }}
                title="Bantaş BNTAS Yatırımcı İlişkileri"
                loading="lazy"
              />

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                <p className="text-xs leading-relaxed text-gray-500">
                  <strong className="text-gray-700">Yasal Uyarı:</strong> Bu
                  sayfada yer alan veriler{" "}
                  <a
                    href="https://www.matriksdata.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 underline hover:text-indigo-700"
                  >
                    Matriks Data
                  </a>{" "}
                  tarafından sağlanmaktadır. Veriler yatırım tavsiyesi
                  niteliğinde değildir. Yatırım kararlarınızı vermeden önce
                  profesyonel danışmanlık almanızı öneririz.
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {cfg.cards.map((card, i) => {
                const Icon = CARD_ICONS[i % CARD_ICONS.length];
                const iconColor = CARD_COLORS[i % CARD_COLORS.length];
                const linkColor = CARD_LINK_COLORS[i % CARD_LINK_COLORS.length];
                const isExternal = card.href.startsWith("http");
                return (
                  <div
                    key={i}
                    className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-gray-900">{card.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-gray-600">{card.desc}</p>
                    <a
                      href={card.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${linkColor}`}
                    >
                      {card.linkLabel}
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* KAP Banner */}
            <div className="flex items-start gap-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white shadow-lg">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{cfg.kapTitle}</h3>
                <p className="leading-relaxed text-blue-100">{cfg.kapText}</p>
                <a
                  href={cfg.kapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
                >
                  <ExternalLink className="h-4 w-4" />
                  KAP'ta Aç
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
