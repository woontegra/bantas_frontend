import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GalleryClient } from "./_components/GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri | Bantaş",
  description:
    "Fabrikamız, üretim süreçlerimiz ve etkinliklerimizden görüntüler.",
};

export default function GaleriPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return (
    <>
      <SiteHeader />
      <GalleryClient />
      <SiteFooter />
    </>
  );
}
