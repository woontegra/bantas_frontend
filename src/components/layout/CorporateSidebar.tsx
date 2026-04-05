"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/navigation";
import {
  Clock,
  Cpu,
  Award,
  ShieldCheck,
  Users,
  Heart,
  Leaf,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/tarihce", labelKey: "Tarihçe", icon: Clock },
  { href: "/teknoloji", labelKey: "Teknoloji", icon: Cpu },
  { href: "/kalite-belgelerimiz", labelKey: "Kalite Belgelerimiz", icon: Award },
  { href: "/politikalarimiz", labelKey: "Politikalarımız", icon: ShieldCheck },
  { href: "/insan-kaynaklari", labelKey: "İnsan Kaynakları", icon: Users },
  { href: "/sosyal-sorumluluk", labelKey: "Sosyal Sorumluluk", icon: Heart },
  {
    href: "/surdurulebilirlik-ilkelerimiz",
    labelKey: "Sürdürülebilirlik",
    icon: Leaf,
  },
];

export function CorporateSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const clean = pathname.replace(/^\/(tr|en)/, "");
    return clean === href || clean.startsWith(href + "/");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4">
          <p className="text-white font-semibold text-sm tracking-wide">Kurumsal</p>
        </div>
        <nav className="p-2">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-emerald-600" : "text-gray-400"
                  }`}
                />
                <span className="flex-1">{labelKey}</span>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
