"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import {
  Home, Save, RefreshCw, CheckCircle, AlertCircle, Upload, Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface HeroStat    { value: string; label: string; labelEn: string }
interface HeroFeature { label: string; labelEn: string; href: string }

interface PageData {
  // Top bar
  topEmail: string;
  topPhone: string;
  // Hero
  heroTitle:       string;
  heroTitleEn:     string;
  heroDesc:        string;
  heroDescEn:      string;
  heroBadge:       string;
  heroBadgeEn:     string;
  heroBtn2Text:    string;
  heroBtn2TextEn:  string;
  heroBtn2Url:     string;
  heroStats:       HeroStat[];
  heroFeatures:    HeroFeature[];
  // Intro block
  introTitle:       string;
  introTitleEn:     string;
  introHighlight:   string;
  introHighlightEn: string;
  introBody:        string;
  introBodyEn:      string;
  // Quick action bar
  quoteTitle:      string;
  quoteTitleEn:    string;
  quoteDesc:       string;
  quoteDescEn:     string;
  quoteUrl:        string;
  kvkkText:        string;
  kvkkTextEn:      string;
  kvkkPdfUrl:      string;
  catalogTitle:    string;
  catalogTitleEn:  string;
  catalogDesc:     string;
  catalogDescEn:   string;
  catalogUrl:      string;
}

const STATIC: PageData = {
  topEmail: "info@bantas.com.tr",
  topPhone: "+90 (266) 733 20 20",
  heroTitle:      "Metal Ambalaj Üretiminde Güçlü Altyapı",
  heroTitleEn:    "Strong Infrastructure in Metal Packaging Production",
  heroDesc:       "Türkiye ve global pazarda yüksek kalite standartlarıyla metal ambalaj üretimi gerçekleştiriyoruz.",
  heroDescEn:     "We produce metal packaging with high quality standards in Turkey and global markets.",
  heroBadge:      "Bantaş A.Ş. — Metal Ambalaj",
  heroBadgeEn:    "Bantaş Inc. — Metal Packaging",
  heroBtn2Text:   "Ürünlerimiz",
  heroBtn2TextEn: "Our Products",
  heroBtn2Url:    "/urunler",
  heroStats: [
    { value: "25+",  label: "Yıl Deneyim",        labelEn: "Years Experience"   },
    { value: "50+",  label: "İhracat Ülkesi",      labelEn: "Export Countries"   },
    { value: "ISO",  label: "9001 Sertifikalı",    labelEn: "9001 Certified"     },
    { value: "500+", label: "Ürün Çeşidi",         labelEn: "Product Varieties"  },
  ],
  heroFeatures: [
    { label: "Üretim Sürecimiz",   labelEn: "Our Production Process", href: "/uretim-sureci" },
    { label: "Ürün Grupları",      labelEn: "Product Groups",         href: "/urunler"       },
    { label: "Sürdürülebilirlik",  labelEn: "Sustainability",         href: "/surdurulebilirlik" },
  ],
  introTitle:       "Bantaş Teneke Ambalaj",
  introTitleEn:     "Bantaş Tin Packaging",
  introHighlight:   "Çözümleri",
  introHighlightEn: "Solutions",
  introBody:        "Bandırma'daki modern tesislerimizde yüksek kapasiteyle üretim yapıyor; gıda ve endüstriyel uygulamalar için güvenilir teneke ambalaj sunuyoruz.",
  introBodyEn:      "At our modern facilities in Bandırma, we produce high-capacity, reliable tin packaging for food and industrial applications.",
  quoteTitle:      "Teklif Al",
  quoteTitleEn:    "Get a Quote",
  quoteDesc:       "İhtiyacınıza özel ambalaj çözümleri için bize ulaşın.",
  quoteDescEn:     "Contact us for custom packaging solutions tailored to your needs.",
  quoteUrl:        "/iletisim",
  kvkkText:        "Kişisel verileriniz, 6698 sayılı KVKK kapsamında korunmaktadır. Aydınlatma metnimizi inceleyebilirsiniz.",
  kvkkTextEn:      "Your personal data is protected under KVKK (Turkish Data Protection Law). You may review our privacy notice.",
  kvkkPdfUrl:      "",
  catalogTitle:    "Katalog",
  catalogTitleEn:  "Catalog",
  catalogDesc:     "Ürün gruplarımızı PDF katalog üzerinden inceleyin.",
  catalogDescEn:   "Browse our product groups through the PDF catalog.",
  catalogUrl:      "/katalog",
};

type Tab = "topbar" | "hero" | "intro" | "quickactions";

// ── Component ──────────────────────────────────────────────────────────────
export default function AnasayfaAdminPage() {
  const [data,    setData]    = useState<PageData>(STATIC);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");
  const [tab,     setTab]     = useState<Tab>("topbar");
  const [pdfUploading, setPdfUploading] = useState(false);
  const kvkkPdfRef  = useRef<HTMLInputElement>(null);
  const catalogPdfRef = useRef<HTMLInputElement>(null);

  async function uploadPdf(file: File, field: "kvkkPdfUrl" | "catalogUrl") {
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminUpload<{ url: string }>("/api/upload", fd) as any;
      if (res?.url) setData(d => ({ ...d, [field]: res.url }));
    } catch { /* ignore */ }
    finally { setPdfUploading(false); }
  }

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/anasayfa-settings");
      const page = (res as any)?.data || res;
      if (page?.sections) {
        const parsed: Partial<PageData> = JSON.parse(page.sections);
        if (parsed?.introTitle) {
          setData({
            ...STATIC,
            ...parsed,
            heroStats:    Array.isArray(parsed.heroStats)    ? parsed.heroStats    : STATIC.heroStats,
            heroFeatures: Array.isArray(parsed.heroFeatures) ? parsed.heroFeatures : STATIC.heroFeatures,
          });
          setLoading(false);
          return;
        }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/anasayfa-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "anasayfa-settings", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const set = (field: keyof PageData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [field]: e.target.value }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "topbar",       label: "Üst Bar"          },
    { id: "hero",         label: "Hero"             },
    { id: "intro",        label: "Giriş Bloğu"      },
    { id: "quickactions", label: "Hızlı Aksiyonlar" },
  ];

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ana Sayfa</h1>
              <p className="text-sm text-gray-500">Üst bar, giriş ve hızlı aksiyon bölümlerini düzenleyin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {status === "success" && (
              <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="h-4 w-4" /> Kaydedildi</span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> Hata</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-muted disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Kaydet
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Top Bar ───────────────────────────────────────────────────── */}
        {tab === "topbar" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 font-semibold text-gray-900">Üst Bar (Header)</h2>
            <p className="mb-5 text-xs text-gray-400">Sitenin en üstünde görünen iletişim bilgileri.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">E-posta</label>
                <input
                  value={data.topEmail}
                  onChange={set("topEmail")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  placeholder="info@bantas.com.tr"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                <input
                  value={data.topPhone}
                  onChange={set("topPhone")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                  placeholder="+90 (266) 733 20 20"
                />
              </div>
            </div>

            {/* Live preview */}
            <div className="mt-5 rounded-xl bg-[#0f1028] px-4 py-3 text-xs text-white/80">
              <span className="text-white/50">Önizleme → </span>
              {data.topEmail} &nbsp;|&nbsp; {data.topPhone}
            </div>
          </div>
        )}

        {/* ── Tab: Hero ─────────────────────────────────────────────────────── */}
        {tab === "hero" && (
          <div className="space-y-5">
            <p className="text-xs text-gray-400">Hero slider görselleri <strong>/admin/hero</strong> sayfasından yönetilir. Burada metin ve buton ayarları düzenlenir.</p>

            {/* Başlık ve Açıklama */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Ana Başlık</h2>
              <p className="text-xs text-gray-400">Hero slider'daki slaytlarda başlık boşsa bu metin gösterilir.</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇹🇷 Türkçe Başlık</label>
                  <input value={data.heroTitle} onChange={set("heroTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Metal Ambalaj Üretiminde Güçlü Altyapı" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇬🇧 English Title</label>
                  <input value={data.heroTitleEn} onChange={set("heroTitleEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Strong Infrastructure in Metal Packaging" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇹🇷 Türkçe Açıklama</label>
                  <textarea value={data.heroDesc} onChange={set("heroDesc")} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇬🇧 English Description</label>
                  <textarea value={data.heroDescEn} onChange={set("heroDescEn")} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Üst Etiket (Badge)</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇹🇷 Türkçe</label>
                  <input value={data.heroBadge} onChange={set("heroBadge")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Bantaş A.Ş. — Metal Ambalaj" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇬🇧 English</label>
                  <input value={data.heroBadgeEn} onChange={set("heroBadgeEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Bantaş Inc. — Metal Packaging" />
                </div>
              </div>
            </div>

            {/* 2. Buton */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">İkinci Buton</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇹🇷 Metin</label>
                  <input value={data.heroBtn2Text} onChange={set("heroBtn2Text")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Ürünlerimiz" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">🇬🇧 Text</label>
                  <input value={data.heroBtn2TextEn} onChange={set("heroBtn2TextEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Our Products" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">URL</label>
                  <input value={data.heroBtn2Url} onChange={set("heroBtn2Url")} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/urunler" />
                </div>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">İstatistikler (Alt Bar)</h2>
              <div className="space-y-3">
                {(data.heroStats ?? []).map((stat, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">Değer</label>
                      <input
                        value={stat.value}
                        onChange={e => {
                          const updated = [...data.heroStats];
                          updated[i] = { ...updated[i], value: e.target.value };
                          setData(d => ({ ...d, heroStats: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                        placeholder="25+"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">🇹🇷 Etiket</label>
                      <input
                        value={stat.label}
                        onChange={e => {
                          const updated = [...data.heroStats];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setData(d => ({ ...d, heroStats: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                        placeholder="Yıl Deneyim"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">🇬🇧 Label</label>
                      <input
                        value={stat.labelEn}
                        onChange={e => {
                          const updated = [...data.heroStats];
                          updated[i] = { ...updated[i], labelEn: e.target.value };
                          setData(d => ({ ...d, heroStats: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                        placeholder="Years Experience"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature linkleri */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Özellik Linkleri</h2>
              <div className="space-y-3">
                {(data.heroFeatures ?? []).map((f, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">🇹🇷 Metin</label>
                      <input
                        value={f.label}
                        onChange={e => {
                          const updated = [...data.heroFeatures];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setData(d => ({ ...d, heroFeatures: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">🇬🇧 Text</label>
                      <input
                        value={f.labelEn}
                        onChange={e => {
                          const updated = [...data.heroFeatures];
                          updated[i] = { ...updated[i], labelEn: e.target.value };
                          setData(d => ({ ...d, heroFeatures: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">URL</label>
                      <input
                        value={f.href}
                        onChange={e => {
                          const updated = [...data.heroFeatures];
                          updated[i] = { ...updated[i], href: e.target.value };
                          setData(d => ({ ...d, heroFeatures: updated }));
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Intro Block ───────────────────────────────────────────────── */}
        {tab === "intro" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h2 className="mb-1 font-semibold text-gray-900">Giriş Bloğu</h2>
              <p className="text-xs text-gray-400">Ana sayfanın ortasındaki tanıtım metin bölümü.</p>
            </div>

            {/* TR */}
            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🇹🇷 Türkçe</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Başlık (normal)</label>
                  <input value={data.introTitle} onChange={set("introTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Bantaş Teneke Ambalaj" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Başlık (vurgulu)</label>
                  <input value={data.introHighlight} onChange={set("introHighlight")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Çözümleri" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama Metni</label>
                <textarea rows={3} value={data.introBody} onChange={set("introBody")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
              </div>
            </div>

            {/* EN */}
            <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">🇬🇧 English</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Title (normal)</label>
                  <input value={data.introTitleEn} onChange={set("introTitleEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Bantaş Tin Packaging" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Title (highlight)</label>
                  <input value={data.introHighlightEn} onChange={set("introHighlightEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Solutions" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
                <textarea rows={3} value={data.introBodyEn} onChange={set("introBodyEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl bg-gray-50 px-6 py-5 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {data.introTitle}{" "}
                <span className="border-b-4 border-red-500 pb-0.5 text-red-500">{data.introHighlight}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{data.introBody}</p>
            </div>
          </div>
        )}

        {/* ── Tab: Quick Actions ─────────────────────────────────────────────── */}
        {tab === "quickactions" && (
          <div className="space-y-4">
            {/* Quote */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Sol Kart — Teklif</h2>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🇹🇷 Türkçe</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Buton Metni</label><input value={data.quoteTitle} onChange={set("quoteTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Teklif Al" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label><input value={data.quoteDesc} onChange={set("quoteDesc")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" /></div>
                </div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">🇬🇧 English</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Button Text</label><input value={data.quoteTitleEn} onChange={set("quoteTitleEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Get a Quote" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Description</label><input value={data.quoteDescEn} onChange={set("quoteDescEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" /></div>
                </div>
              </div>
              <div><label className="mb-1 block text-xs font-medium text-gray-600">Bağlantı URL</label><input value={data.quoteUrl} onChange={set("quoteUrl")} className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/iletisim" /></div>
            </div>

            {/* KVKK */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Orta Kart — KVKK Metni</h2>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🇹🇷 Türkçe</p>
                <textarea rows={2} value={data.kvkkText} onChange={set("kvkkText")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">🇬🇧 English</p>
                <textarea rows={2} value={data.kvkkTextEn} onChange={set("kvkkTextEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" />
              </div>
              {/* KVKK PDF */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">PDF Dosyası (tıklayınca açılır)</label>
                <input ref={kvkkPdfRef} type="file" accept="application/pdf" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPdf(f, "kvkkPdfUrl"); e.target.value = ""; }} />
                <div className="flex gap-2">
                  <input value={data.kvkkPdfUrl} onChange={set("kvkkPdfUrl")} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/uploads/kvkk.pdf veya https://..." />
                  <button type="button" onClick={() => kvkkPdfRef.current?.click()} disabled={pdfUploading}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
                    {pdfUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    PDF Yükle
                  </button>
                </div>
                {data.kvkkPdfUrl && <a href={data.kvkkPdfUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-blue-600 hover:underline">Önizle →</a>}
              </div>
            </div>

            {/* Catalog */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900">Sağ Kart — Katalog</h2>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">🇹🇷 Türkçe</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Buton Metni</label><input value={data.catalogTitle} onChange={set("catalogTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Katalog" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label><input value={data.catalogDesc} onChange={set("catalogDesc")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" /></div>
                </div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">🇬🇧 English</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Button Text</label><input value={data.catalogTitleEn} onChange={set("catalogTitleEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Catalog" /></div>
                  <div><label className="mb-1 block text-xs font-medium text-gray-600">Description</label><input value={data.catalogDescEn} onChange={set("catalogDescEn")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" /></div>
                </div>
              </div>
              {/* Catalog PDF / URL */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">PDF veya Bağlantı URL</label>
                <input ref={catalogPdfRef} type="file" accept="application/pdf" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadPdf(f, "catalogUrl"); e.target.value = ""; }} />
                <div className="flex gap-2">
                  <input value={data.catalogUrl} onChange={set("catalogUrl")} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/uploads/katalog.pdf veya /katalog" />
                  <button type="button" onClick={() => catalogPdfRef.current?.click()} disabled={pdfUploading}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
                    {pdfUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    PDF Yükle
                  </button>
                </div>
                {data.catalogUrl && <a href={data.catalogUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-blue-600 hover:underline">Önizle →</a>}
              </div>
            </div>

            {/* Preview */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <p className="border-b border-gray-100 px-4 py-2 text-xs font-semibold text-gray-400">Önizleme</p>
              <div className="grid divide-x divide-gray-200 md:grid-cols-3">
                <div className="p-5">
                  <div className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{data.quoteTitle}</div>
                  <p className="mt-2 text-xs text-slate-500">{data.quoteDesc}</p>
                </div>
                <div className="bg-[#0f1028] p-5">
                  <p className="text-xs leading-relaxed text-white/90">{data.kvkkText}</p>
                </div>
                <div className="p-5 text-right">
                  <div className="inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{data.catalogTitle}</div>
                  <p className="mt-2 text-xs text-slate-500">{data.catalogDesc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
