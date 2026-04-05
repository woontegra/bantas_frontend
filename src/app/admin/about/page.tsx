"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";
import type { AboutSection } from "@/lib/api";

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [img1File, setImg1File] = useState<File | null>(null);
  const [img2File, setImg2File] = useState<File | null>(null);
  const [img3File, setImg3File] = useState<File | null>(null);
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const raw = await adminFetch<AboutSection | AboutSection[] | null>(
        "/api/about",
      );
      const list = !raw ? [] : Array.isArray(raw) ? raw : [raw];
      const item = list[0] ?? null;
      setData(item);
      if (item) {
        setTitle(item.title); setTitleEn(item.titleEn ?? "");
        setContent(item.content); setContentEn(item.contentEn ?? "");
      }
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function imgUrl(p?: string | null) {
    if (!p) return "";
    return p.startsWith("http") ? p : `${API}${p}`;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title); fd.append("titleEn", titleEn);
      fd.append("content", content); fd.append("contentEn", contentEn);
      fd.append("active", "true");
      if (img1File) fd.append("image1", img1File);
      if (img2File) fd.append("image2", img2File);
      if (img3File) fd.append("image3", img3File);

      if (data) {
        await adminUpload(`/api/about/${data.id}`, fd, "PUT");
      } else {
        await adminUpload("/api/about", fd);
      }
      showToast("Kaydedildi ✓");
      setImg1File(null); setImg2File(null); setImg3File(null);
      load();
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  const imgInputs = [
    { ref: ref1, file: img1File, setFile: setImg1File, src: data?.image1, label: "Görsel 1" },
    { ref: ref2, file: img2File, setFile: setImg2File, src: data?.image2, label: "Görsel 2" },
    { ref: ref3, file: img3File, setFile: setImg3File, src: data?.image3, label: "Görsel 3" },
  ];

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Hakkımızda</h1>
        <p className="mt-0.5 text-sm text-slate-500">Ana sayfadaki şirket tanıtım bölümü</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-800">Metin İçeriği</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label">Başlık (TR)</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><label className="label">Başlık (EN)</label><input className="input" value={titleEn} onChange={e => setTitleEn(e.target.value)} /></div>
            </div>
            <div className="mt-4"><label className="label">İçerik (TR)</label><textarea className="input resize-none" rows={5} value={content} onChange={e => setContent(e.target.value)} /></div>
            <div className="mt-4"><label className="label">İçerik (EN)</label><textarea className="input resize-none" rows={5} value={contentEn} onChange={e => setContentEn(e.target.value)} /></div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-slate-800">Görsel Kolaj (3 görsel)</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {imgInputs.map(({ ref, file, setFile, src, label }) => (
                <div key={label}>
                  <label className="label">{label}</label>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    {(file ? URL.createObjectURL(file) : imgUrl(src)) && (
                      <img
                        src={file ? URL.createObjectURL(file) : imgUrl(src)}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                  <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                  <button type="button" onClick={() => ref.current?.click()} className="mt-2 w-full rounded-lg border border-dashed border-slate-300 py-1.5 text-xs text-slate-500 hover:border-brand hover:text-brand">
                    {file ? "Değiştir" : "Görsel Seç"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-muted disabled:opacity-60">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
