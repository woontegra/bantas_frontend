"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload, API } from "@/lib/adminApi";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Loader2,
  TableProperties,
  AlignLeft,
  TrendingUp,
  GripVertical,
  Upload,
} from "lucide-react";
import type { ProductPageRecord } from "@/lib/api";
import { getProductStaticData } from "@/lib/productStaticData";
import type { SpecTable } from "@/lib/productStaticData";

/* ── Investor types ──────────────────────────────────────── */
interface InvestorCard {
  title: string;
  desc: string;
  linkLabel: string;
  href: string;
}
interface InvestorSettings {
  heroSubtitle: string;
  iframeUrl: string;
  iframeHeight: number;
  cards: InvestorCard[];
  kapTitle: string;
  kapText: string;
  kapHref: string;
}
const INVESTOR_DEFAULT: InvestorSettings = {
  heroSubtitle:
    "Şeffaf ve güvenilir yatırımcı iletişimi için finansal verilerimiz ve raporlarımız",
  iframeUrl:
    "https://web.matriksdata.com/FinanceDataCenter/Yatirimci/Default.aspx?CompanyGUID=ae65bdfc-2451-4327-945d-4e4027972990",
  iframeHeight: 900,
  cards: [
    { title: "Finansal Raporlar", desc: "Dönemsel finansal tablolarımız, faaliyet raporlarımız ve bağımsız denetim raporlarımıza ulaşabilirsiniz.", linkLabel: "Raporları İncele", href: "https://www.kap.org.tr" },
    { title: "Genel Kurul", desc: "Genel kurul toplantı bilgileri, gündem maddeleri ve kararlarına buradan ulaşabilirsiniz.", linkLabel: "Detayları Gör", href: "https://www.kap.org.tr" },
    { title: "Kurumsal Yönetim", desc: "Kurumsal yönetim ilkelerimiz, politikalarımız ve uyum raporlarımız hakkında bilgi edinin.", linkLabel: "İncele", href: "#" },
    { title: "Yatırımcı İletişim", desc: "Sorularınız ve talepleriniz için yatırımcı ilişkileri departmanımız ile iletişime geçin.", linkLabel: "İletişime Geç", href: "/iletisim" },
  ],
  kapTitle: "Önemli Bilgilendirme",
  kapText: "Yatırımcılarımızın bilgilendirilmesi amacıyla tüm finansal raporlarımız, önemli açıklamalarımız ve kurumsal gelişmelerimiz düzenli olarak bu sayfada paylaşılmaktadır. Kamuyu Aydınlatma Platformu (KAP) üzerinden yapılan tüm açıklamalarımıza da buradan ulaşabilirsiniz.",
  kapHref: "https://www.kap.org.tr",
};

/* ── helpers ─────────────────────────────────────────────── */
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSpecTables(raw: string): SpecTable[] {
  if (!raw.trim().startsWith("[")) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SpecTable[];
  } catch {
    /* ignore */
  }
  return [];
}

/* ── Spec Table Editor ───────────────────────────────────── */
function SpecTableEditor({
  tables,
  onChange,
}: {
  tables: SpecTable[];
  onChange: (t: SpecTable[]) => void;
}) {
  function addTable() {
    onChange([
      ...tables,
      { label: "Yeni Tablo", columns: ["Kapasite", "Ölçü (mm)"], rows: [["", ""]] },
    ]);
  }

  function removeTable(ti: number) {
    onChange(tables.filter((_, i) => i !== ti));
  }

  function setTableLabel(ti: number, val: string) {
    const next = tables.map((t, i) => (i === ti ? { ...t, label: val } : t));
    onChange(next);
  }

  function addColumn(ti: number) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      return {
        ...t,
        columns: [...t.columns, "Yeni Sütun"],
        rows: t.rows.map((r) => [...r, ""]),
      };
    });
    onChange(next);
  }

  function removeColumn(ti: number, ci: number) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      return {
        ...t,
        columns: t.columns.filter((_, j) => j !== ci),
        rows: t.rows.map((r) => r.filter((_, j) => j !== ci)),
      };
    });
    onChange(next);
  }

  function setColumn(ti: number, ci: number, val: string) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      const cols = t.columns.map((c, j) => (j === ci ? val : c));
      return { ...t, columns: cols };
    });
    onChange(next);
  }

  function addRow(ti: number) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      return { ...t, rows: [...t.rows, t.columns.map(() => "")] };
    });
    onChange(next);
  }

  function removeRow(ti: number, ri: number) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      return { ...t, rows: t.rows.filter((_, j) => j !== ri) };
    });
    onChange(next);
  }

  function setCell(ti: number, ri: number, ci: number, val: string) {
    const next = tables.map((t, i) => {
      if (i !== ti) return t;
      const rows = t.rows.map((r, j) =>
        j === ri ? r.map((c, k) => (k === ci ? val : c)) : r,
      );
      return { ...t, rows };
    });
    onChange(next);
  }

  return (
    <div className="space-y-6">
      {tables.map((table, ti) => (
        <div
          key={ti}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          {/* Table header */}
          <div className="mb-3 flex items-center gap-2">
            <input
              className="input flex-1 text-sm font-semibold"
              value={table.label}
              onChange={(e) => setTableLabel(ti, e.target.value)}
              placeholder="Tablo başlığı…"
            />
            <button
              type="button"
              onClick={() => removeTable(ti)}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
              title="Tabloyu sil"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  {table.columns.map((col, ci) => (
                    <th key={ci} className="px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <input
                          className="input min-w-[80px] px-1.5 py-1 text-xs font-semibold"
                          value={col}
                          onChange={(e) => setColumn(ti, ci, e.target.value)}
                        />
                        {table.columns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(ti, ci)}
                            className="shrink-0 text-slate-400 hover:text-red-500"
                            title="Sütunu sil"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-8 px-1 py-1.5">
                    <button
                      type="button"
                      onClick={() => addColumn(ti)}
                      className="rounded p-0.5 text-brand hover:bg-brand/10"
                      title="Sütun ekle"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-100 last:border-0">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-2 py-1">
                        <input
                          className="input w-full min-w-[70px] px-1.5 py-1 text-xs"
                          value={cell}
                          onChange={(e) => setCell(ti, ri, ci, e.target.value)}
                          placeholder="—"
                        />
                      </td>
                    ))}
                    <td className="px-1 py-1">
                      <button
                        type="button"
                        onClick={() => removeRow(ti, ri)}
                        className="text-slate-300 hover:text-red-500"
                        title="Satırı sil"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => addRow(ti)}
            className="mt-2 flex items-center gap-1 text-xs text-brand hover:underline"
          >
            <Plus className="h-3 w-3" /> Satır ekle
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addTable}
        className="flex items-center gap-2 rounded-xl border border-dashed border-brand px-4 py-2.5 text-sm font-medium text-brand hover:bg-brand/5"
      >
        <Plus className="h-4 w-4" /> Yeni tablo ekle
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main page
   ══════════════════════════════════════════════════════════ */
export default function ProductPagesAdminPage() {
  const [items, setItems] = useState<ProductPageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalTab, setModalTab] = useState<"info" | "tables">("info");
  const [editing, setEditing] = useState<ProductPageRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  /* ── Investor modal state ─────────────────────────────── */
  const [investorModal, setInvestorModal] = useState(false);
  const [investorSaving, setInvestorSaving] = useState(false);
  const [investorTab, setInvestorTab] = useState<"general" | "cards" | "kap">("general");
  const [investorCfg, setInvestorCfg] = useState<InvestorSettings>(INVESTOR_DEFAULT);

  /* form fields */
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [detailedDescriptionEn, setDetailedDescriptionEn] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [specTables, setSpecTables] = useState<SpecTable[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(file: File) {
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminUpload<{ url: string }>("/api/upload", fd);
      setMainImage((res as any)?.url ?? "");
    } catch {
      // keep existing value
    } finally {
      setImageUploading(false);
    }
  }

  async function load() {
    setLoading(true);
    try {
      setItems(await adminFetch<ProductPageRecord[]>("/api/product-pages"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(null);
    setModalTab("info");
    setSlug("");
    setTitle("");
    setTitleEn("");
    setSubtitle("");
    setSubtitleEn("");
    setDescription("");
    setDescriptionEn("");
    setDetailedDescription("");
    setDetailedDescriptionEn("");
    setMainImage("");
    setOrder(items.length);
    setActive(true);
    setSpecTables([]);
    setModal(true);
  }

  function openEdit(row: ProductPageRecord) {
    setEditing(row);
    setModalTab("info");
    setSlug(row.slug);
    setTitle(row.title);
    setTitleEn(row.titleEn ?? "");
    setSubtitle(row.subtitle ?? "");
    setSubtitleEn(row.subtitleEn ?? "");
    setMainImage(row.mainImage ?? "");
    setOrder(row.order);
    setActive(row.active);
    setDetailedDescription(row.detailedDescription ?? "");
    setDetailedDescriptionEn(row.detailedDescriptionEn ?? "");

    // Statik veriyi fallback olarak kullan (DB boşsa)
    const sd = getProductStaticData(row.slug);

    setDescription(
      row.description ??
        (sd
          ? [sd.description, sd.descriptionExtra].filter(Boolean).join("\n\n")
          : ""),
    );
    setDescriptionEn(row.descriptionEn ?? "");

    // Tablolar: önce DB'deki JSON, yoksa statik veri
    const apiTables = parseSpecTables(row.content ?? "");
    setSpecTables(apiTables.length > 0 ? apiTables : sd?.specTables ?? []);

    setModal(true);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function handleSave() {
    const tit = title.trim();
    const s = (slug.trim() ? slugify(slug.trim()) : slugify(tit)).trim();
    if (!s || !tit) {
      showToast("Slug ve başlık (TR) zorunlu");
      return;
    }
    setSaving(true);
    try {
      const body = {
        slug: s,
        title: tit,
        titleEn: titleEn || null,
        subtitle: subtitle || null,
        subtitleEn: subtitleEn || null,
        description: description || null,
        descriptionEn: descriptionEn || null,
        detailedDescription: detailedDescription || null,
        detailedDescriptionEn: detailedDescriptionEn || null,
        mainImage: mainImage || null,
        content:
          specTables.length > 0 ? JSON.stringify(specTables) : null,
        order,
        active,
      };
      if (editing) {
        await adminFetch(`/api/product-pages/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        showToast("Güncellendi ✓");
      } else {
        await adminFetch("/api/product-pages", {
          method: "POST",
          body: JSON.stringify(body),
        });
        showToast("Oluşturuldu ✓");
      }
      setModal(false);
      load();
    } catch (e) {
      showToast((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ürün sayfasını silmek istediğinize emin misiniz?")) return;
    await adminFetch(`/api/product-pages/${id}`, { method: "DELETE" });
    showToast("Silindi ✓");
    load();
  }

  function imgUrl(p?: string | null) {
    if (!p) return "";
    return p.startsWith("http") ? p : `${API}${p}`;
  }

  /* ── Investor helpers ─────────────────────────────────── */
  async function openInvestorModal() {
    setInvestorTab("general");
    try {
      const data = await adminFetch<InvestorSettings>("/api/investor-relations");
      if (data) setInvestorCfg({ ...INVESTOR_DEFAULT, ...data });
      else setInvestorCfg(INVESTOR_DEFAULT);
    } catch {
      setInvestorCfg(INVESTOR_DEFAULT);
    }
    setInvestorModal(true);
  }

  async function saveInvestor() {
    setInvestorSaving(true);
    try {
      await adminFetch("/api/investor-relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investorCfg),
      });
      showToast("Yatırımcı İlişkileri güncellendi ✓");
      setInvestorModal(false);
    } catch {
      showToast("Kaydetme başarısız — backend endpoint eksik olabilir");
    } finally {
      setInvestorSaving(false);
    }
  }

  function updateInvestorCard(i: number, field: keyof InvestorCard, val: string) {
    setInvestorCfg((prev) => {
      const cards = [...prev.cards];
      cards[i] = { ...cards[i], [field]: val };
      return { ...prev, cards };
    });
  }

  return (
    <AdminShell>
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ürün alt sayfaları</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Menüdeki <strong>Ürünler</strong> açılır listesi ve{" "}
            <code className="rounded bg-slate-100 px-1">/urunler/…</code>{" "}
            sayfaları buradan yönetilir.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Yeni sayfa
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Başlık (TR)</th>
                <th className="px-4 py-3 font-medium">Tablolar</th>
                <th className="px-4 py-3 font-medium">Yayında</th>
                <th className="px-4 py-3 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const tCount = parseSpecTables(row.content ?? "").length;
                return (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-slate-500">{row.order}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {row.slug}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.title}
                    </td>
                    <td className="px-4 py-3">
                      {tCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                          <TableProperties className="h-3 w-3" />
                          {tCount} tablo
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          row.active
                            ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"
                            : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        }
                      >
                        {row.active ? "Evet" : "Hayır"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="mr-2 inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* ── Yatırımcı İlişkileri — sabit satır ── */}
              <tr className="border-b border-slate-100 bg-indigo-50/40">
                <td className="px-4 py-3 text-slate-400">—</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">
                  yatirimci-iliskileri
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                    <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                    Yatırımcı İlişkileri
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-slate-400">—</span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    Evet
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={openInvestorModal}
                    className="mr-2 inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="px-4 py-10 text-center text-slate-500">
              Henüz kayıt yok. <strong>Yeni sayfa</strong> ile ekleyin.
            </p>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Sayfayı düzenle" : "Yeni ürün sayfası"}
              </h2>
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 border-b border-slate-100 bg-slate-50 px-5 py-2">
              <button
                type="button"
                onClick={() => setModalTab("info")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  modalTab === "info"
                    ? "bg-white text-brand shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
                Genel Bilgiler
              </button>
              <button
                type="button"
                onClick={() => setModalTab("tables")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  modalTab === "tables"
                    ? "bg-white text-brand shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <TableProperties className="h-3.5 w-3.5" />
                Ürün Detay Tabloları
                {specTables.length > 0 && (
                  <span className="ml-1 rounded-full bg-brand px-1.5 py-0.5 text-[10px] text-white">
                    {specTables.length}
                  </span>
                )}
              </button>
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-5 py-4">
              {/* ── TAB: Genel Bilgiler ── */}
              {modalTab === "info" && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">URL slug</label>
                      <input
                        className="input font-mono text-sm"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="ornek-urun-grubu"
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Adres: /urunler/{slug || "…"}
                      </p>
                    </div>
                    <div>
                      <label className="label">Liste sırası</label>
                      <input
                        className="input"
                        type="number"
                        value={order}
                        onChange={(e) =>
                          setOrder(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Başlık (TR) *</label>
                      <input
                        className="input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Başlık (EN)</label>
                      <input
                        className="input"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Alt başlık (TR)</label>
                      <input
                        className="input"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Alt başlık (EN)</label>
                      <input
                        className="input"
                        value={subtitleEn}
                        onChange={(e) => setSubtitleEn(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Kısa açıklama (TR)</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Kısa açıklama (EN)</label>
                    <textarea
                      className="input resize-none"
                      rows={3}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Ana görsel</label>
                    {/* Upload button */}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                        e.target.value = "";
                      }}
                    />
                    <div className="flex gap-2">
                      <input
                        className="input flex-1 font-mono text-sm"
                        value={mainImage}
                        onChange={(e) => setMainImage(e.target.value)}
                        placeholder="/uploads/..."
                      />
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={imageUploading}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {imageUploading
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Upload className="h-4 w-4" />}
                        {imageUploading ? "Yükleniyor…" : "Yükle"}
                      </button>
                    </div>
                    {mainImage && (
                      <img
                        src={imgUrl(mainImage)}
                        alt=""
                        className="mt-2 h-32 w-auto max-w-full rounded-lg border border-slate-200 object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <label className="label">Detaylı metin / HTML (TR)</label>
                    <textarea
                      className="input resize-none font-mono text-xs"
                      rows={5}
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Detaylı metin / HTML (EN)</label>
                    <textarea
                      className="input resize-none font-mono text-xs"
                      rows={5}
                      value={detailedDescriptionEn}
                      onChange={(e) =>
                        setDetailedDescriptionEn(e.target.value)
                      }
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Menüde ve sitede yayında
                  </label>
                </div>
              )}

              {/* ── TAB: Tablolar ── */}
              {modalTab === "tables" && (
                <div>
                  <p className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    Buraya eklediğiniz tablolar sayfadaki <strong>Ürün Detayı</strong> bölümünde gösterilir.
                    Sayfada birden fazla tablo varsa sekme (tab) olarak görünür.
                  </p>
                  <SpecTableEditor
                    tables={specTables}
                    onChange={setSpecTables}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══ Yatırımcı İlişkileri Modal ══════════════════════════ */}
      {investorModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Yatırımcı İlişkileri — Sayfa Düzenle
              </h2>
              <button
                type="button"
                onClick={() => setInvestorModal(false)}
                className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-100 bg-slate-50 px-5 py-2">
              {(["general", "cards", "kap"] as const).map((tab) => {
                const labels = { general: "Genel", cards: "Bilgi Kartları", kap: "Önemli Bilgilendirme" };
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInvestorTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      investorTab === tab
                        ? "bg-white text-brand shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {labels[tab]}
                    {tab === "cards" && (
                      <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">
                        {investorCfg.cards.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-5 py-5">
              {/* ── Genel ── */}
              {investorTab === "general" && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Hero Alt Başlık</label>
                    <textarea
                      className="input resize-none"
                      rows={2}
                      value={investorCfg.heroSubtitle}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({ ...p, heroSubtitle: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Matriks iframe URL</label>
                    <input
                      className="input font-mono text-xs"
                      value={investorCfg.iframeUrl}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({ ...p, iframeUrl: e.target.value }))
                      }
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      CompanyGUID değişirse bu alanı güncelleyin.
                    </p>
                  </div>
                  <div>
                    <label className="label">iframe Yüksekliği (px)</label>
                    <input
                      className="input"
                      type="number"
                      min={400}
                      max={2000}
                      value={investorCfg.iframeHeight}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({
                          ...p,
                          iframeHeight: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* ── Bilgi Kartları ── */}
              {investorTab === "cards" && (
                <div className="space-y-4">
                  {investorCfg.cards.map((card, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Kart {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setInvestorCfg((p) => ({
                              ...p,
                              cards: p.cards.filter((_, j) => j !== i),
                            }))
                          }
                          className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Sil
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="label">Başlık</label>
                          <input
                            className="input"
                            value={card.title}
                            onChange={(e) => updateInvestorCard(i, "title", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label">Link Etiketi</label>
                          <input
                            className="input"
                            value={card.linkLabel}
                            onChange={(e) => updateInvestorCard(i, "linkLabel", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label">Açıklama</label>
                          <textarea
                            className="input resize-none"
                            rows={2}
                            value={card.desc}
                            onChange={(e) => updateInvestorCard(i, "desc", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="label">Link URL</label>
                          <input
                            className="input"
                            value={card.href}
                            onChange={(e) => updateInvestorCard(i, "href", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setInvestorCfg((p) => ({
                        ...p,
                        cards: [
                          ...p.cards,
                          { title: "", desc: "", linkLabel: "İncele", href: "#" },
                        ],
                      }))
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-brand hover:text-brand transition"
                  >
                    <Plus className="h-4 w-4" />
                    Yeni Kart Ekle
                  </button>
                </div>
              )}

              {/* ── KAP Banner ── */}
              {investorTab === "kap" && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Bölüm Başlığı</label>
                    <input
                      className="input"
                      value={investorCfg.kapTitle}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({ ...p, kapTitle: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Açıklama Metni</label>
                    <textarea
                      className="input resize-none"
                      rows={4}
                      value={investorCfg.kapText}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({ ...p, kapText: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">KAP Bağlantısı</label>
                    <input
                      className="input"
                      type="url"
                      value={investorCfg.kapHref}
                      onChange={(e) =>
                        setInvestorCfg((p) => ({ ...p, kapHref: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setInvestorModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={investorSaving}
                onClick={saveInvestor}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {investorSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
