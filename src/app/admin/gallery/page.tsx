"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  Star,
  Upload,
  GalleryHorizontal,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
interface GalleryImg {
  id: string;
  image: string;
  title?: string;
  description?: string;
}

interface Featured {
  id: string;
  image: string;
  title: string;
  description?: string;
  type: string;
}

function imgUrl(p?: string | null) {
  if (!p) return "";
  return p.startsWith("http") ? p : `${API}${p}`;
}

/* ── Page ───────────────────────────────────────────────── */
export default function GalleryAdminPage() {
  const [tab, setTab] = useState<"images" | "featured">("images");
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Galeri</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Galeri görselleri ve öne çıkan içerik
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setTab("images")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "images"
              ? "bg-white text-brand shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <GalleryHorizontal className="h-4 w-4" />
          Galeri Görselleri
        </button>
        <button
          type="button"
          onClick={() => setTab("featured")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "featured"
              ? "bg-white text-brand shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Star className="h-4 w-4" />
          Öne Çıkan Görsel
        </button>
      </div>

      {tab === "images" ? (
        <GalleryImagesTab showToast={showToast} />
      ) : (
        <FeaturedTab showToast={showToast} />
      )}
    </AdminShell>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 1 — Galeri Görselleri
   ══════════════════════════════════════════════════════════ */
function GalleryImagesTab({ showToast }: { showToast: (m: string) => void }) {
  const [images, setImages] = useState<GalleryImg[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const imgs = await adminFetch<GalleryImg[]>("/api/gallery/images");
      setImages(imgs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreview("");
    setModal(true);
  }

  async function handleSave() {
    if (!file) return showToast("Lütfen bir görsel seçin.");
    setSaving(true);
    const fd = new FormData();
    fd.append("image", file);
    if (title) fd.append("title", title);
    if (description) fd.append("description", description);
    try {
      await adminUpload("/api/gallery/images", fd);
      showToast("Görsel eklendi ✓");
      setModal(false);
      load();
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    try {
      await adminFetch(`/api/gallery/images/${id}`, { method: "DELETE" });
      showToast("Silindi ✓");
      load();
    } catch (e) {
      showToast((e as Error).message);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{images.length} görsel</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-muted"
        >
          <Plus className="h-4 w-4" /> Görsel Ekle
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <GalleryHorizontal className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm text-slate-400">Henüz görsel eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 shadow"
            >
              <img
                src={imgUrl(img.image)}
                alt={img.title ?? ""}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.3";
                }}
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 transition-all duration-200 group-hover:bg-black/50">
                {/* Delete */}
                <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    className="rounded-full bg-red-500 p-1.5 text-white shadow hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Info */}
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  {img.title && (
                    <p className="line-clamp-1 text-xs font-semibold text-white">
                      {img.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">Görsel Ekle</h2>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Image picker */}
              <div>
                <label className="label">Görsel *</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
                  }}
                />
                {preview ? (
                  <div className="relative mb-2 overflow-hidden rounded-xl">
                    <img
                      src={preview}
                      alt=""
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreview("");
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 text-slate-400 transition hover:border-brand hover:text-brand"
                  >
                    <Upload className="h-7 w-7" />
                    <span className="text-sm">Tıklayın veya sürükleyin</span>
                  </button>
                )}
                {file && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-1 text-xs text-brand hover:underline"
                  >
                    Değiştir
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="label">Başlık (isteğe bağlı)</label>
                <input
                  className="input"
                  placeholder="Görsel başlığı…"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="label">Açıklama (isteğe bağlı)</label>
                <textarea
                  className="input resize-none"
                  rows={2}
                  placeholder="Kısa açıklama…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !file}
                className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-muted disabled:opacity-60"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {saving ? "Yükleniyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 2 — Öne Çıkan Görsel (management board)
   ══════════════════════════════════════════════════════════ */
function FeaturedTab({ showToast }: { showToast: (m: string) => void }) {
  const [featured, setFeatured] = useState<Featured | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<Featured>(
        "/api/gallery-featured/type/management_board",
      );
      setFeatured(data);
      setTitle(data.title ?? "");
      setDescription(data.description ?? "");
    } catch {
      setFeatured(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave() {
    if (!file && !featured) return showToast("Lütfen bir görsel seçin.");
    setSaving(true);
    const fd = new FormData();
    fd.append("title", title || "Yönetim Kurulu");
    fd.append("type", "management_board");
    if (description) fd.append("description", description);
    if (file) fd.append("image", file);
    try {
      if (featured) {
        await adminUpload(`/api/gallery-featured/${featured.id}`, fd, "PUT");
        showToast("Güncellendi ✓");
      } else {
        await adminUpload("/api/gallery-featured", fd);
        showToast("Oluşturuldu ✓");
      }
      setFile(null);
      setPreview("");
      load();
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!featured) return;
    if (!confirm("Öne çıkan görseli silmek istediğinize emin misiniz?")) return;
    try {
      await adminFetch(`/api/gallery-featured/${featured.id}`, {
        method: "DELETE",
      });
      showToast("Silindi ✓");
      setFeatured(null);
      setTitle("");
      setDescription("");
    } catch (e) {
      showToast((e as Error).message);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Öne Çıkan Görsel</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Galeri sayfasının üstünde büyük olarak gösterilir (örn. Yönetim
            Kurulu fotoğrafı).
          </p>
        </div>
        {featured && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Sil
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Current image preview */}
          {featured?.image && !preview && (
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">
                Mevcut Görsel
              </p>
              <img
                src={imgUrl(featured.image)}
                alt={featured.title}
                className="max-h-72 w-full rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.style.opacity = "0.3";
                }}
              />
            </div>
          )}

          {/* New image picker */}
          <div>
            <label className="label">
              {featured ? "Yeni Görsel (değiştirmek için)" : "Görsel *"}
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
            />
            {preview ? (
              <div className="relative mb-2 overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt=""
                  className="max-h-72 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-slate-400 transition hover:border-brand hover:text-brand"
              >
                <Upload className="h-6 w-6" />
                <span className="text-sm">
                  {featured ? "Görsel değiştirmek için tıklayın" : "Görsel seçin"}
                </span>
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="label">Başlık</label>
            <input
              className="input"
              placeholder="Yönetim Kurulu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Açıklama (isteğe bağlı)</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Kısa açıklama…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-muted disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Kaydediliyor…" : featured ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
