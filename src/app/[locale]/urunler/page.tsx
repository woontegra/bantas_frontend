import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Link } from "@/navigation";
import { getProductPagesNav } from "@/lib/api";
import { PRODUCT_CATEGORY_SLUGS } from "@/lib/productCategorySlugs";
import { ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "productCategories",
  });
  return { title: t("hubTitle") };
}

const CATEGORY_ICONS = [
  { color: "from-blue-600 to-brand", icon: "🧀" },
  { color: "from-amber-500 to-orange-600", icon: "🛢️" },
  { color: "from-green-600 to-emerald-700", icon: "🫒" },
  { color: "from-slate-600 to-slate-800", icon: "⚙️" },
];

export default async function UrunlerPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const locale = await getLocale();
  const t = await getTranslations({
    locale: params.locale,
    namespace: "productCategories",
  });

  const apiNav = await getProductPagesNav();
  const list =
    apiNav.length > 0
      ? apiNav.map((p) => ({
          slug: p.slug,
          title: locale === "en" ? p.titleEn ?? p.title : p.title,
        }))
      : PRODUCT_CATEGORY_SLUGS.map((slug) => ({
          slug,
          title: t(`detail.${slug}.title`),
        }));

  return (
    <>
      <SiteHeader />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-brand-dark py-14 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 60% at 30% 50%, #c62828 0%, transparent 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
              <Link href="/" className="hover:text-white/80 transition">
                Ana Sayfa
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/80">{t("hubTitle")}</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("hubTitle")}
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/70">
              {t("hubIntro")}
            </p>
          </div>
        </section>

        {/* ── Ürün kartları ── */}
        <section className="border-t border-slate-200/60 bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {list.map(({ slug, title }, i) => {
                const meta = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
                return (
                  <Link
                    key={slug}
                    href={`/urunler/${slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand/30"
                  >
                    {/* Dekoratif üst gradyan şeridi */}
                    <div
                      className={`h-1.5 w-full bg-gradient-to-r ${meta.color}`}
                    />

                    <div className="p-6">
                      {/* İkon */}
                      <div
                        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-3xl shadow-sm ${meta.color}`}
                      >
                        {meta.icon}
                      </div>

                      <h2 className="text-base font-bold text-slate-900 transition group-hover:text-brand">
                        {title}
                      </h2>
                      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                        Bantaş kalitesiyle üretilen {title.toLowerCase()} ürün grubumuzu inceleyin.
                      </p>

                      <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand transition group-hover:gap-2.5">
                        İncele
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── İletişim CTA ── */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Package className="mx-auto mb-4 h-10 w-10 text-brand/40" />
            <h2 className="text-2xl font-bold text-brand-dark">
              Özel çözüm mü arıyorsunuz?
            </h2>
            <p className="mt-3 text-slate-600">
              Üretim kapasitemiz ve kalite standartlarımız hakkında detaylı bilgi almak için ekibimizle iletişime geçin.
            </p>
            <Link
              href="/iletisim"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-muted"
            >
              İletişime Geç
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
