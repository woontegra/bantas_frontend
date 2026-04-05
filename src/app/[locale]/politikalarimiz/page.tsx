import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Link } from "@/navigation";
import { POLICY_SLUGS } from "@/lib/policySlugs";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "policies" });
  return { title: t("hubTitle") };
}

export default async function PolitikalarimizPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "policies" });

  return (
    <>
      <SiteHeader />
      <main className="border-t border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
            {t("hubTitle")}
          </h1>
          <p className="mt-3 text-slate-600">{t("hubIntro")}</p>
          <ul className="mt-8 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
            {POLICY_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/politikalarimiz/${slug}`}
                  className="block px-4 py-3.5 text-sm font-medium text-slate-800 transition hover:bg-brand/5 hover:text-brand"
                >
                  {t(`detail.${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
