"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Home, Save, RefreshCw, CheckCircle, AlertCircle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface PageData {
  // Top bar
  topEmail: string;
  topPhone: string;
  // Intro block
  introTitle:     string;
  introHighlight: string;
  introBody:      string;
  // Quick action bar
  quoteTitle:   string;
  quoteDesc:    string;
  quoteUrl:     string;
  kvkkText:     string;
  catalogTitle: string;
  catalogDesc:  string;
  catalogUrl:   string;
}

const STATIC: PageData = {
  topEmail: "info@bantas.com.tr",
  topPhone: "+90 (266) 733 20 20",
  introTitle:     "Bantaş Teneke Ambalaj",
  introHighlight: "Çözümleri",
  introBody:      "Bandırma'daki modern tesislerimizde yüksek kapasiteyle üretim yapıyor; gıda ve endüstriyel uygulamalar için güvenilir teneke ambalaj sunuyoruz.",
  quoteTitle:   "Teklif Al",
  quoteDesc:    "İhtiyacınıza özel ambalaj çözümleri için bize ulaşın.",
  quoteUrl:     "/iletisim",
  kvkkText:     "Kişisel verileriniz, 6698 sayılı KVKK kapsamında korunmaktadır. Aydınlatma metnimizi inceleyebilirsiniz.",
  catalogTitle: "Katalog",
  catalogDesc:  "Ürün gruplarımızı PDF katalog üzerinden inceleyin.",
  catalogUrl:   "/katalog",
};

type Tab = "topbar" | "intro" | "quickactions";

// ── Component ──────────────────────────────────────────────────────────────
export default function AnasayfaAdminPage() {
  const [data,    setData]    = useState<PageData>(STATIC);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");
  const [tab,     setTab]     = useState<Tab>("topbar");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/anasayfa-settings");
      const page = (res as any)?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.introTitle) { setData(parsed); setLoading(false); return; }
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
    { id: "topbar",      label: "Üst Bar"          },
    { id: "intro",       label: "Giriş Bloğu"      },
    { id: "quickactions",label: "Hızlı Aksiyonlar" },
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

        {/* ── Tab: Intro Block ───────────────────────────────────────────────── */}
        {tab === "intro" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 font-semibold text-gray-900">Giriş Bloğu</h2>
            <p className="mb-5 text-xs text-gray-400">
              Ana sayfanın ortasındaki tanıtım metin bölümü.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Başlık (normal)</label>
                  <input
                    value={data.introTitle}
                    onChange={set("introTitle")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    placeholder="Bantaş Teneke Ambalaj"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Başlık (vurgulu / kırmızı altı çizili)</label>
                  <input
                    value={data.introHighlight}
                    onChange={set("introHighlight")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                    placeholder="Çözümleri"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama Metni</label>
                <textarea
                  rows={4}
                  value={data.introBody}
                  onChange={set("introBody")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-5 rounded-xl bg-gray-50 px-6 py-5 text-center">
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
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">Sol Kart — Teklif</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Buton Metni</label>
                  <input value={data.quoteTitle} onChange={set("quoteTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Teklif Al" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
                  <input value={data.quoteDesc}  onChange={set("quoteDesc")}  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="İhtiyacınıza özel..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Bağlantı URL</label>
                  <input value={data.quoteUrl}   onChange={set("quoteUrl")}   className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/iletisim" />
                </div>
              </div>
            </div>

            {/* KVKK */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">Orta Kart — KVKK Metni</h2>
              <textarea
                rows={3}
                value={data.kvkkText}
                onChange={set("kvkkText")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                placeholder="Kişisel verileriniz..."
              />
            </div>

            {/* Catalog */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">Sağ Kart — Katalog</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Buton Metni</label>
                  <input value={data.catalogTitle} onChange={set("catalogTitle")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Katalog" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
                  <input value={data.catalogDesc}  onChange={set("catalogDesc")}  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none" placeholder="Ürün gruplarımızı..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Bağlantı URL</label>
                  <input value={data.catalogUrl}   onChange={set("catalogUrl")}   className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none" placeholder="/katalog" />
                </div>
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
