import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Link } from "@/navigation";
import { isPolicySlug, POLICY_SLUGS } from "@/lib/policySlugs";
import type { Metadata } from "next";

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  if (!isPolicySlug(params.slug)) return {};
  const t = await getTranslations({ locale: params.locale, namespace: "policies" });
  return { title: t(`detail.${params.slug}.title`) };
}

export default async function PolicyDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  if (!isPolicySlug(slug)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "policies" });

  return (
    <>
      <SiteHeader />
      <main className="border-t border-slate-200/80 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <Link
            href="/politikalarimiz"
            className="text-sm font-medium text-brand hover:underline"
          >
            ← {t("backToPolicies")}
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
            {t(`detail.${slug}.title`)}
          </h1>
          <p className="mt-6 text-slate-600 leading-relaxed">{t("placeholder")}</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
