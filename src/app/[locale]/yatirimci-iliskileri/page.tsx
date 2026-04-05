import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { InvestorClient } from "./_components/InvestorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yatırımcı İlişkileri | Bantaş",
  description:
    "Bantaş Metal A.Ş. yatırımcı ilişkileri sayfası. BNTAS hisse senedi bilgileri, finansal raporlar ve KAP açıklamaları.",
};

export default function YatirimciIliskileriPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <SiteHeader />
      <InvestorClient />
      <SiteFooter />
    </>
  );
}
