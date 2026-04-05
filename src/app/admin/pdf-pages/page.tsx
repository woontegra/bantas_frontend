"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { getToken } from "@/lib/adminApi";
import {
  FileText, Upload, Trash2, ExternalLink, RefreshCw,
  CheckCircle, AlertCircle, Plus, X, FilePlus2, Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CATEGORY = "sayfa-pdf";

const PREDEFINED: { title: string; slug: string }[] = [
  { title: "Sürdürülebilirlik İlkelerimiz",                         slug: "surdurulebilirlik-ilkelerimiz" },
  { title: "Bilgi Güvenliği Politikası",                            slug: "bilgi-guvenligi-politikasi" },
  { title: "Gıda Güvenliği Politikası",                             slug: "gida-guvenligi-politikasi" },
  { title: "İnsan Kaynakları Politikası",                           slug: "insan-kaynaklari-politikasi" },
  { title: "İş Sağlığı Güvenliği Politikası",                       slug: "is-sagligi-guvenligi-politikasi" },
  { title: "Kalite Politikası",                                     slug: "kalite-politikasi" },
  { title: "Kişisel Veri Saklama ve İmha Politikası",               slug: "kisisel-veri-saklama-ve-imha-politikasi" },
  { title: "Kişisel Verilerin İşlenmesi ve Korunması Politikası",   slug: "kisisel-verilerin-islenmesi-ve-korunmasi-politikasi" },
  { title: "Web Sitesi Aydınlatma Politikası",                      slug: "web-sitesi-aydinlatma-politikasi" },
  { title: "KVKK-Başvuru Formu",                                    slug: "kvkk-basvuru-formu" },
];

interface PdfDoc {
  id: string;
  title: string;
  category: string;
  filePath: string;
  fileSize: number;
  active: boolean;
  order: number;
}

interface Slot {
  predefined: { title: string; slug: string } | null; // null = custom
  doc: PdfDoc | null;
  customTitle?: string; // for custom (non-predefined) docs
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfPagesAdminPage() {
  const [docs, setDocs]         = useState<PdfDoc[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState<string | null>(null); // slug or "custom-{idx}"
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [toast, setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customTitle, setCustomTitle]   = useState("");

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/pdfs?category=${CATEGORY}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      setDocs(await res.json());
    } catch { showToast("error", "PDF'ler yüklenemedi."); }
    finally { setLoading(false); }
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  // Find existing doc for a predefined slot
  function docForSlug(title: string): PdfDoc | null {
    return docs.find((d) => d.title === title) ?? null;
  }

  // Upload PDF for a slot (create or update)
  async function uploadPdf(title: string, file: File, existingId?: string) {
    const key = title;
    setUploading(key);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      fd.append("category", CATEGORY);
      fd.append("active", "true");

      const url   = existingId ? `${API_URL}/api/pdfs/${existingId}` : `${API_URL}/api/pdfs`;
      const method = existingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      showToast("success", `"${title}" başarıyla yüklendi.`);
      await load();
    } catch { showToast("error", `"${title}" yüklenirken hata oluştu.`); }
    finally { setUploading(null); }
  }

  async function deletePdf(doc: PdfDoc) {
    if (!confirm(`"${doc.title}" PDF'ini silmek istediğinizden emin misiniz?`)) return;
    setDeleting(doc.id);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/pdfs/${doc.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      showToast("success", `"${doc.title}" silindi.`);
      await load();
    } catch { showToast("error", "Silme işlemi başarısız."); }
    finally { setDeleting(null); }
  }

  async function addCustom() {
    if (!customTitle.trim()) return;
    const existing = docs.find((d) => d.title === customTitle.trim());
    if (existing) { showToast("error", "Bu isimde zaten bir kayıt var."); return; }
    const input = fileRefs.current["__custom_new__"];
    input?.click();
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  // Custom docs = docs that aren't in the predefined list
  const predefinedTitles = new Set(PREDEFINED.map((p) => p.title));
  const customDocs = docs.filter((d) => !predefinedTitles.has(d.title));

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="p-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl text-sm font-medium text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PDF Sayfaları</h1>
            <p className="text-sm text-gray-500">Menüde PDF olarak açılan belgeler</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Her satır için <strong>PDF Yükle</strong> butonuna tıklayarak belgelerinizi yükleyin. Mevcut bir belgenin üzerine yeni PDF yükleyerek güncelleyebilirsiniz.</span>
        </div>

        {/* Predefined docs */}
        <div className="space-y-3">
          {PREDEFINED.map((pre, idx) => {
            const doc    = docForSlug(pre.title);
            const isUploading = uploading === pre.title;
            const isDeleting  = deleting  === doc?.id;
            const refKey = pre.slug;

            return (
              <div key={pre.slug} className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${doc ? "border-green-200" : "border-gray-200"}`}>
                {/* Order badge + title */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{pre.title}</p>
                    {doc ? (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {doc.filePath.split("/").pop()} · {formatBytes(doc.fileSize)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">Henüz PDF yüklenmedi</p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  {doc
                    ? <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"><CheckCircle className="w-3 h-3" /> Yüklendi</span>
                    : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">Boş</span>
                  }
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    ref={(el) => { fileRefs.current[refKey] = el; }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadPdf(pre.title, file, doc?.id);
                      e.target.value = "";
                    }}
                  />

                  {doc && (
                    <a
                      href={`${API_URL}${doc.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Görüntüle
                    </a>
                  )}

                  <button
                    onClick={() => fileRefs.current[refKey]?.click()}
                    disabled={isUploading || isDeleting}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                      doc
                        ? "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } disabled:opacity-50`}
                  >
                    {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploading ? "Yükleniyor…" : doc ? "Güncelle" : "PDF Yükle"}
                  </button>

                  {doc && (
                    <button
                      onClick={() => deletePdf(doc)}
                      disabled={isDeleting || isUploading}
                      className="flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      {isDeleting ? "Siliniyor…" : "Sil"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Custom (extra) docs already in DB */}
          {customDocs.map((doc) => {
            const isUploading = uploading === doc.title;
            const isDeleting  = deleting  === doc.id;
            const refKey = `custom-${doc.id}`;
            return (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-purple-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-600">
                    <FilePlus2 className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.filePath.split("/").pop()} · {formatBytes(doc.fileSize)}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 shrink-0">
                  <CheckCircle className="w-3 h-3" /> Yüklendi
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <input type="file" accept=".pdf,application/pdf" className="hidden"
                    ref={(el) => { fileRefs.current[refKey] = el; }}
                    onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadPdf(doc.title, f, doc.id); e.target.value = ""; }}
                  />
                  <a href={`${API_URL}${doc.filePath}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition">
                    <ExternalLink className="w-3.5 h-3.5" /> Görüntüle
                  </a>
                  <button onClick={() => fileRefs.current[refKey]?.click()} disabled={isUploading}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-200 px-3 py-1.5 text-xs text-purple-600 hover:bg-purple-50 transition disabled:opacity-50">
                    {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploading ? "Yükleniyor…" : "Güncelle"}
                  </button>
                  <button onClick={() => deletePdf(doc)} disabled={isDeleting}
                    className="flex items-center gap-1.5 rounded-xl border border-red-100 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                    {isDeleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    {isDeleting ? "Siliniyor…" : "Sil"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add custom doc */}
        <div className="mt-6">
          {!addingCustom ? (
            <button onClick={() => setAddingCustom(true)}
              className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              <Plus className="w-4 h-4" /> Yeni PDF Sayfası Ekle
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700">Yeni PDF Sayfası</p>
              <div className="flex items-center gap-3">
                <input
                  className={`${inp} flex-1`}
                  placeholder="Sayfa adı (örn. Çevre Politikası)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
                />
                <button onClick={() => { setAddingCustom(false); setCustomTitle(""); }}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-100 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Hidden file input for new custom */}
              <input type="file" accept=".pdf,application/pdf" className="hidden"
                ref={(el) => { fileRefs.current["__custom_new__"] = el; }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && customTitle.trim()) {
                    await uploadPdf(customTitle.trim(), file);
                    setCustomTitle("");
                    setAddingCustom(false);
                  }
                  e.target.value = "";
                }}
              />
              <button
                onClick={addCustom}
                disabled={!customTitle.trim() || !!uploading}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 text-sm font-medium"
              >
                <Upload className="w-4 h-4" /> PDF Seç ve Yükle
              </button>
              <p className="text-xs text-gray-500">Sayfa adını yazın, ardından PDF dosyasını seçin.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
