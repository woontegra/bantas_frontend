"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, getToken } from "@/lib/adminApi";
import {
  Calendar, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, Upload, X, ExternalLink, FileText,
  ChevronDown, ChevronUp, GripVertical, Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface GKDocument { name: string; pdfUrl: string; }
interface GKMeeting {
  title: string; date: string;
  type: "Olağan" | "Olağanüstü";
  documents: GKDocument[];
}
interface PageData { meetings: GKMeeting[]; }

interface ContentPageData { sections?: string; }

const STATIC_MEETINGS: GKMeeting[] = [
  { date: "21.05.2025", type: "Olağan", title: "21.05.2025 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2025-05-21-bilgilendirme.pdf" },
    { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2025-05-21-davetiye.pdf" },
    { name: "Esas Sözleşme Tadil Metni",           pdfUrl: "/uploads/genel-kurul/2025-05-21-esas-sozlesme.pdf" },
  ]},
  { date: "03.07.2024", type: "Olağan", title: "03.07.2024 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2024-07-03-bilgilendirme.pdf" },
    { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2024-07-03-davetiye.pdf" },
    { name: "Oya Sunulan Pay Geri Alım Programı", pdfUrl: "/uploads/genel-kurul/2024-07-03-pay-geri-alim.pdf" },
    { name: "Hazirun",                             pdfUrl: "/uploads/genel-kurul/2024-07-03-hazirun.pdf" },
    { name: "Tutanak",                             pdfUrl: "/uploads/genel-kurul/2024-07-03-tutanak.pdf" },
  ]},
  { date: "27.04.2023", type: "Olağan", title: "27.04.2023 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2023-04-27-bilgilendirme.pdf" },
    { name: "Davetiye Gündem Vekalet",             pdfUrl: "/uploads/genel-kurul/2023-04-27-davetiye.pdf" },
    { name: "Tutanak",                             pdfUrl: "/uploads/genel-kurul/2023-04-27-tutanak.pdf" },
    { name: "Hazirun",                             pdfUrl: "/uploads/genel-kurul/2023-04-27-hazirun.pdf" },
  ]},
  { date: "28.04.2022", type: "Olağan", title: "28.04.2022 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Bilgilendirme Dökümanı", pdfUrl: "/uploads/genel-kurul/2022-04-28-bilgilendirme.pdf" },
    { name: "Gündem-Davetiye-Vekalet",            pdfUrl: "/uploads/genel-kurul/2022-04-28-gundem-davetiye.pdf" },
    { name: "Tutanak",                            pdfUrl: "/uploads/genel-kurul/2022-04-28-tutanak.pdf" },
    { name: "Hazirun",                            pdfUrl: "/uploads/genel-kurul/2022-04-28-hazirun.pdf" },
  ]},
  { date: "29.04.2021", type: "Olağan", title: "29.04.2021 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2021-04-29-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2021-04-29-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2021-04-29-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2021-04-29-hazirun.pdf" },
  ]},
  { date: "04.06.2020", type: "Olağan", title: "04.06.2020 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2020-06-04-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2020-06-04-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2020-06-04-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2020-06-04-hazirun.pdf" },
  ]},
  { date: "03.05.2019", type: "Olağan", title: "03.05.2019 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2019-05-03-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2019-05-03-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2019-05-03-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2019-05-03-hazirun.pdf" },
  ]},
  { date: "04.04.2018", type: "Olağan", title: "04.04.2018 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2018-04-04-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2018-04-04-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2018-04-04-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2018-04-04-hazirun.pdf" },
  ]},
  { date: "25.04.2017", type: "Olağan", title: "25.04.2017 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2017-04-25-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2017-04-25-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2017-04-25-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2017-04-25-hazirun.pdf" },
  ]},
  { date: "14.04.2016", type: "Olağan", title: "14.04.2016 Tarihli Olağan Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2016-04-14-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2016-04-14-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2016-04-14-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2016-04-14-hazirun.pdf" },
  ]},
  { date: "23.12.2015", type: "Olağanüstü", title: "23.12.2015 Tarihli Olağanüstü Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2015-12-23-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2015-12-23-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2015-12-23-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2015-12-23-hazirun.pdf" },
  ]},
  { date: "29.07.2015", type: "Olağanüstü", title: "29.07.2015 Tarihli Olağanüstü Genel Kurul", documents: [
    { name: "Genel Kurul Daveti ve Vekaletname", pdfUrl: "/uploads/genel-kurul/2015-07-29-daveti-vekaletname.pdf" },
    { name: "Bilgilendirme Dökümanı",            pdfUrl: "/uploads/genel-kurul/2015-07-29-bilgilendirme.pdf" },
    { name: "Tutanak",                           pdfUrl: "/uploads/genel-kurul/2015-07-29-tutanak.pdf" },
    { name: "Hazirun",                           pdfUrl: "/uploads/genel-kurul/2015-07-29-hazirun.pdf" },
  ]},
];

export default function GenelKurulAdminPage() {
  const [data, setData]         = useState<PageData>({ meetings: [] });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [uploading, setUploading] = useState<string | null>(null); // "meetIdx-docIdx"

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/genel-kurul");
      if (res?.sections) {
        const sec = JSON.parse(res.sections);
        if (Array.isArray(sec.meetings) && sec.meetings.length > 0) {
          setData({ meetings: sec.meetings });
          return;
        }
      }
      // No saved data → fall back to static meetings
      setData({ meetings: STATIC_MEETINGS });
    } catch {
      // API error → fall back to static meetings
      setData({ meetings: STATIC_MEETINGS });
    }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      const payload = {
        slug: "genel-kurul",
        title: "Genel Kurul Bilgileri",
        sections: JSON.stringify({ meetings: data.meetings }),
      };
      try {
        await adminFetch("/api/content-pages/genel-kurul", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  // Meeting helpers
  function setMeeting<K extends keyof GKMeeting>(idx: number, k: K, v: GKMeeting[K]) {
    setData((p) => { const arr = [...p.meetings]; arr[idx] = { ...arr[idx], [k]: v }; return { ...p, meetings: arr }; });
  }
  function addMeeting() {
    setData((p) => ({
      ...p,
      meetings: [{ title: "", date: "", type: "Olağan", documents: [] }, ...p.meetings],
    }));
    setExpanded(0);
  }
  function removeMeeting(idx: number) {
    setData((p) => ({ ...p, meetings: p.meetings.filter((_, i) => i !== idx) }));
    setExpanded(null);
  }

  // Document helpers
  function setDoc(mIdx: number, dIdx: number, k: keyof GKDocument, v: string) {
    setData((p) => {
      const meetings = [...p.meetings];
      const docs = [...meetings[mIdx].documents];
      docs[dIdx] = { ...docs[dIdx], [k]: v };
      meetings[mIdx] = { ...meetings[mIdx], documents: docs };
      return { ...p, meetings };
    });
  }
  function addDoc(mIdx: number) {
    setData((p) => {
      const meetings = [...p.meetings];
      meetings[mIdx] = { ...meetings[mIdx], documents: [...meetings[mIdx].documents, { name: "", pdfUrl: "" }] };
      return { ...p, meetings };
    });
  }
  function removeDoc(mIdx: number, dIdx: number) {
    setData((p) => {
      const meetings = [...p.meetings];
      meetings[mIdx] = { ...meetings[mIdx], documents: meetings[mIdx].documents.filter((_, i) => i !== dIdx) };
      return { ...p, meetings };
    });
  }

  async function uploadPdf(mIdx: number, dIdx: number, file: File) {
    const key = `${mIdx}-${dIdx}`;
    setUploading(key);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", data.meetings[mIdx].documents[dIdx]?.name || file.name);
      fd.append("category", "genel-kurul");
      fd.append("active", "true");
      const res = await fetch(`${API_URL}/api/pdfs`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setDoc(mIdx, dIdx, "pdfUrl", result.filePath);
    } catch { alert("PDF yüklenemedi."); }
    finally { setUploading(null); }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Genel Kurul Bilgileri</h1>
              <p className="text-sm text-gray-500">Toplantıları ve belgelerini yönetin</p>
            </div>
          </div>
          <a href="/tr/genel-kurul" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Info */}
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          Her toplantıyı açın, belge adlarını girin ve karşısındaki <strong>PDF Yükle</strong> butonuyla dosyayı yükleyin. Toplantılar en üstte listelenir.
        </div>

        {/* Add button */}
        <button onClick={addMeeting}
          className="mb-5 flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
          <Plus className="w-4 h-4" /> Yeni Toplantı Ekle
        </button>

        {/* Meetings list */}
        <div className="space-y-3">
          {data.meetings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-200" />
              <p className="text-sm">Henüz toplantı eklenmedi. Yukarıdan ekleyebilirsiniz.</p>
            </div>
          )}

          {data.meetings.map((meeting, mIdx) => {
            const isOpen = expanded === mIdx;
            const docCount = meeting.documents.length;
            const uploadedCount = meeting.documents.filter((d) => d.pdfUrl).length;

            return (
              <div key={mIdx} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isOpen ? null : mIdx)}
                >
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {meeting.title || <span className="text-gray-400 font-normal italic">Başlıksız toplantı</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {meeting.date && <span className="text-xs text-gray-500">{meeting.date}</span>}
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${meeting.type === "Olağan" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {meeting.type}
                      </span>
                      {docCount > 0 && (
                        <span className="text-xs text-gray-400">{uploadedCount}/{docCount} belge yüklendi</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); removeMeeting(mIdx); }}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5 space-y-5">
                    {/* Meeting info */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className={lbl}>Toplantı Başlığı</label>
                        <input className={inp} value={meeting.title}
                          placeholder="ör. 21.05.2025 Tarihli Olağan Genel Kurul"
                          onChange={(e) => setMeeting(mIdx, "title", e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Tarih</label>
                        <input className={inp} value={meeting.date} placeholder="GG.AA.YYYY"
                          onChange={(e) => setMeeting(mIdx, "date", e.target.value)} />
                      </div>
                      <div>
                        <label className={lbl}>Toplantı Türü</label>
                        <select className={inp} value={meeting.type} onChange={(e) => setMeeting(mIdx, "type", e.target.value as "Olağan" | "Olağanüstü")}>
                          <option value="Olağan">Olağan</option>
                          <option value="Olağanüstü">Olağanüstü</option>
                        </select>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Belgeler</p>
                      <div className="space-y-2">
                        {meeting.documents.map((doc, dIdx) => {
                          const refKey = `${mIdx}-${dIdx}`;
                          const isUp = uploading === refKey;
                          return (
                            <div key={dIdx} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              <FileText className={`w-5 h-5 shrink-0 ${doc.pdfUrl ? "text-indigo-500" : "text-gray-300"}`} />
                              <input
                                className="flex-1 bg-transparent text-sm text-gray-800 focus:outline-none"
                                placeholder="Belge adı (ör. Genel Kurul Bilgilendirme Dökümanı)"
                                value={doc.name}
                                onChange={(e) => setDoc(mIdx, dIdx, "name", e.target.value)}
                              />
                              {/* Status */}
                              {doc.pdfUrl && (
                                <a href={`${API_URL}${doc.pdfUrl.startsWith("/") ? "" : "/"}${doc.pdfUrl}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-xs text-indigo-500 hover:underline shrink-0 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> PDF
                                </a>
                              )}
                              {/* Hidden file input */}
                              <input type="file" accept=".pdf,application/pdf" className="hidden"
                                ref={(el) => { fileRefs.current[refKey] = el; }}
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (f) await uploadPdf(mIdx, dIdx, f);
                                  e.target.value = "";
                                }}
                              />
                              <button
                                onClick={() => fileRefs.current[refKey]?.click()}
                                disabled={isUp}
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition shrink-0 ${
                                  doc.pdfUrl
                                    ? "border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                } disabled:opacity-50`}
                              >
                                {isUp ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                {isUp ? "Yükleniyor…" : doc.pdfUrl ? "Güncelle" : "PDF Yükle"}
                              </button>
                              <button onClick={() => removeDoc(mIdx, dIdx)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={() => addDoc(mIdx)}
                        className="mt-2 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                        <Plus className="w-4 h-4" /> Belge Ekle
                      </button>
                    </div>
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
