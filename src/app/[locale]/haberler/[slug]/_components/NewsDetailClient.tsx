"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ArrowRight,
  Newspaper,
  Star,
  ChevronRight,
} from "lucide-react";

import { apiFetch, mediaUrl } from "@/lib/api";
import type { NewsItem } from "@/lib/api";

function formatDate(raw: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return raw;
  }
}

/** Her zaman HTML olarak render et; plain text ise <p> taglarına çevir.
 *  Ayrıca kapanmamış <img> taglarını otomatik kapatır. */
function toHtml(text: string): string {
  if (!text) return "";

  // Kapanmamış <img ... > taglarını düzelt:
  // <img src="..." (\n veya space)  → <img src="..." alt="" style="..." />
  let fixed = text.replace(
    /<img([^>]*?)(?:\s*\n[^<]*?)?(?<!\/)\s*$/gim,
    (match, attrs) => {
      // Zaten kapanıyorsa dokunma
      if (match.trimEnd().endsWith("/>") || match.trimEnd().endsWith(">")) return match;
      return `<img${attrs} alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />`;
    },
  );

  // Satır ortasında kapanmamış <img ...  (> yok, ardından metin var)
  fixed = fixed.replace(/<img([^>]*?)(?<!\/|")(\s*\n)/g, (_, attrs) => {
    return `<img${attrs} alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />\n`;
  });

  const isHtml = /<[a-z][\s\S]*>/i.test(fixed);
  if (isHtml) return fixed;
  return fixed
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

// ──────────────────────────────────────────────────────────────────────────────

function pick(tr: string | undefined, en: string | undefined | null, locale: string) {
  return (locale === "en" && en ? en : tr) ?? "";
}

export function NewsDetailClient({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const [all, setAll] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiFetch<NewsItem[]>("/api/news")
      .then((data) => {
        const active = Array.isArray(data) ? data.filter((n) => n.active) : [];
        setAll(active);
        if (!active.find((n) => n.slug === slug)) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const item = all.find((n) => n.slug === slug) ?? null;
  const related = useMemo(
    () =>
      all
        .filter((n) => n.slug !== slug && n.category === item?.category)
        .slice(0, 3),
    [all, slug, item],
  );
  const recentPosts = useMemo(
    () => all.filter((n) => n.slug !== slug).slice(0, 5),
    [all, slug],
  );
  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    all.forEach((n) => {
      const c = n.category ?? "Genel";
      map[c] = (map[c] ?? 0) + 1;
    });
    return Object.entries(map);
  }, [all]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-72 animate-pulse bg-gray-200" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/4 rounded bg-gray-200" />
              <div className="h-8 rounded bg-gray-200" />
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="mt-6 space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 rounded bg-gray-100" />
                ))}
              </div>
            </div>
            <div className="hidden w-72 lg:block space-y-4">
              <div className="h-48 rounded-2xl bg-gray-200" />
              <div className="h-48 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray-50">
        <Newspaper className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700">Haber bulunamadı</h1>
        <Link
          href={`/${locale}/haberler`}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Haberlere Dön
        </Link>
      </div>
    );
  }

  const img = mediaUrl(item.image);
  const displayTitle   = pick(item.title,   item.titleEn,   locale);
  const displayExcerpt = pick(item.excerpt, item.excerptEn, locale);
  const displayContent = pick(item.content, item.contentEn, locale);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero — her zaman indigo gradyan, resim banner olarak kullanılmaz ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {item.category && (
            <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              {item.category}
            </span>
          )}
          <h1 className="text-3xl font-bold leading-snug md:text-4xl">
            {displayTitle}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(item.publishedAt)}
            </span>
            {item.featured && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                Öne Çıkan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-indigo-600">Anasayfa</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/${locale}/haberler`} className="hover:text-indigo-600">Haberler</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-gray-700">{item.title}</span>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* ── Article ──────────────────────────────────────── */}
          <article className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-10">
                {/* Kapak görseli — makale içinde, büyük ve tam genişlik */}
                {img && (
                  <div className="mb-8 overflow-hidden rounded-2xl">
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Excerpt */}
                {displayExcerpt && (
                  <p className="mb-6 rounded-xl border-l-4 border-indigo-400 bg-indigo-50 px-5 py-4 text-base italic leading-relaxed text-indigo-900">
                    {displayExcerpt}
                  </p>
                )}

                {/* İçerik — her zaman HTML olarak render edilir */}
                {displayContent && (
                  <div
                    className="product-html prose prose-gray max-w-none
                      prose-headings:font-bold prose-headings:text-gray-900
                      prose-a:text-indigo-600 prose-a:underline
                      prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                      prose-strong:text-gray-900
                      prose-li:text-gray-700
                      text-base leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: toHtml(displayContent) }}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-10">
                {item.category && (
                  <span className="flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <Tag className="h-3.5 w-3.5" />
                    {item.category}
                  </span>
                )}
                <Link
                  href={`/${locale}/haberler`}
                  className="ml-auto flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Tüm Haberler
                </Link>
              </div>
            </div>

            {/* ── Related posts ─────────────────────────────── */}
            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  İlgili Haberler
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => {
                    const rImg = mediaUrl(r.image);
                    return (
                      <Link
                        key={r.id}
                        href={`/${locale}/haberler/${r.slug}`}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-40 overflow-hidden bg-indigo-50">
                          {rImg ? (
                            <img
                              src={rImg}
                              alt={r.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Newspaper className="h-12 w-12 text-indigo-200" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <p className="mb-1 text-xs text-gray-400">{formatDate(r.publishedAt)}</p>
                          <h3 className="line-clamp-2 flex-1 text-sm font-bold leading-snug text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {r.title}
                          </h3>
                          <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600">
                            Devamını Oku <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="space-y-6 lg:w-72 xl:w-80">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  Kategoriler
                </h3>
                <div className="space-y-1">
                  {categories.map(([cat, count]) => (
                    <Link
                      key={cat}
                      href={`/${locale}/haberler`}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <span>{cat}</span>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                        {count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent posts */}
            {recentPosts.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-900">Son Haberler</h3>
                <div className="space-y-4">
                  {recentPosts.map((r) => {
                    const rImg = mediaUrl(r.image);
                    return (
                      <Link
                        key={r.id}
                        href={`/${locale}/haberler/${r.slug}`}
                        className={`group flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0 ${
                          r.slug === slug ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-indigo-50">
                          {rImg ? (
                            <img
                              src={rImg}
                              alt={r.title}
                              className="h-full w-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Newspaper className="h-6 w-6 text-indigo-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 transition group-hover:text-indigo-600">
                            {pick(r.title, r.titleEn, locale)}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">{formatDate(r.publishedAt)}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-5 text-white shadow-lg">
              <h3 className="mb-2 text-base font-bold">Bize Ulaşın</h3>
              <p className="mb-4 text-sm leading-relaxed text-blue-100">
                Ürünlerimiz ve hizmetlerimiz hakkında daha fazla bilgi almak için iletişime geçin.
              </p>
              <Link
                href={`/${locale}/iletisim`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-blue-50"
              >
                İletişime Geç
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
