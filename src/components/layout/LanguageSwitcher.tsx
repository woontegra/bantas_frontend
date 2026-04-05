"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/navigation";

const locales = ["tr", "en"] as const;

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-white/90">
      {locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          className={
            locale === l
              ? "text-white underline decoration-white/80 underline-offset-4"
              : "text-white/70 transition hover:text-white"
          }
        >
          {l === "tr" ? "TR" : "EN"}
        </Link>
      ))}
    </div>
  );
}
