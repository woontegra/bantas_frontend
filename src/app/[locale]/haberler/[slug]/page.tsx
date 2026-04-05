import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsDetailClient } from "./_components/NewsDetailClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haber Detayı | Bantaş",
};

export default function NewsDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <SiteHeader />
      <NewsDetailClient slug={params.slug} locale={params.locale} />
      <SiteFooter />
    </>
  );
}
