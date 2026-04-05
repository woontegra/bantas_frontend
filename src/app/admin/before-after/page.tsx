"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import type { BeforeAfterItem } from "@/lib/api";

export default function BeforeAfterAdminPage() {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BeforeAfterItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);

  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<BeforeAfterItem[]>("/api/before-after");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setTitle(""); setTitleEn(""); setDescription(""); setDescriptionEn("");
    setBeforeFile(null); setAfterFile(null);
    setModalOpen(true);
  }

  function openEdit(item: BeforeAfterItem) {
    setEditing(item);
    setTitle(item.title); setTitleEn(item.titleEn ?? "");
    setDescription(item.description ?? ""); setDescriptionEn(item.descriptionEn ?? "");
    setBeforeFile(null); setAfterFile(null);
    setModalOpen(true);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("titleEn", titleEn);
      fd.append("description", description);
      fd.append("descriptionEn", descriptionEn);
      fd.append("active", "true");
      if (beforeFile) fd.append("beforeImage", beforeFile);
      if (afterFile) fd.append("afterImage", afterFile);

      if (editing) {
        await adminUpload(`/api/before-after/${editing.id}`, fd, "PUT");
        showToast("Güncellendi ✓");
      } else {
        await adminUpload("/api/before-after", fd);
        showToast("Oluşturuldu ✓");
      }
      setModalOpen(false);
      load();
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/before-after/${id}`, { method: "DELETE" });
    showToast("Silindi ✓");
    load();
  }

  function imgUrl(p: string) {
    if (!p) return "";
    return p.startsWith("http") ? p : `${API}${p}`;
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Before / After</h1>
          <p className="mt-0.5 text-sm text-slate-500">Kalite bölümündeki karşılaştırma görselleri</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-muted"
        >
          <Plus className="h-4 w-4" /> Yeni Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
          Henüz before/after görseli eklenmemiş. "Yeni Ekle" butonuna tıklayın.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-2">
                <div className="relative aspect-square bg-slate-100">
                  {item.beforeImage && (
                    <img src={imgUrl(item.beforeImage)} alt="Before" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">Önce</span>
                </div>
                <div className="relative aspect-square bg-slate-100">
                  {item.afterImage && (
                    <img src={imgUrl(item.afterImage)} alt="After" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute bottom-1 right-1 rounded bg-brand/80 px-1.5 py-0.5 text-[10px] text-white">Sonra</span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                {item.description && <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.description}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                {editing ? "Düzenle" : "Yeni Before/After"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Başlık (TR)</label>
                  <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                  <label className="label">Başlık (EN)</label>
                  <input className="input" value={titleEn} onChange={e => setTitleEn(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Açıklama (TR)</label>
                <textarea className="input resize-none" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="label">Açıklama (EN)</label>
                <textarea className="input resize-none" rows={2} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Boş Teneke Görseli (Önce)</label>
                  {editing?.beforeImage && !beforeFile && (
                    <img src={imgUrl(editing.beforeImage)} className="mb-2 h-24 w-full rounded-lg object-cover" alt="" />
                  )}
                  {beforeFile && (
                    <img src={URL.createObjectURL(beforeFile)} className="mb-2 h-24 w-full rounded-lg object-cover" alt="" />
                  )}
                  <input ref={beforeRef} type="file" accept="image/*" className="hidden" onChange={e => setBeforeFile(e.target.files?.[0] ?? null)} />
                  <button
                    type="button"
                    onClick={() => beforeRef.current?.click()}
                    className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs text-slate-500 hover:border-brand hover:text-brand"
                  >
                    {beforeFile ? "Değiştir" : "Görsel Seç"}
                  </button>
                </div>
                <div>
                  <label className="label">Baskılı Teneke Görseli (Sonra)</label>
                  {editing?.afterImage && !afterFile && (
                    <img src={imgUrl(editing.afterImage)} className="mb-2 h-24 w-full rounded-lg object-cover" alt="" />
                  )}
                  {afterFile && (
                    <img src={URL.createObjectURL(afterFile)} className="mb-2 h-24 w-full rounded-lg object-cover" alt="" />
                  )}
                  <input ref={afterRef} type="file" accept="image/*" className="hidden" onChange={e => setAfterFile(e.target.files?.[0] ?? null)} />
                  <button
                    type="button"
                    onClick={() => afterRef.current?.click()}
                    className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs text-slate-500 hover:border-brand hover:text-brand"
                  >
                    {afterFile ? "Değiştir" : "Görsel Seç"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-muted disabled:opacity-60"
              >
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
