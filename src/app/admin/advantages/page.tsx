"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import { Pencil, Trash2, Plus, X, Loader2, GripVertical } from "lucide-react";
import type { Advantage } from "@/lib/api";

const ICON_OPTIONS = [
  "HeartHandshake","CalendarDays","ShieldCheck","Star","Zap","Award",
  "CheckCircle","TrendingUp","Globe","Factory",
];

export default function AdvantagesAdminPage() {
  const [items, setItems] = useState<Advantage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Advantage | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [icon, setIcon] = useState("ShieldCheck");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [order, setOrder] = useState(0);

  async function load() {
    setLoading(true);
    try { setItems(await adminFetch<Advantage[]>("/api/advantages")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setIcon("ShieldCheck"); setTitle(""); setTitleEn("");
    setDescription(""); setDescriptionEn(""); setOrder(items.length);
    setModal(true);
  }

  function openEdit(a: Advantage) {
    setEditing(a);
    setIcon(a.icon); setTitle(a.title); setTitleEn(a.titleEn ?? "");
    setDescription(a.description); setDescriptionEn(a.descriptionEn ?? "");
    setOrder(a.order);
    setModal(true);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleSave() {
    setSaving(true);
    const body = { icon, title, titleEn, description, descriptionEn, order, active: true };
    try {
      if (editing) {
        await adminFetch(`/api/advantages/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
        showToast("Güncellendi ✓");
      } else {
        await adminFetch("/api/advantages", { method: "POST", body: JSON.stringify(body) });
        showToast("Oluşturuldu ✓");
      }
      setModal(false); load();
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/advantages/${id}`, { method: "DELETE" });
    showToast("Silindi ✓"); load();
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">{toast}</div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Avantajlar / Özellikler</h1>
          <p className="mt-0.5 text-sm text-slate-500">Ana sayfadaki 3 ikonlu özellik bloğu</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-muted">
          <Plus className="h-4 w-4" /> Yeni Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Sıra</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">İkon</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Başlık</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Açıklama</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">{a.order}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{a.icon}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{a.title}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-500">{a.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(a.id)} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">Henüz avantaj eklenmemiş.</p>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">{editing ? "Düzenle" : "Yeni Avantaj"}</h2>
              <button onClick={() => setModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="label">İkon Adı</label>
                <select className="input" value={icon} onChange={e => setIcon(e.target.value)}>
                  {ICON_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Başlık (TR)</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} /></div>
                <div><label className="label">Başlık (EN)</label><input className="input" value={titleEn} onChange={e => setTitleEn(e.target.value)} /></div>
              </div>
              <div><label className="label">Açıklama (TR)</label><textarea className="input resize-none" rows={2} value={description} onChange={e => setDescription(e.target.value)} /></div>
              <div><label className="label">Açıklama (EN)</label><textarea className="input resize-none" rows={2} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} /></div>
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
