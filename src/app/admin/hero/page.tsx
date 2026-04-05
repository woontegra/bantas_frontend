"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import type { HeroSlide } from "@/lib/api";

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { setSlides(await adminFetch<HeroSlide[]>("/api/hero/slider")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setTitle(""); setTitleEn(""); setSubtitle(""); setSubtitleEn("");
    setCtaText(""); setCtaLink(""); setOrder(slides.length); setImageFile(null);
    setModal(true);
  }

  function openEdit(s: HeroSlide) {
    setEditing(s);
    setTitle(s.title); setTitleEn(s.titleEn ?? "");
    setSubtitle(s.subtitle ?? ""); setSubtitleEn(s.subtitleEn ?? "");
    setCtaText(s.ctaText ?? ""); setCtaLink(s.ctaLink ?? "");
    setOrder(s.order); setImageFile(null);
    setModal(true);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title); fd.append("titleEn", titleEn);
      fd.append("subtitle", subtitle); fd.append("subtitleEn", subtitleEn);
      fd.append("ctaText", ctaText); fd.append("ctaLink", ctaLink);
      fd.append("order", String(order)); fd.append("active", "true");
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminUpload(`/api/hero/slider/${editing.id}`, fd, "PUT");
        showToast("Güncellendi ✓");
      } else {
        await adminUpload("/api/hero/slider", fd);
        showToast("Oluşturuldu ✓");
      }
      setModal(false); load();
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/hero/slider/${id}`, { method: "DELETE" });
    showToast("Silindi ✓"); load();
  }

  function imgUrl(p: string) {
    return p.startsWith("http") ? p : `${API}${p}`;
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hero Slider</h1>
          <p className="mt-0.5 text-sm text-slate-500">Ana sayfa tam ekran slider görselleri</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-muted">
          <Plus className="h-4 w-4" /> Yeni Slide
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-video bg-slate-100">
                {s.image && <img src={imgUrl(s.image)} className="h-full w-full object-cover" alt="" />}
                <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">#{s.order + 1}</span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-800 line-clamp-1">{s.title}</p>
                {s.subtitle && <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{s.subtitle}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(s)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <Pencil className="h-3 w-3" /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
              Henüz slide eklenmemiş.
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">{editing ? "Slide Düzenle" : "Yeni Slide"}</h2>
              <button onClick={() => setModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="label">Görsel</label>
                {editing?.image && !imageFile && (
                  <img src={imgUrl(editing.image)} className="mb-2 h-28 w-full rounded-lg object-cover" alt="" />
                )}
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} className="mb-2 h-28 w-full rounded-lg object-cover" alt="" />
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs text-slate-500 hover:border-brand hover:text-brand">
                  {imageFile ? "Değiştir" : "Görsel Seç"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Başlık (TR)</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} /></div>
                <div><label className="label">Başlık (EN)</label><input className="input" value={titleEn} onChange={e => setTitleEn(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Alt Başlık (TR)</label><input className="input" value={subtitle} onChange={e => setSubtitle(e.target.value)} /></div>
                <div><label className="label">Alt Başlık (EN)</label><input className="input" value={subtitleEn} onChange={e => setSubtitleEn(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Buton Metni</label><input className="input" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="İletişim" /></div>
                <div><label className="label">Buton Linki</label><input className="input" value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="/iletisim" /></div>
              </div>
              <div><label className="label">Sıra</label><input className="input" type="number" value={order} onChange={e => setOrder(Number(e.target.value))} /></div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setModal(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-muted disabled:opacity-60">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
