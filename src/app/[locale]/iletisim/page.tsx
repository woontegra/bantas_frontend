import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ContactClient } from "./_components/ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | Bantaş",
  description:
    "Bantaş Metal ile iletişime geçin. Adres, telefon, e-posta ve mesaj formu.",
};

export default function IletisimPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <SiteHeader />
      <ContactClient />
      <SiteFooter />
    </>
  );
}
