import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { KurumsalNavDropdown } from "./KurumsalNavDropdown";
import { SiteMobileNav } from "./SiteMobileNav";
import { getProductPagesNav, getSiteSettings } from "@/lib/api";
import { PRODUCT_CATEGORY_SLUGS } from "@/lib/productCategorySlugs";
import { LogoImage } from "./LogoImage";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
function resolveLogoUrl(path?: string | null): string | null {
  if (!path) return null;
  let url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  // HTTPS sayfasında HTTP kaynak yüklenemez (mixed content) → yükselt
  if (typeof window === "undefined" && url.startsWith("http://") && !url.includes("localhost")) {
    url = url.replace("http://", "https://");
  }
  return url;
}

const API_URL_HEADER = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getTopBarData(): Promise<{ email?: string; phone?: string }> {
  try {
    const res = await fetch(`${API_URL_HEADER}/api/content-pages/anasayfa-settings`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return {};
    const d = JSON.parse(page.sections);
    return { email: d.topEmail, phone: d.topPhone };
  } catch {
    return {};
  }
}

const DEFAULT_EPAYMENT_URL =
  "https://bantas.tahsilat.com.tr/payment/?userType=8&tenantId=f1f28d95-4808-444d-9651-16b627e0bace";

export async function SiteHeader() {
  const locale = await getLocale();
  const th = await getTranslations("header");
  const tb = await getTranslations("home.topBar");
  const sub = await getTranslations("header.corporateSub");
  const tProdDetail = await getTranslations("productCategories");

  const [apiProductNav, siteSettings, topBar] = await Promise.all([
    getProductPagesNav(),
    getSiteSettings().catch(() => null),
    getTopBarData(),
  ]);
  const ePaymentUrl = siteSettings?.ePaymentUrl || DEFAULT_EPAYMENT_URL;
  const topEmail = topBar.email || tb("email");
  const topPhone = topBar.phone || tb("phone");
  const productItems =
    apiProductNav.length > 0
      ? apiProductNav.map((p) => ({
          href: `/urunler/${p.slug}` as const,
          label: locale === "en" ? (p.titleEn || p.title) : p.title,
        }))
      : PRODUCT_CATEGORY_SLUGS.map((slug) => ({
          href: `/urunler/${slug}` as const,
          label: tProdDetail(`detail.${slug}.title`),
        }));

  const corporateItems = [
    { href: "/tarihce", label: sub("history") },
    { href: "/teknoloji", label: sub("technology") },
    { href: "/kalite-belgelerimiz", label: sub("qualityCerts") },
    {
      href: "/politikalarimiz",
      label: sub("policies"),
      children: [
        {
          href: "/politikalarimiz/bilgi-guvenligi-politikasi",
          label: sub("policyInfoSecurity"),
        },
        {
          href: "/politikalarimiz/gida-guvenligi-politikasi",
          label: sub("policyFoodSafety"),
        },
        {
          href: "/politikalarimiz/insan-kaynaklari-politikasi",
          label: sub("policyHrPolicy"),
        },
        {
          href: "/politikalarimiz/is-sagligi-guvenligi-politikasi",
          label: sub("policyOhs"),
        },
        {
          href: "/politikalarimiz/kalite-politikasi",
          label: sub("policyQuality"),
        },
        {
          href: "/politikalarimiz/kisisel-veri-saklama-ve-imha-politikasi",
          label: sub("policyDataRetention"),
        },
        {
          href: "/politikalarimiz/kisisel-verilerin-korunmasi-ve-islenmesi-politikasi",
          label: sub("policyKvkkProcessing"),
        },
        {
          href: "/politikalarimiz/web-sitesi-aydinlatma-politikasi",
          label: sub("policyWebDisclosure"),
        },
        {
          href: "/politikalarimiz/kvkk-basvuru-formu",
          label: sub("policyKvkkForm"),
        },
      ],
    },
    { href: "/insan-kaynaklari", label: sub("hr") },
    { href: "/sosyal-sorumluluk", label: sub("csr") },
    { href: "/surdurulebilirlik-ilkelerimiz", label: sub("sustainability") },
  ];

  const navClass =
    "rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-brand";

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs sm:px-4 sm:text-sm">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-white/90 sm:gap-x-4">
            <a
              href={`mailto:${topEmail}`}
              className="min-w-0 max-w-full truncate hover:text-white sm:max-w-none"
            >
              {topEmail}
            </a>
            <span className="hidden text-white/40 sm:inline">|</span>
            <a href={`tel:${topPhone.replace(/\s/g, "")}`} className="shrink-0 hover:text-white">
              {topPhone}
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <Link href="/" className="flex min-w-0 shrink-0 items-center">
            {resolveLogoUrl(siteSettings?.logo) ? (
              <LogoImage
                src={resolveLogoUrl(siteSettings?.logo)!}
                alt={siteSettings?.siteName || "Bantaş"}
              />
            ) : (
              <span className="font-bold tracking-tight">
                <span className="text-lg text-accent-red sm:text-xl">BAN</span>
                <span className="text-lg text-brand sm:text-xl">TAŞ</span>
              </span>
            )}
          </Link>

          <SiteMobileNav
            homeLabel={th("home")}
            corporateLabel={th("corporate")}
            productsLabel={th("products")}
            productsOverviewLabel={tProdDetail("backToProducts")}
            corporateItems={corporateItems}
            productItems={productItems}
            links={[
              { href: "/yatirimci-iliskileri", label: th("investor") },
              { href: "/haberler", label: th("news") },
              { href: "/galeri", label: th("gallery") },
              { href: "/iletisim", label: th("contact") },
            ]}
            ePaymentUrl={ePaymentUrl}
            ePaymentLabel={th("epayment")}
          />

          {/* lg+: masaüstü menü; overflow-visible — flyout kesilmesin */}
          <nav className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-1 gap-y-1 overflow-visible py-1 lg:flex xl:gap-x-2">
            <Link href="/" className={navClass}>
              {th("home")}
            </Link>
            <KurumsalNavDropdown
              triggerLabel={th("corporate")}
              items={corporateItems}
            />
            <KurumsalNavDropdown triggerLabel={th("products")} items={productItems} />
            <Link href="/yatirimci-iliskileri" className={navClass}>
              {th("investor")}
            </Link>
            <Link href="/haberler" className={navClass}>
              {th("news")}
            </Link>
            <Link href="/galeri" className={navClass}>
              {th("gallery")}
            </Link>
            <Link href="/iletisim" className={navClass}>
              {th("contact")}
            </Link>
            <a
              href={ePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={navClass}
            >
              {th("epayment")}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
