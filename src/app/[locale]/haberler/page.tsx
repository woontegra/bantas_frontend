import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsClient } from "./_components/NewsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler | Bantaş",
  description:
    "Bantaş Ambalaj'ın son gelişmeleri, etkinlikleri ve kurumsal duyuruları.",
};

export default function HaberlerPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <SiteHeader />
      <NewsClient locale={params.locale} />
      <SiteFooter />
    </>
  );
}
