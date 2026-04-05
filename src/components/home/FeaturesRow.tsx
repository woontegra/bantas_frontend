import { getTranslations } from "next-intl/server";
import { CalendarDays, HeartHandshake, ShieldCheck, Star, Zap, Award, CheckCircle, TrendingUp, Globe, Factory } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAdvantages } from "@/lib/api";

const ICON_MAP: Record<string, LucideIcon> = {
  HeartHandshake, CalendarDays, ShieldCheck, Star, Zap,
  Award, CheckCircle, TrendingUp, Globe, Factory,
};

export async function FeaturesRow({ locale }: { locale: string }) {
  const t = await getTranslations("home.features");
  const isEn = locale === "en";

  let advantages = await getAdvantages().catch(() => []);

  const items = advantages.length > 0
    ? advantages.slice(0, 3).map((a) => ({
        icon: ICON_MAP[a.icon] ?? ShieldCheck,
        title: isEn ? (a.titleEn ?? a.title) : a.title,
        desc: isEn ? (a.descriptionEn ?? a.description) : a.description,
      }))
    : [
        { icon: HeartHandshake, title: t("reliableTitle"), desc: t("reliableDesc") },
        { icon: CalendarDays, title: t("experienceTitle"), desc: t("experienceDesc") },
        { icon: ShieldCheck, title: t("qualityTitle"), desc: t("qualityDesc") },
      ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {items.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
