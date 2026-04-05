import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProductSpecTabs } from "@/components/product/ProductSpecTabs";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { Link } from "@/navigation";
import {
  getProductPageBySlug,
  getProductPagesNav,
  mediaUrl,
} from "@/lib/api";
import {
  PRODUCT_CATEGORY_SLUGS,
  isProductCategorySlug,
} from "@/lib/productCategorySlugs";
import {
  getProductStaticData,
  getProductTheme,
  type SpecTable,
} from "@/lib/productStaticData";
import { Package, Factory } from "lucide-react";
import type { Metadata } from "next";

function parseApiSpecTables(raw: string | null | undefined): SpecTable[] | null {
  if (!raw?.trim().startsWith("[")) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as SpecTable[];
  } catch {
    /* fall through */
  }
  return null;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const page = await getProductPageBySlug(params.slug, params.locale);
  if (page) return { title: page.title };
  if (isProductCategorySlug(params.slug)) {
    const t = await getTranslations({
      locale: params.locale,
      namespace: "productCategories",
    });
    return { title: t(`detail.${params.slug}.title`) };
  }
  return { title: "Ürünler" };
}

export default async function UrunKategoriPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "productCategories" });

  const [page, nav] = await Promise.all([
    getProductPageBySlug(slug, locale),
    getProductPagesNav(),
  ]);

  const sidebarItems =
    nav.length > 0
      ? nav.map((p) => ({
          slug: p.slug,
          title: locale === "en" ? (p.titleEn ?? p.title) : p.title,
        }))
      : PRODUCT_CATEGORY_SLUGS.map((s) => ({
          slug: s,
          title: t(`detail.${s}.title`),
        }));

  const staticData = getProductStaticData(slug);
  const theme = getProductTheme(slug);
  const title =
    page?.title ??
    (isProductCategorySlug(slug) ? t(`detail.${slug}.title`) : null);

  if (!title) notFound();

  const subtitle =
    page?.subtitle ?? `${title} sayfa içeriği buradan yönetilecek.`;
  const mainImage = page?.mainImage ?? undefined;

  // API'den gelen tablolar statik veriyi override eder
  const apiSpecTables = parseApiSpecTables(page?.content);
  const activeTables = apiSpecTables ?? staticData?.specTables ?? [];

  // content JSON ise HTML olarak render etme
  const hasHtmlContent = !!(
    (page?.content && !apiSpecTables) ||
    page?.detailedDescription
  );

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* ── Hero Section ── */}
        <div
          className={`relative overflow-hidden bg-gradient-to-r py-20 text-white ${theme.heroGradient}`}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mb-4 flex items-center gap-3">
              <Package className={`h-8 w-8 ${theme.heroAccent}`} />
              <span
                className={`text-sm font-light uppercase tracking-wider ${theme.heroAccent}`}
              >
                Ürünlerimiz
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-light md:text-6xl">{title}</h1>
            <p className="max-w-3xl text-xl font-light leading-relaxed text-gray-300">
              {subtitle}
            </p>
          </div>
        </div>

        {/* ── Content Section with Sidebar ── */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="shrink-0 lg:w-[260px]">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className={`flex items-center gap-2.5 px-5 py-4 ${theme.sidebarHeader}`}>
                  <Package className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-bold text-white">Ürünler</span>
                </div>
                <ul>
                  {sidebarItems.map((item, idx) => {
                    const isActive = item.slug === slug;
                    return (
                      <li
                        key={item.slug}
                        className={
                          idx < sidebarItems.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }
                      >
                        <Link
                          href={`/urunler/${item.slug}`}
                          className={`block px-5 py-3.5 text-sm transition ${
                            isActive
                              ? `font-semibold ${theme.activeLink}`
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="min-w-0 flex-1">
              {/* ── Görsel + Açıklama yan yana ── */}
              <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Image */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                  <div
                    className={`relative flex aspect-square items-center justify-center bg-gradient-to-br ${theme.imageBg}`}
                  >
                    {mainImage ? (
                      <img
                        src={mediaUrl(mainImage)}
                        alt={title}
                        className="h-full w-full object-contain p-6"
                      />
                    ) : (
                      <Package
                        className={`h-32 w-32 ${theme.imageIcon}`}
                        strokeWidth={1}
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-md">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">
                      {title}
                    </h2>

                    <div className="space-y-4 text-base leading-relaxed text-gray-700">
                      {page?.description ? (
                        <p>{page.description}</p>
                      ) : staticData ? (
                        <>
                          <p>{staticData.description}</p>
                          {staticData.descriptionExtra && (
                            <p>{staticData.descriptionExtra}</p>
                          )}
                        </>
                      ) : (
                        <p className="italic text-gray-400">
                          {t("placeholder")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Features Section ── */}
              {staticData && staticData.features.length > 0 && (
                <div className="mb-16">
                  <h2 className="mb-8 text-center text-3xl font-semibold text-gray-900">
                    Ürün Özellikleri
                  </h2>
                  <ProductFeatures features={staticData.features} />
                </div>
              )}

              {/* ── Product Details / Spec Tables ── */}
              {activeTables.length > 0 && (
                <div className="mb-16">
                  <ProductSpecTabs tables={activeTables} theme={theme} />
                </div>
              )}

              {/* ── API'den gelen HTML içerik ── */}
              {hasHtmlContent && (
                <div className="mb-16 rounded-xl border border-gray-200 bg-white p-8 shadow-md">
                  {page!.content && !apiSpecTables && (
                    <div
                      className="product-html"
                      dangerouslySetInnerHTML={{ __html: page!.content }}
                    />
                  )}
                  {page!.detailedDescription && (
                    <div
                      className="product-html mt-4"
                      dangerouslySetInnerHTML={{
                        __html: page!.detailedDescription,
                      }}
                    />
                  )}
                </div>
              )}

              {/* ── Placeholder ── */}
              {!page?.description && !hasHtmlContent && !staticData && (
                <div className="mb-16 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                  <Factory className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500">{t("placeholder")}</p>
                </div>
              )}

              {/* ── CTA Section ── */}
              <div
                className={`rounded-xl bg-gradient-to-r p-8 text-white ${theme.ctaGradient}`}
              >
                <div className="text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 opacity-90" />
                  <h2 className="mb-4 text-2xl font-light md:text-3xl">
                    {title} Siparişi
                  </h2>
                  <p
                    className={`mx-auto max-w-3xl text-base font-light leading-relaxed md:text-lg ${theme.ctaText}`}
                  >
                    Kaliteli ürünlerimiz hakkında detaylı bilgi almak ve sipariş
                    vermek için bizimle iletişime geçin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
