import { fetchWithTimeout } from "./fetchWithTimeout";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Generic fetch (Server Components — no-store = always fresh, or use revalidate) ────
export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    next: { revalidate: 30 },
    timeoutMs: 8000,
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  ctaText?: string;
  ctaTextEn?: string;
  ctaLink?: string;
  order: number;
  active: boolean;
}

export interface HomeProductCategory {
  id: string;
  name: string;
  nameEn?: string;
  image?: string;
  link?: string;
  description?: string;
  descriptionEn?: string;
  order: number;
  active: boolean;
}

export interface BeforeAfterItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  active: boolean;
}

export interface Advantage {
  id: string;
  icon: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  order: number;
  active: boolean;
}

export interface AboutSection {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  active: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  titleEn?: string;
  order: number;
  active: boolean;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  title: string;
  titleEn?: string;
  url: string;
  order: number;
  active: boolean;
}

export interface FooterInfo {
  id: string;
  companyName: string;
  companyNameEn?: string;
  address: string;
  addressEn?: string;
  phone: string;
  email: string;
  copyrightText: string;
  copyrightTextEn?: string;
  logoUrl?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsole?: string;
  facebookPixelId?: string;
  facebookAccessToken?: string;
  email?: string;
  phone?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  ePaymentUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  excerpt?: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  image?: string;
  category?: string;
  publishedAt: string;
  active: boolean;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// ─── Public API helpers ───────────────────────────────────────────────────────

export const getHeroSlider = () =>
  apiFetch<HeroSlide[]>("/api/hero/slider");

export const getHomeProductCategories = () =>
  apiFetch<HomeProductCategory[]>("/api/home-product-categories");

export const getBeforeAfter = () =>
  apiFetch<BeforeAfterItem[]>("/api/before-after");

export const getAdvantages = () =>
  apiFetch<Advantage[]>("/api/advantages");

/** Backend tek kayıt veya null döner; her zaman dizi olarak normalize edilir. */
export async function getAbout(): Promise<AboutSection[]> {
  try {
    const data = await apiFetch<AboutSection | AboutSection[] | null>(
      "/api/about",
    );
    if (data == null) return [];
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

export const getFooterSections = () =>
  apiFetch<FooterSection[]>("/api/footer/sections");

export const getFooterInfo = () =>
  apiFetch<FooterInfo>("/api/footer/info");

export const getNews = () =>
  apiFetch<NewsItem[]>("/api/news");

export const getSiteSettings = () =>
  apiFetch<SiteSettings>("/api/settings");

/** Ürünler menüsü ve /urunler listesi (API’den) */
export interface ProductPageNavItem {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  order: number;
}

export interface ProductPagePublic {
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  mainImage?: string | null;
  content?: string | null;
  detailedDescription?: string | null;
}

export async function getProductPagesNav(): Promise<ProductPageNavItem[]> {
  try {
    return await apiFetch<ProductPageNavItem[]>(
      "/api/product-pages/public/nav",
    );
  } catch {
    return [];
  }
}

export async function getProductPageBySlug(
  slug: string,
  locale: string,
): Promise<ProductPagePublic | null> {
  const l = locale === "en" ? "en" : "tr";
  try {
    return await apiFetch<ProductPagePublic>(
      `/api/product-pages/public/${encodeURIComponent(slug)}?locale=${l}`,
    );
  } catch {
    return null;
  }
}

export interface ProductPageRecord extends ProductPageNavItem {
  subtitle?: string | null;
  subtitleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  detailedDescription?: string | null;
  detailedDescriptionEn?: string | null;
  mainImage?: string | null;
  content?: string | null;
  active: boolean;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryCategory {
  id: string;
  name: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  title?: string;
  description?: string;
  category: GalleryCategory;
}

export interface GalleryFeatured {
  id: string;
  image: string;
  title: string;
  description?: string;
  type: string;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    return await apiFetch<GalleryImage[]>("/api/gallery/images");
  } catch {
    return [];
  }
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    return await apiFetch<GalleryCategory[]>("/api/products");
  } catch {
    return [];
  }
}

export async function getGalleryFeatured(
  type: string,
): Promise<GalleryFeatured | null> {
  try {
    return await apiFetch<GalleryFeatured>(
      `/api/gallery-featured/type/${encodeURIComponent(type)}`,
    );
  } catch {
    return null;
  }
}

/** Resolve an upload path to absolute URL */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}
