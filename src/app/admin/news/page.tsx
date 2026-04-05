"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  Newspaper,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Bold,
  Heading2,
  Heading3,
  List,
  ImagePlus,
  Link2,
  Quote,
} from "lucide-react";
import type { NewsItem } from "@/lib/api";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}

function imgUrl(p?: string | null) {
  if (!p) return "";
  return p.startsWith("http") ? p : `${API}${p}`;
}

/* ── Mini Content Toolbar ─────────────────────────────────────── */
function ContentToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
}) {
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  /** Insert HTML snippet at current cursor position.
   *  Always reads el.value from DOM to avoid stale-closure issues
   *  (especially after async uploads). */
  function insert(before: string, after = "") {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    const start = el.selectionStart ?? el.value.length;
    const end   = el.selectionEnd   ?? el.value.length;
    const current  = el.value; // read live value from DOM
    const selected = current.slice(start, end);
    const next = current.slice(0, start) + before + selected + after + current.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cur = start + before.length;
      el.setSelectionRange(cur, cur + selected.length);
    });
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminUpload("/api/upload", fd) as any;
      const url: string = res?.url ? imgUrl(res.url) : "";
      if (url) {
        // Sync React state from DOM before inserting, then insert
        if (textareaRef.current) {
          onChange(textareaRef.current.value);
          await new Promise((r) => setTimeout(r, 0)); // flush state
        }
        insert(
          `\n<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;" />\n`,
        );
      } else {
        alert("Görsel yüklendi ama URL alınamadı.");
      }
    } catch {
      alert("Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (imgInputRef.current) imgInputRef.current.value = "";
    }
  }

  const tools = [
    {
      icon: Bold,
      title: "Kalın",
      action: () => insert("<strong>", "</strong>"),
    },
    {
      icon: Heading2,
      title: "Başlık H2",
      action: () => insert("<h2>", "</h2>"),
    },
    {
      icon: Heading3,
      title: "Başlık H3",
      action: () => insert("<h3>", "</h3>"),
    },
    {
      icon: List,
      title: "Madde listesi",
      action: () => insert("<ul>\n  <li>", "</li>\n</ul>"),
    },
    {
      icon: Quote,
      title: "Alıntı",
      action: () => insert("<blockquote>", "</blockquote>"),
    },
    {
      icon: Link2,
      title: "Bağlantı",
      action: () => insert('<a href="URL">', "</a>"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-b-0 border-slate-200 bg-slate-50 px-2 py-1.5">
      {tools.map(({ icon: Icon, title, action }) => (
        <button
          key={title}
          type="button"
          title={title}
          onClick={action}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}

      {/* divider */}
      <div className="mx-1 h-5 w-px bg-slate-300" />

      {/* Image upload */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageUpload(f);
        }}
      />
      <button
        type="button"
        title="Görsel Ekle"
        disabled={uploading}
        onClick={() => imgInputRef.current?.click()}
        className="flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImagePlus className="h-3.5 w-3.5" />
        )}
        {uploading ? "Yükleniyor…" : "Görsel Ekle"}
      </button>
    </div>
  );
}

/* ── İçeriğe gömülü resimlerin önizleme çubuğu ───────────────── */
function InlineImagePreview({
  content,
  onChange,
}: {
  content: string;
  onChange: (v: string) => void;
}) {
  const srcs = useMemo(() => {
    const matches: string[] = [];
    const re = /<img[^>]+src="([^"]+)"/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) matches.push(m[1]);
    return matches;
  }, [content]);

  if (srcs.length === 0) return null;

  function removeImage(src: string) {
    // <img ... src="SRC" ... /> satırını sil
    const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const next = content.replace(
      new RegExp(`\\n?<img[^>]*src="${escaped}"[^>]*\\/?>`,"gi"),
      "",
    );
    onChange(next);
  }

  return (
    <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
      <p className="mb-2 text-xs font-semibold text-indigo-700">
        İçeriğe gömülü görseller ({srcs.length})
      </p>
      <div className="flex flex-wrap gap-3">
        {srcs.map((src, i) => (
          <div key={i} className="group relative">
            <img
              src={src}
              alt=""
              className="h-16 w-24 rounded-lg border border-indigo-200 object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; }}
            />
            <button
              type="button"
              onClick={() => removeImage(src)}
              title="Görseli içerikten kaldır"
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="mt-1 max-w-[96px] truncate text-[10px] text-indigo-500">
              Görsel {i + 1}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  /* form */
  const [title, setTitle]         = useState("");
  const [titleEn, setTitleEn]     = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [content, setContent]     = useState("");
  const [contentEn, setContentEn] = useState("");
  const [category, setCategory]   = useState("");
  const [slug, setSlug]           = useState("");
  const [featured, setFeatured]   = useState(false);
  const [active, setActive]       = useState(true);
  const [publishedAt, setPublishedAt] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileRef        = useRef<HTMLInputElement>(null);
  const contentRef     = useRef<HTMLTextAreaElement>(null);
  const contentEnRef   = useRef<HTMLTextAreaElement>(null);

  async function load() {
    setLoading(true);
    try { setItems(await adminFetch<NewsItem[]>("/api/news")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function openNew() {
    setEditing(null);
    setTitle(""); setTitleEn(""); setExcerpt(""); setExcerptEn("");
    setContent(""); setContentEn(""); setCategory(""); setSlug("");
    setFeatured(false); setActive(true);
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setImageFile(null);
    setModal(true);
  }

  function openEdit(item: NewsItem) {
    setEditing(item);
    setTitle(item.title); setTitleEn(item.titleEn ?? "");
    setExcerpt(item.excerpt ?? ""); setExcerptEn(item.excerptEn ?? "");
    setContent(item.content); setContentEn(item.contentEn ?? "");
    setCategory(item.category ?? ""); setSlug(item.slug);
    setFeatured(item.featured); setActive(item.active);
    setPublishedAt(item.publishedAt ? item.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
    setImageFile(null);
    setModal(true);
  }

  async function handleSave() {
    if (!title.trim()) { showToast("Başlık zorunlu"); return; }
    setSaving(true);
    try {
      // 1) Kapak görseli varsa önce yükle
      let imageUrl: string | null = editing?.image ?? null;
      if (imageFile) {
        const fd = new FormData();
        fd.append("file", imageFile);
        const uploaded = await adminUpload("/api/upload", fd) as any;
        if (uploaded?.url) imageUrl = uploaded.url;
      }

      // 2) Haberi JSON olarak kaydet (backend req.body bekliyor)
      const body = {
        title,
        titleEn: titleEn || null,
        excerpt: excerpt || null,
        excerptEn: excerptEn || null,
        content,
        contentEn: contentEn || null,
        category: category || null,
        slug: slug.trim() ? slug : slugify(title),
        featured,
        active,
        image: imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      };

      if (editing) {
        await adminFetch(`/api/news/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        showToast("Güncellendi ✓");
      } else {
        await adminFetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        showToast("Oluşturuldu ✓");
      }
      setModal(false); load();
    } catch (e) { showToast((e as Error).message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/news/${id}`, { method: "DELETE" });
    showToast("Silindi ✓"); load();
  }

  async function toggleActive(item: NewsItem) {
    try {
      await adminFetch(`/api/news/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !item.active }),
      });
      load();
    } catch (e) { showToast((e as Error).message); }
  }

  /* ─────────────────────────────────────────────────── */
  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Newspaper className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Haberler</h1>
            <p className="mt-0.5 text-sm text-slate-500">Haber ve duyurularınızı buradan yönetin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/tr/haberler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Sayfayı Gör
          </a>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Yeni Haber
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      {!loading && items.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm">
            <span className="font-bold text-slate-900">{items.length}</span>
            <span className="text-slate-500">Toplam haber</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm">
            <span className="font-bold text-emerald-700">{items.filter(n => n.active).length}</span>
            <span className="text-emerald-600">Yayında</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-bold text-amber-700">{items.filter(n => n.featured).length}</span>
            <span className="text-amber-600">Öne çıkan</span>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Görsel</th>
                <th className="px-4 py-3 font-medium">Başlık</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Tarih</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="h-12 w-16 overflow-hidden rounded-xl bg-slate-100">
                      {item.image ? (
                        <img src={imgUrl(item.image)} className="h-full w-full object-cover" alt="" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Newspaper className="h-5 w-5 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-1 font-medium text-slate-800">
                      {item.title}
                      {item.featured && <Star className="ml-1.5 inline-block h-3.5 w-3.5 text-amber-400" />}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {item.category ? (
                      <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        {item.category}
                      </span>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{fmt(item.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(item)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:opacity-80 ${
                        item.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.active ? <><Eye className="h-3 w-3" /> Yayında</> : <><EyeOff className="h-3 w-3" /> Taslak</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <Newspaper className="mb-3 h-12 w-12 text-slate-200" />
              <p className="font-medium text-slate-500">Henüz haber eklenmemiş</p>
            </div>
          )}
        </div>
      )}

      {/* ══ Modal ══════════════════════════════════════════════════ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Haberi Düzenle" : "Yeni Haber Ekle"}
              </h2>
              <button onClick={() => setModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
              <div className="space-y-4">

                {/* ── Kapak Görseli ── */}
                <div>
                  <label className="label">Kapak Görseli</label>
                  {(editing?.image && !imageFile) && (
                    <img src={imgUrl(editing.image)} className="mb-2 h-40 w-full rounded-xl object-cover" alt="" />
                  )}
                  {imageFile && (
                    <img src={URL.createObjectURL(imageFile)} className="mb-2 h-40 w-full rounded-xl object-cover" alt="" />
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm text-slate-500 transition hover:border-brand hover:text-brand">
                    {imageFile ? "Görseli Değiştir" : "Kapak Görseli Seç"}
                  </button>
                </div>

                {/* ── Başlıklar ── */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Başlık (TR) *</label>
                    <input className="input" value={title}
                      onChange={(e) => { setTitle(e.target.value); if (!editing) setSlug(slugify(e.target.value)); }} />
                  </div>
                  <div>
                    <label className="label">Başlık (EN)</label>
                    <input className="input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                  </div>
                </div>

                {/* ── Özet ── */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Özet (TR)</label>
                    <textarea className="input resize-none" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Özet (EN)</label>
                    <textarea className="input resize-none" rows={2} value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} />
                  </div>
                </div>

                {/* ── İçerik (TR) — mini editör ── */}
                <div>
                  <label className="label">İçerik (TR)</label>
                  <ContentToolbar
                    textareaRef={contentRef}
                    value={content}
                    onChange={setContent}
                  />
                  <textarea
                    ref={contentRef}
                    className="input w-full resize-y rounded-t-none border-t-0 font-mono text-xs"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="İçerik buraya yazın. Toolbar'daki butonlarla kalın, başlık ve görsel ekleyebilirsiniz."
                  />
                  <InlineImagePreview content={content} onChange={setContent} />
                </div>

                {/* ── İçerik (EN) — mini editör ── */}
                <div>
                  <label className="label">İçerik (EN)</label>
                  <ContentToolbar
                    textareaRef={contentEnRef}
                    value={contentEn}
                    onChange={setContentEn}
                  />
                  <textarea
                    ref={contentEnRef}
                    className="input w-full resize-y rounded-t-none border-t-0 font-mono text-xs"
                    rows={8}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="English content…"
                  />
                </div>

                {/* ── Kategori + Slug + Tarih ── */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label">Kategori</label>
                    <input className="input" value={category} onChange={(e) => setCategory(e.target.value)}
                      placeholder="Etkinlik, Yatırım…" />
                  </div>
                  <div>
                    <label className="label">Slug (URL)</label>
                    <input className="input font-mono text-xs" value={slug} onChange={(e) => setSlug(e.target.value)}
                      placeholder="haber-basligi" />
                  </div>
                  <div>
                    <label className="label">Yayın Tarihi</label>
                    <input
                      type="date"
                      className="input"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                    />
                  </div>
                </div>

                {/* ── Toggles ── */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded border-slate-300" />
                    Sitede Yayında
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-slate-300" />
                    <Star className="h-3.5 w-3.5 text-amber-400" />
                    Öne Çıkarılmış
                  </label>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Vazgeç
              </button>
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
