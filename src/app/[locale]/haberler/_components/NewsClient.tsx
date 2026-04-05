"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Tag,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { apiFetch, mediaUrl } from "@/lib/api";
import type { NewsItem } from "@/lib/api";

const PAGE_SIZE = 9;

function formatDate(raw: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(raw));
  } catch {
    return raw;
  }
}

function t<T extends string | undefined>(tr: T, en: T, locale: string): T {
  return (locale === "en" && en ? en : tr) as T;
}

// ──────────────────────────────────────────────────────────────────────────────

export function NewsClient({ locale }: { locale: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    apiFetch<NewsItem[]>("/api/news")
      .then((data) => setNews(Array.isArray(data) ? data.filter((n) => n.active) : []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  /* derived data ──────────────────────────────────────── */
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    news.forEach((n) => {
      const c = n.category ?? "Genel";
      counts[c] = (counts[c] ?? 0) + 1;
    });
    return [
      { name: "Tümü", count: news.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];
  }, [news]);

  const filtered = useMemo(() => {
    let list = news;
    if (selectedCategory !== "Tümü")
      list = list.filter((n) => (n.category ?? "Genel") === selectedCategory);
    if (search.trim())
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          (n.excerpt ?? "").toLowerCase().includes(search.toLowerCase()),
      );
    return list;
  }, [news, selectedCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const recentPosts = news.slice(0, 4);

  function changeCategory(cat: string) {
    setSelectedCategory(cat);
    setPage(1);
  }

  function changeSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ── Hero ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-20 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-blue-300" />
            <span className="text-sm font-light uppercase tracking-widest text-blue-300">
              Blog & Haberler
            </span>
          </div>
          <h1 className="mb-4 text-5xl font-light md:text-6xl">
            {locale === "en" ? "News" : "Haberler"}
          </h1>
          <p className="max-w-3xl text-xl font-light leading-relaxed text-blue-100">
            {locale === "en"
              ? "Latest news, events and announcements from our company"
              : "Şirketimizin son gelişmeleri, etkinlikleri ve duyuruları"}
          </p>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* ── News grid ──────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="h-48 rounded-t-2xl bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 w-1/3 rounded bg-gray-200" />
                      <div className="h-4 rounded bg-gray-200" />
                      <div className="h-4 w-3/4 rounded bg-gray-200" />
                      <div className="h-3 rounded bg-gray-100" />
                      <div className="h-3 w-2/3 rounded bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
                <Newspaper className="mb-4 h-14 w-14 text-gray-300" />
                <h3 className="mb-1 text-lg font-semibold text-gray-700">
                  Haber bulunamadı
                </h3>
                <p className="text-sm text-gray-500">
                  Farklı bir kategori veya arama terimi deneyin.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((item) => {
                  const img = mediaUrl(item.image);
                  const cardTitle   = t(item.title, item.titleEn, locale);
                  const cardExcerpt = t(item.excerpt, item.excerptEn, locale);
                  return (
                    <Link
                      key={item.id}
                      href={`/${locale}/haberler/${item.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100">
                        {img ? (
                          <img
                            src={img}
                            alt={cardTitle}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Newspaper className="h-16 w-16 text-indigo-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {item.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
                            {item.category}
                          </span>
                        )}
                        {item.featured && (
                          <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
                            {locale === "en" ? "Featured" : "Öne Çıkan"}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(item.publishedAt, locale)}</span>
                        </div>

                        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-600">
                          {cardTitle}
                        </h3>

                        {cardExcerpt && (
                          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
                            {cardExcerpt}
                          </p>
                        )}

                        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all group-hover:gap-3">
                          <span>{locale === "en" ? "Read More" : "Devamını Oku"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition ${
                      p === page
                        ? "bg-indigo-600 text-white shadow"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────── */}
          <aside className="space-y-6 lg:w-72 xl:w-80">
            {/* Search */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                <Search className="h-4 w-4 text-indigo-500" />
                {locale === "en" ? "Search News" : "Haber Ara"}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={locale === "en" ? "Title or content..." : "Başlık veya içerik..."}
                  value={search}
                  onChange={(e) => changeSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  {locale === "en" ? "Categories" : "Kategoriler"}
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => changeCategory(cat.name)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                        selectedCategory === cat.name
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          selectedCategory === cat.name
                            ? "bg-white/20 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-900">
                  {locale === "en" ? "Recent News" : "Son Haberler"}
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((item) => {
                    const img = mediaUrl(item.image);
                    return (
                      <Link
                        key={item.id}
                        href={`/${locale}/haberler/${item.slug}`}
                        className="group flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-indigo-50">
                          {img ? (
                            <img
                              src={img}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Newspaper className="h-6 w-6 text-indigo-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 transition group-hover:text-indigo-600">
                            {t(item.title, item.titleEn, locale)}
                          </h4>
                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(item.publishedAt, locale)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA Banner */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-6 text-white shadow-lg">
              <h3 className="mb-2 text-lg font-bold">
                {locale === "en" ? "Contact Us" : "Bizimle İletişime Geçin"}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-blue-100">
                {locale === "en"
                  ? "Visit our contact page for more information about our products and services."
                  : "Ürünlerimiz, hizmetlerimiz veya haberlerimiz hakkında daha fazla bilgi almak için iletişim sayfamızı ziyaret edin."}
              </p>
              <Link
                href={`/${locale}/iletisim`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-blue-50"
              >
                {locale === "en" ? "Contact" : "İletişime Geç"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
