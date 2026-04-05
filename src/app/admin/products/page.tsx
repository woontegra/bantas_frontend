"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";
import type { HomeProductCategory } from "@/lib/api";

export default function ProductsAdminPage() {
  const [items, setItems] = useState<HomeProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<HomeProductCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { setItems(await adminFetch<HomeProductCategory[]>("/api/home-product-categories")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setName(""); setNameEn(""); setDescription(""); setDescriptionEn("");
    setLink(""); setOrder(items.length); setImageFile(null);
    setModal(true);
  }

  function openEdit(i: HomeProductCategory) {
    setEditing(i);
    setName(i.name); setNameEn(i.nameEn ?? "");
    setDescription(i.description ?? ""); setDescriptionEn(i.descriptionEn ?? "");
    setLink(i.link ?? ""); setOrder(i.order); setImageFile(null);
    setModal(true);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", name); fd.append("nameEn", nameEn);
      fd.append("description", description); fd.append("descriptionEn", descriptionEn);
      fd.append("link", link); fd.append("order", String(order)); fd.append("active", "true");
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await adminUpload(`/api/home-product-categories/${editing.id}`, fd, "PUT");
        showToast("Güncellendi ✓");
      } else {
        await adminUpload("/api/home-product-categories", fd);
        showToast("Oluşturuldu ✓");
      }
      setModal(false); load();
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/home-product-categories/${id}`, { method: "DELETE" });
    showToast("Silindi ✓"); load();
  }

  function imgUrl(p?: string | null) {
    if (!p) return "";
    return p.startsWith("http") ? p : `${API}${p}`;
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ürün Kategorileri</h1>
          <p className="mt-0.5 text-sm text-slate-500">Ana sayfadaki 4 ürün kartı</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-muted">
          <Plus className="h-4 w-4" /> Yeni Kategori
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square bg-slate-100">
                {item.image && <img src={imgUrl(item.image)} className="h-full w-full object-cover" alt="" />}
              </div>
              <div className="p-3">
                <p className="font-semibold text-slate-800">{item.name}</p>
                {item.nameEn && <p className="text-xs text-slate-400">{item.nameEn}</p>}
                <div className="mt-2 flex gap-1.5">
                  <button onClick={() => openEdit(item)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
                    <Pencil className="h-3 w-3" /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
              Henüz kategori eklenmemiş.
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">{editing ? "Düzenle" : "Yeni Kategori"}</h2>
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
                <div><label className="label">Ad (TR)</label><input className="input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div><label className="label">Ad (EN)</label><input className="input" value={nameEn} onChange={e => setNameEn(e.target.value)} /></div>
              </div>
              <div><label className="label">Açıklama (TR)</label><textarea className="input resize-none" rows={2} value={description} onChange={e => setDescription(e.target.value)} /></div>
              <div><label className="label">Açıklama (EN)</label><textarea className="input resize-none" rows={2} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} /></div>
              <div><label className="label">Link</label><input className="input" value={link} onChange={e => setLink(e.target.value)} placeholder="/urunler/zeytin-tenekeleri" /></div>
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
