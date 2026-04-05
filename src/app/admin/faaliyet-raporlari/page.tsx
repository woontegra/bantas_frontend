"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, getToken } from "@/lib/adminApi";
import {
  FileBarChart2, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, Upload, X, ExternalLink, FileText,
  ChevronDown, ChevronUp, Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FRReport { title: string; pdfUrl: string; }
interface FRYear { year: string; reports: FRReport[]; }
interface PageData { years: FRYear[]; }
interface ContentPageData { sections?: string; }

const STATIC_YEARS: FRYear[] = [
  { year: "2025", reports: [
    { title: "2025 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2025-yil.pdf" },
    { title: "2025 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-9-aylik.pdf" },
    { title: "2025 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-6-aylik.pdf" },
    { title: "2025 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2025-3-aylik.pdf" },
  ]},
  { year: "2024", reports: [
    { title: "2024 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2024-yil.pdf" },
    { title: "2024 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-9-aylik.pdf" },
    { title: "2024 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-6-aylik.pdf" },
    { title: "2024 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2024-3-aylik.pdf" },
  ]},
  { year: "2023", reports: [
    { title: "2023 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2023-yil.pdf" },
    { title: "2023 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-9-aylik.pdf" },
    { title: "2023 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-6-aylik.pdf" },
    { title: "2023 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2023-3-aylik.pdf" },
  ]},
  { year: "2022", reports: [
    { title: "2022 Yılı Faaliyet Raporu",       pdfUrl: "/uploads/faaliyet-raporlari/2022-yil.pdf" },
    { title: "2022 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-9-aylik.pdf" },
    { title: "2022 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-6-aylik.pdf" },
    { title: "2022 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2022-3-aylik.pdf" },
  ]},
  { year: "2021", reports: [
    { title: "2021 - 12 Aylık Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2021-12-aylik.pdf" },
    { title: "2021 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-9-aylik.pdf" },
    { title: "2021 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-6-aylik.pdf" },
    { title: "2021 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2021-3-aylik.pdf" },
  ]},
  { year: "2020", reports: [
    { title: "2020 - 12 Aylık Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2020-12-aylik.pdf" },
    { title: "2020 - 9 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-9-aylik.pdf" },
    { title: "2020 - 6 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-6-aylik.pdf" },
    { title: "2020 - 3 Aylık Faaliyet Raporu",  pdfUrl: "/uploads/faaliyet-raporlari/2020-3-aylik.pdf" },
  ]},
  { year: "2019", reports: [{ title: "2019 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2019-yil.pdf" }] },
  { year: "2018", reports: [{ title: "2018 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2018-yil.pdf" }] },
  { year: "2017", reports: [{ title: "2017 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2017-yil.pdf" }] },
  { year: "2016", reports: [{ title: "2016 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2016-yil.pdf" }] },
  { year: "2015", reports: [{ title: "2015 Yılı Faaliyet Raporu", pdfUrl: "/uploads/faaliyet-raporlari/2015-yil.pdf" }] },
];

export default function FaaliyetRaporlariAdminPage() {
  const [data, setData]           = useState<PageData>({ years: [] });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [status, setStatus]       = useState<"idle" | "success" | "error">("idle");
  const [expanded, setExpanded]   = useState<number | null>(0);
  const [uploading, setUploading] = useState<string | null>(null);

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/faaliyet-raporlari");
      if (res?.sections) {
        const sec = JSON.parse(res.sections);
        if (Array.isArray(sec.years) && sec.years.length > 0) {
          setData({ years: sec.years });
          return;
        }
      }
      setData({ years: STATIC_YEARS });
    } catch { setData({ years: STATIC_YEARS }); }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      const payload = {
        slug: "faaliyet-raporlari",
        title: "Faaliyet Raporları",
        sections: JSON.stringify({ years: data.years }),
      };
      try {
        await adminFetch("/api/content-pages/faaliyet-raporlari", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  function setYear<K extends keyof FRYear>(idx: number, k: K, v: FRYear[K]) {
    setData((p) => { const arr = [...p.years]; arr[idx] = { ...arr[idx], [k]: v }; return { ...p, years: arr }; });
  }
  function addYear() {
    const newYear = String(new Date().getFullYear());
    setData((p) => ({ ...p, years: [{ year: newYear, reports: [] }, ...p.years] }));
    setExpanded(0);
  }
  function removeYear(idx: number) {
    setData((p) => ({ ...p, years: p.years.filter((_, i) => i !== idx) }));
    setExpanded(null);
  }
  function setReport(yIdx: number, rIdx: number, k: keyof FRReport, v: string) {
    setData((p) => {
      const years = [...p.years];
      const reports = [...years[yIdx].reports];
      reports[rIdx] = { ...reports[rIdx], [k]: v };
      years[yIdx] = { ...years[yIdx], reports };
      return { ...p, years };
    });
  }
  function addReport(yIdx: number) {
    setData((p) => {
      const years = [...p.years];
      years[yIdx] = { ...years[yIdx], reports: [...years[yIdx].reports, { title: "", pdfUrl: "" }] };
      return { ...p, years };
    });
  }
  function removeReport(yIdx: number, rIdx: number) {
    setData((p) => {
      const years = [...p.years];
      years[yIdx] = { ...years[yIdx], reports: years[yIdx].reports.filter((_, i) => i !== rIdx) };
      return { ...p, years };
    });
  }

  async function uploadPdf(yIdx: number, rIdx: number, file: File) {
    const key = `${yIdx}-${rIdx}`;
    setUploading(key);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", data.years[yIdx].reports[rIdx]?.title || file.name);
      fd.append("category", "faaliyet-raporlari");
      fd.append("active", "true");
      const res = await fetch(`${API_URL}/api/pdfs`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setReport(yIdx, rIdx, "pdfUrl", result.filePath);
    } catch { alert("PDF yüklenemedi."); }
    finally { setUploading(null); }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FileBarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faaliyet Raporları</h1>
              <p className="text-sm text-gray-500">Yıllara göre raporları ve PDF dosyalarını yönetin</p>
            </div>
          </div>
          <a href="/tr/faaliyet-raporlari" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Info */}
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          Her yılı açın, rapor başlığını girin ve <strong>PDF Yükle</strong> butonuyla dosyayı yükleyin. Yeni yıl ekleyebilirsiniz.
        </div>

        {/* Add year */}
        <button onClick={addYear}
          className="mb-5 flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
          <Plus className="w-4 h-4" /> Yeni Yıl Ekle
        </button>

        {/* Year list */}
        <div className="space-y-3">
          {data.years.map((yd, yIdx) => {
            const isOpen = expanded === yIdx;
            const uploaded = yd.reports.filter((r) => r.pdfUrl).length;
            return (
              <div key={yIdx} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Year row */}
                <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isOpen ? null : yIdx)}>
                  <div className="flex h-9 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                    <span className="text-sm font-bold text-indigo-700">{yd.year}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{yd.year} Yılı</p>
                    <p className="text-xs text-gray-400 mt-0.5">{uploaded}/{yd.reports.length} rapor yüklendi</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); removeYear(yIdx); }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 space-y-3">
                    {/* Year value */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-gray-600 w-16 shrink-0">Yıl</label>
                      <input className={`${inp} w-32`} value={yd.year}
                        onChange={(e) => setYear(yIdx, "year", e.target.value)} />
                    </div>

                    {/* Reports */}
                    <div className="space-y-2">
                      {yd.reports.map((rep, rIdx) => {
                        const refKey = `${yIdx}-${rIdx}`;
                        const isUp = uploading === refKey;
                        return (
                          <div key={rIdx} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <FileText className={`w-5 h-5 shrink-0 ${rep.pdfUrl ? "text-indigo-500" : "text-gray-300"}`} />
                            <input
                              className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
                              placeholder="Rapor adı (ör. 2025 Yılı Faaliyet Raporu)"
                              value={rep.title}
                              onChange={(e) => setReport(yIdx, rIdx, "title", e.target.value)}
                            />
                            {rep.pdfUrl && (
                              <a href={`${API_URL}${rep.pdfUrl.startsWith("/") ? "" : "/"}${rep.pdfUrl}`}
                                target="_blank" rel="noopener noreferrer"
                                className="text-xs text-indigo-500 hover:underline shrink-0 flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> PDF
                              </a>
                            )}
                            <input type="file" accept=".pdf,application/pdf" className="hidden"
                              ref={(el) => { fileRefs.current[refKey] = el; }}
                              onChange={async (e) => {
                                const f = e.target.files?.[0];
                                if (f) await uploadPdf(yIdx, rIdx, f);
                                e.target.value = "";
                              }}
                            />
                            <button
                              onClick={() => fileRefs.current[refKey]?.click()}
                              disabled={isUp}
                              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition shrink-0 ${
                                rep.pdfUrl
                                  ? "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                              } disabled:opacity-50`}
                            >
                              {isUp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              {isUp ? "…" : rep.pdfUrl ? "Güncelle" : "PDF Yükle"}
                            </button>
                            <button onClick={() => removeReport(yIdx, rIdx)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button onClick={() => addReport(yIdx)}
                      className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                      <Plus className="w-4 h-4" /> Rapor Ekle
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save bar */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>}
          {status === "error"   && <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>}
          {status === "idle"    && <span className="text-xs text-gray-400">PDF yükledikten sonra kaydedin.</span>}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 font-medium text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
