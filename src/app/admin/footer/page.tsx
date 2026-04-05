"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  LayoutTemplate, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, GripVertical,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface FooterLink   { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }
interface PageData {
  address:   string;
  email:     string;
  phone:     string;
  columns:   FooterColumn[];
  copyright: string;
}

const STATIC: PageData = {
  address:   "Bandırma OSB, Balıkesir",
  email:     "info@bantas.com.tr",
  phone:     "+90 (266) 733 20 20",
  columns: [
    {
      title: "Kurumsal",
      links: [
        { label: "Hakkımızda",         href: "/hakkimizda"          },
        { label: "Tarihçe",             href: "/tarihce"             },
        { label: "Teknoloji",           href: "/teknoloji"           },
        { label: "Kalite Belgelerimiz", href: "/kalite-belgelerimiz" },
      ],
    },
    {
      title: "Yatırımcı İlişkileri",
      links: [
        { label: "Bilgi Toplumu Hizmetleri", href: "/bilgi-toplumu-hizmetleri" },
        { label: "Yönetim Kurulu",            href: "/yonetim-kurulu"           },
        { label: "Politikalar",               href: "/politikalar"              },
        { label: "Genel Kurul Bilgileri",     href: "/genel-kurul"              },
      ],
    },
    {
      title: "Menü",
      links: [
        { label: "Hakkımızda", href: "/hakkimizda" },
        { label: "Galeri",     href: "/galeri"      },
        { label: "İletişim",   href: "/iletisim"    },
        { label: "E-Bülten",   href: "/e-bulten"    },
      ],
    },
  ],
  copyright: "Bantaş A.Ş.",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function FooterAdminPage() {
  const [data,    setData]    = useState<PageData>(STATIC);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/footer-settings");
      const page = (res as any)?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.columns?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/footer-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "footer-settings", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Column helpers ─────────────────────────────────────────────────────
  function addColumn() {
    setData(d => ({ ...d, columns: [...d.columns, { title: "", links: [] }] }));
  }
  function removeColumn(ci: number) {
    setData(d => ({ ...d, columns: d.columns.filter((_, i) => i !== ci) }));
  }
  function updateColumnTitle(ci: number, val: string) {
    setData(d => {
      const cols = [...d.columns];
      cols[ci] = { ...cols[ci], title: val };
      return { ...d, columns: cols };
    });
  }

  // ── Link helpers ───────────────────────────────────────────────────────
  function addLink(ci: number) {
    setData(d => {
      const cols = [...d.columns];
      cols[ci] = { ...cols[ci], links: [...cols[ci].links, { label: "", href: "" }] };
      return { ...d, columns: cols };
    });
  }
  function removeLink(ci: number, li: number) {
    setData(d => {
      const cols = [...d.columns];
      cols[ci] = { ...cols[ci], links: cols[ci].links.filter((_, i) => i !== li) };
      return { ...d, columns: cols };
    });
  }
  function updateLink(ci: number, li: number, field: keyof FooterLink, val: string) {
    setData(d => {
      const cols  = [...d.columns];
      const links = [...cols[ci].links];
      links[li]   = { ...links[li], [field]: val };
      cols[ci]    = { ...cols[ci], links };
      return { ...d, columns: cols };
    });
  }

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Footer</h1>
              <p className="text-sm text-gray-500">Site alt bilgisini düzenleyin</p>
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
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Kaydet
            </button>
          </div>
        </div>

        {/* ── Contact Info ───────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Adres</label>
              <input
                value={data.address}
                onChange={e => setData(d => ({ ...d, address: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                placeholder="Bandırma OSB, Balıkesir"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">E-posta</label>
              <input
                value={data.email}
                onChange={e => setData(d => ({ ...d, email: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                placeholder="info@bantas.com.tr"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
              <input
                value={data.phone}
                onChange={e => setData(d => ({ ...d, phone: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                placeholder="+90 (266) 733 20 20"
              />
            </div>
          </div>
        </div>

        {/* ── Columns ───────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Footer Sütunları</h2>
            <button
              onClick={addColumn}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" /> Sütun Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {data.columns.map((col, ci) => (
              <div key={ci} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                {/* Column title */}
                <div className="mb-3 flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <input
                    value={col.title}
                    onChange={e => updateColumnTitle(ci, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-semibold focus:border-slate-500 focus:outline-none"
                    placeholder="Sütun başlığı..."
                  />
                  <button
                    onClick={() => removeColumn(ci)}
                    className="shrink-0 rounded-lg p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-start gap-1.5">
                      <div className="flex-1 space-y-1">
                        <input
                          value={link.label}
                          onChange={e => updateLink(ci, li, "label", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-slate-500 focus:outline-none"
                          placeholder="Link metni..."
                        />
                        <input
                          value={link.href}
                          onChange={e => updateLink(ci, li, "href", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 font-mono text-xs text-slate-500 focus:border-slate-500 focus:outline-none"
                          placeholder="/sayfa-yolu"
                        />
                      </div>
                      <button
                        onClick={() => removeLink(ci, li)}
                        className="mt-1 shrink-0 rounded p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLink(ci)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-1.5 text-xs text-gray-500 hover:border-slate-400 hover:text-slate-700"
                  >
                    <Plus className="h-3 w-3" /> Link Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Copyright ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Telif Hakkı Metni</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs">©</span>
            <span>{new Date().getFullYear()}</span>
            <input
              value={data.copyright}
              onChange={e => setData(d => ({ ...d, copyright: e.target.value }))}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              placeholder="Bantaş A.Ş."
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">Yıl otomatik güncellenir.</p>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-slate-700 bg-[#0f1028] p-6 text-slate-300">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Önizleme</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company column */}
            <div className="space-y-2 text-sm">
              <div className="mb-3 font-bold">
                <span className="text-red-400">BAN</span>
                <span className="text-white">TAŞ</span>
              </div>
              <p>{data.address || "—"}</p>
              <p className="text-slate-400">{data.email || "—"}</p>
              <p className="text-slate-400">{data.phone || "—"}</p>
            </div>
            {data.columns.map((col, ci) => (
              <div key={ci} className="space-y-2 text-sm">
                <p className="mb-3 font-semibold text-white">{col.title || "—"}</p>
                {col.links.map((l, li) => (
                  <p key={li} className="text-slate-400">{l.label || l.href || "—"}</p>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} {data.copyright}
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
