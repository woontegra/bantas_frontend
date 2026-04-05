"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/navigation";
import {
  TrendingUp, Building2, ChevronRight, FileBarChart2,
  Info, BookOpen,
} from "lucide-react";

type NavChild = { label: string; href: string };
type NavItem =
  | { type: "link";    label: string; href: string; icon?: React.ElementType }
  | { type: "group";   label: string; children: NavChild[] }
  | { type: "heading"; label: string; href: string; icon?: React.ElementType };

const NAV: NavItem[] = [
  {
    type: "link",
    label: "Yatırımcı İlişkileri",
    href: "/yatirimci-iliskileri",
    icon: TrendingUp,
  },
  {
    type: "link",
    label: "Bilgi Toplumu Hizmetleri",
    href: "/bilgi-toplumu-hizmetleri",
    icon: Info,
  },
  {
    type: "group",
    label: "Halka Arz Bilgileri",
    children: [
      { label: "Sermaye Piyasası Aracı Notu",           href: "/halka-arz/sermaye-piyasasi-araci-notu" },
      { label: "İzahname Özeti",                         href: "/halka-arz/izahname-ozeti" },
      { label: "Satış Duyurusu",                         href: "/halka-arz/satis-duyurusu" },
      { label: "Hukukçu Görüşü",                         href: "/halka-arz/hukukcu-gorusu" },
      { label: "Halka Arza İlişkin Yönetim Kurulu Kararı", href: "/halka-arz/yonetim-kurulu-karari" },
      { label: "Fiyat Tespit Raporu",                    href: "/halka-arz/fiyat-tespit-raporu" },
    ],
  },
  {
    type: "group",
    label: "Kurumsal Yönetim",
    children: [
      { label: "Ticaret Sicil Bilgileri",                href: "/kurumsal-yonetim/ticaret-sicil-bilgileri" },
      { label: "Ortaklık Yapısı",                        href: "/kurumsal-yonetim/ortaklik-yapisi" },
      { label: "İmtiyazlı Paylara İlişkin Bilgiler",    href: "/kurumsal-yonetim/imtiyazli-paylar" },
      { label: "Yönetim Kurulu",                         href: "/kurumsal-yonetim/yonetim-kurulu" },
      { label: "Komiteler",                              href: "/kurumsal-yonetim/komiteler" },
      { label: "Kurumsal Yönetim İlkeleri Uyum Raporları", href: "/kurumsal-yonetim/uyum-raporlari" },
      { label: "Genel Kurul Bilgileri",                  href: "/genel-kurul" },
      { label: "Politikalar",                            href: "/kurumsal-yonetim/politikalar" },
      { label: "Esas Sözleşme",                          href: "/kurumsal-yonetim/esas-sozlesme" },
    ],
  },
  {
    type: "link",
    label: "Faaliyet Raporları",
    href: "/faaliyet-raporlari",
    icon: FileBarChart2,
  },
];

export function InvestorSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const clean = pathname.replace(/^\/(tr|en)/, "");
    return clean === href || clean.startsWith(href + "/");
  };

  return (
    <aside className="w-full shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 px-5 py-4">
          <p className="text-white font-semibold text-sm tracking-wide">Yatırımcı İlişkileri</p>
        </div>

        <nav className="p-2">
          {NAV.map((item, idx) => {
            if (item.type === "link") {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 shrink-0 ${active ? "text-indigo-600" : "text-gray-400"}`} />}
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                </Link>
              );
            }

            if (item.type === "group") {
              const hasActiveChild = item.children.some((c) => isActive(c.href));
              return (
                <div key={idx} className="mt-1">
                  {/* Group heading — no link */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${hasActiveChild ? "bg-indigo-50" : ""}`}>
                    <Building2 className={`w-3.5 h-3.5 shrink-0 ${hasActiveChild ? "text-indigo-500" : "text-gray-400"}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wide ${hasActiveChild ? "text-indigo-700" : "text-gray-500"}`}>
                      {item.label}
                    </span>
                  </div>
                  {/* Children */}
                  <div className="ml-3 border-l border-gray-100 pl-3 space-y-0.5 mt-0.5 mb-1">
                    {item.children.map((child, ci) => {
                      const active = isActive(child.href);
                      return (
                        <Link
                          key={ci}
                          href={child.href}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all leading-tight ${
                            active
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full shrink-0 ${active ? "bg-indigo-500" : "bg-gray-300"}`} />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </nav>
      </div>
    </aside>
  );
}
