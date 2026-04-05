"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, getToken } from "@/lib/adminApi";
import {
  FileText, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, Upload, ExternalLink, X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ──────────────────────────────────────────────────────────────────
interface Policy {
  title:       string;
  description: string;
  icon:        string;
  color:       string;
  pdfUrl:      string;
}
interface PageData {
  policies:  Policy[];
  infoTitle: string;
  infoText:  string;
  ctaTitle:  string;
  ctaText:   string;
}

const COLOR_OPTIONS = [
  { label: "Mavi",   value: "from-blue-500 to-cyan-500"    },
  { label: "Yeşil",  value: "from-green-500 to-emerald-500"},
  { label: "Mor",    value: "from-purple-500 to-pink-500"  },
  { label: "Turuncu",value: "from-orange-500 to-red-500"   },
  { label: "İndigo", value: "from-indigo-500 to-blue-500"  },
  { label: "Kırmızı",value: "from-red-500 to-rose-500"     },
];

const STATIC: PageData = {
  policies: [
    { title: "Bilgilendirme Politikası",  description: "Kamuyu aydınlatma ve bilgilendirme politikamız",                      icon: "📢", color: "from-blue-500 to-cyan-500",    pdfUrl: "/uploads/politikalar/bilgilendirme-politikasi.pdf"  },
    { title: "Ücret Politikası",           description: "Yönetim kurulu ve üst düzey yöneticilerin ücretlendirme politikası", icon: "💰", color: "from-green-500 to-emerald-500", pdfUrl: "/uploads/politikalar/ucret-politikasi.pdf"           },
    { title: "Bağış ve Yardımlar",         description: "Bağış ve yardım politikamız",                                        icon: "🤝", color: "from-purple-500 to-pink-500",   pdfUrl: "/uploads/politikalar/bagis-yardimlar.pdf"            },
    { title: "Kar Dağıtım Politikası",    description: "Kar dağıtım politikamız ve ilkeleri",                                icon: "📊", color: "from-orange-500 to-red-500",    pdfUrl: "/uploads/politikalar/kar-dagitim-politikasi.pdf"     },
    { title: "Geri Alım Politikası",       description: "Pay geri alım politikamız",                                          icon: "🔄", color: "from-indigo-500 to-blue-500",   pdfUrl: "/uploads/politikalar/geri-alim-politikasi.pdf"       },
  ],
  infoTitle: "Kurumsal Yönetim Politikaları",
  infoText:  "Şirketimizin kurumsal yönetim politikaları, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda hazırlanmış olup, şeffaflık, hesap verebilirlik, sorumluluk ve adillik ilkelerine dayanmaktadır. Tüm politikalarımız düzenli olarak gözden geçirilmekte ve güncellenmektedir.",
  ctaTitle:  "Kurumsal Yönetim",
  ctaText:   "Politikalarımız ve kurumsal yönetim uygulamalarımız hakkında daha fazla bilgi almak için diğer yatırımcı ilişkileri sayfalarımızı inceleyebilirsiniz.",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function PolitikalarAdminPage() {
  const [data,       setData]       = useState<PageData>(STATIC);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [status,     setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [uploading,  setUploading]  = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/politikalar");
      const page = res?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.policies?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/politikalar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "politikalar", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── PDF upload ────────────────────────────────────────────────────────
  async function uploadPdf(idx: number, file: File) {
    setUploading(idx);
    try {
      const token = getToken();
      const form  = new FormData();
      form.append("pdf", file);
      form.append("title", data.policies[idx].title);
      form.append("slug",  `politikalar-${idx}`);

      const res  = await fetch(`${API_URL}/api/pdfs`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      const url  = (json.data || json)?.fileUrl || (json.data || json)?.url || "";

      setData(d => {
        const policies = [...d.policies];
        policies[idx]  = { ...policies[idx], pdfUrl: url };
        return { ...d, policies };
      });
    } catch (e) {
      alert("PDF yüklenirken hata oluştu.");
    } finally {
      setUploading(null);
    }
  }

  // ── Policy helpers ─────────────────────────────────────────────────────
  function addPolicy() {
    setData(d => ({
      ...d,
      policies: [...d.policies, { title: "", description: "", icon: "📄", color: "from-indigo-500 to-blue-500", pdfUrl: "" }],
    }));
  }
  function removePolicy(i: number) {
    setData(d => ({ ...d, policies: d.policies.filter((_, idx) => idx !== i) }));
  }
  function updatePolicy(i: number, field: keyof Policy, val: string) {
    setData(d => {
      const policies = [...d.policies];
      policies[i]    = { ...policies[i], [field]: val };
      return { ...d, policies };
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Politikalar</h1>
              <p className="text-sm text-gray-500">Kurumsal yönetim politikalarını yönetin</p>
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
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Kaydet
            </button>
          </div>
        </div>

        {/* ── Policy Cards ───────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Politika Kartları</h2>
            <button
              onClick={addPolicy}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Politika Ekle
            </button>
          </div>

          <div className="space-y-4">
            {data.policies.map((p, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon || "📄"}</span>
                    <span className="font-medium text-gray-700">{p.title || `Politika ${i + 1}`}</span>
                  </div>
                  <button
                    onClick={() => removePolicy(i)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {/* Title */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
                    <input
                      value={p.title}
                      onChange={e => updatePolicy(i, "title", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Politika adı..."
                    />
                  </div>
                  {/* Icon */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Emoji İkon</label>
                    <input
                      value={p.icon}
                      onChange={e => updatePolicy(i, "icon", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="📢"
                    />
                  </div>
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
                    <input
                      value={p.description}
                      onChange={e => updatePolicy(i, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Kısa açıklama..."
                    />
                  </div>
                  {/* Color */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Renk</label>
                    <select
                      value={p.color}
                      onChange={e => updatePolicy(i, "color", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      {COLOR_OPTIONS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* PDF */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">PDF Dosyası</label>
                    <div className="flex items-center gap-2">
                      {p.pdfUrl ? (
                        <div className="flex flex-1 items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                          <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                          <a
                            href={p.pdfUrl.startsWith("http") ? p.pdfUrl : `${API_URL}${p.pdfUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-w-0 flex-1 items-center gap-1 truncate text-xs text-green-700 hover:underline"
                          >
                            <span className="truncate">{p.pdfUrl.split("/").pop()}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                          <button
                            onClick={() => updatePolicy(i, "pdfUrl", "")}
                            className="shrink-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-400">
                          PDF yüklenmemiş
                        </div>
                      )}
                      <input
                        type="file"
                        accept=".pdf"
                        ref={el => { fileRefs.current[i] = el; }}
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) uploadPdf(i, f);
                          e.target.value = "";
                        }}
                      />
                      <button
                        onClick={() => fileRefs.current[i]?.click()}
                        disabled={uploading === i}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {uploading === i
                          ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          : <Upload className="h-3.5 w-3.5" />}
                        {p.pdfUrl ? "Güncelle" : "Yükle"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {data.policies.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Henüz politika yok. "Politika Ekle" ile ekleyin.
              </p>
            )}
          </div>
        </div>

        {/* ── Info Box ──────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Bilgi Kutusu</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
              <input
                value={data.infoTitle}
                onChange={e => setData(d => ({ ...d, infoTitle: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">İçerik</label>
              <textarea
                rows={4}
                value={data.infoText}
                onChange={e => setData(d => ({ ...d, infoText: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">CTA Bölümü</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
              <input
                value={data.ctaTitle}
                onChange={e => setData(d => ({ ...d, ctaTitle: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
              <textarea
                rows={3}
                value={data.ctaText}
                onChange={e => setData(d => ({ ...d, ctaText: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
