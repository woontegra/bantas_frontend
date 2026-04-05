"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import { mediaUrl } from "@/lib/api";
import {
  Cog,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  ImagePlus,
  X,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TechSection {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  subtitle: string;
  subtitleEn: string;
  details: string;
  detailsEn: string;
  images: string[];
  isSizesList: boolean;
  sizes: string[];
}

interface TechData {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  content: string;
  contentEn: string;
  stats: { established: string; capacity: string; certified: string };
  sections: TechSection[];
}

const DEFAULT: TechData = {
  title: "Teknoloji",
  titleEn: "Technology",
  subtitle: "Üretim Teknolojilerimiz",
  subtitleEn: "Our Production Technologies",
  content: "Modern üretim tesislerimizde, son teknoloji makineler ve deneyimli ekibimizle uluslararası kalite standartlarında metal ambalaj üretimi gerçekleştirmekteyiz.",
  contentEn: "In our modern production facilities, we manufacture metal packaging at international quality standards with state-of-the-art machines and our experienced team.",
  stats: { established: "1986", capacity: "750K+", certified: "ISO" },
  sections: [
    {
      title: "BANTAŞ METAL OFSET BASKI FABRİKASI",
      titleEn: "BANTAŞ METAL OFFSET PRINTING FACTORY",
      description: "Sizlere yenilikçi, gelişmiş, kaliteli ürün ve hizmetler sunmak, müşteri memnuniyetini artırmak hedefiyle Bantaş A.Ş markası ile 2004 yılında kurulmuş olan firmamız, Türkiye'nin ilk metal ofset baskı ve teneke kutu üretim tesislerinden yeni yaklaşımlar için yatırımlarını sürekli büyük tutmaktadır.",
      descriptionEn: "Founded in 2004 under the Bantaş A.Ş. brand, our company continues to make significant investments for new approaches from Turkey's first metal offset printing and tin can production facilities.",
      subtitle: "METAL OFSET BASKI",
      subtitleEn: "METAL OFFSET PRINTING",
      details: "Ofset Baskı fabrikamız en gelişmiş ofset baskısı ve en yüksek kalitede metal ofset baskı hizmeti vermektedir.",
      detailsEn: "Our Offset Printing factory provides the most advanced offset printing and the highest quality metal offset printing service.",
      images: [],
      isSizesList: false,
      sizes: [],
    },
    {
      title: "BANTAŞ TENEKE KUTU FABRİKASI",
      titleEn: "BANTAŞ TIN CAN FACTORY",
      description: "Firmamızda plastik, metal, teneke kutu üretimi yapılmaktadır. Ürünlerimiz uluslararası standartlara uygun olarak, tam otomatik makinelerde üretilmektedir.",
      descriptionEn: "Our company produces plastic, metal, and tin cans. Our products are manufactured on fully automatic machines in accordance with international standards.",
      subtitle: "ÜRETİM SÜRECİ",
      subtitleEn: "PRODUCTION PROCESS",
      details: "Teneke ambalajlarımızın boyları müşterinin ve talep doğrultusunda 50 mm ile 300 mm arasında değişmektedir.",
      detailsEn: "The dimensions of our tin packaging vary between 50mm and 300mm according to customer demand.",
      images: [],
      isSizesList: false,
      sizes: [],
    },
    {
      title: "TENEKE KUTU EBATLARI",
      titleEn: "TIN CAN DIMENSIONS",
      description: "Müşterilerimizin ihtiyaçlarına göre özel ebatlarda üretim yapabilmekteyiz.",
      descriptionEn: "We can manufacture in custom dimensions according to our customers' needs.",
      subtitle: "",
      subtitleEn: "",
      details: "",
      detailsEn: "",
      images: [],
      isSizesList: true,
      sizes: ["40×100 mm", "114×110 mm", "99×110 mm", "180×100 mm", "214×215 mm", "99 mm", "114 mm", "168 mm", "153 mm", "152 mm"],
    },
  ],
};

type Tab = "hero" | "stats" | "sections";

export default function TeknolojiAdminPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [data, setData] = useState<TechData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [uploadingImg, setUploadingImg] = useState<number | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const activeImgSection = useRef<number>(-1);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<{
        title?: string; titleEn?: string;
        subtitle?: string; subtitleEn?: string;
        content?: string; contentEn?: string;
        sections?: string;
      }>("/api/content-pages/teknoloji");

      const merged = { ...DEFAULT };
      if (res.title)      merged.title      = res.title;
      if (res.titleEn)    merged.titleEn    = res.titleEn;
      if (res.subtitle)   merged.subtitle   = res.subtitle;
      if (res.subtitleEn) merged.subtitleEn = res.subtitleEn;
      if (res.content)    merged.content    = res.content;
      if (res.contentEn)  merged.contentEn  = res.contentEn;
      if (res.sections) {
        try {
          const s = JSON.parse(res.sections);
          if (s.stats)    merged.stats    = { ...DEFAULT.stats, ...s.stats };
          if (Array.isArray(s.sections) && s.sections.length) merged.sections = s.sections;
        } catch { /* ignore */ }
      }
      setData(merged);
    } catch { /* keep defaults */ }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    try {
      const payload = {
        slug: "teknoloji",
        title:      data.title,      titleEn:    data.titleEn,
        subtitle:   data.subtitle,   subtitleEn: data.subtitleEn,
        content:    data.content,    contentEn:  data.contentEn,
        sections: JSON.stringify({ stats: data.stats, sections: data.sections }),
      };
      try {
        await adminFetch("/api/content-pages/teknoloji", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        await adminFetch("/api/content-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    } finally { setSaving(false); }
  }

  function setField<K extends keyof TechData>(k: K, v: TechData[K]) {
    setData((p) => ({ ...p, [k]: v }));
  }
  function setStat(k: keyof TechData["stats"], v: string) {
    setData((p) => ({ ...p, stats: { ...p.stats, [k]: v } }));
  }
  function setSection<K extends keyof TechSection>(idx: number, k: K, v: TechSection[K]) {
    setData((p) => {
      const secs = [...p.sections];
      secs[idx] = { ...secs[idx], [k]: v };
      return { ...p, sections: secs };
    });
  }

  async function handleImageUpload(sectionIdx: number, file: File) {
    setUploadingImg(sectionIdx);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await adminUpload("/api/upload", fd) as any;
      if (res?.url) {
        setData((p) => {
          const secs = [...p.sections];
          secs[sectionIdx] = { ...secs[sectionIdx], images: [...(secs[sectionIdx].images || []), res.url] };
          return { ...p, sections: secs };
        });
      }
    } catch { alert("Görsel yüklenemedi."); }
    finally { setUploadingImg(null); }
  }

  function removeImage(sectionIdx: number, imgIdx: number) {
    setData((p) => {
      const secs = [...p.sections];
      secs[sectionIdx] = { ...secs[sectionIdx], images: secs[sectionIdx].images.filter((_, i) => i !== imgIdx) };
      return { ...p, sections: secs };
    });
  }

  function addSize(idx: number) {
    setSection(idx, "sizes", [...data.sections[idx].sizes, ""]);
  }
  function setSize(sIdx: number, sizeIdx: number, val: string) {
    const sizes = [...data.sections[sIdx].sizes];
    sizes[sizeIdx] = val;
    setSection(sIdx, "sizes", sizes);
  }
  function removeSize(sIdx: number, sizeIdx: number) {
    setSection(sIdx, "sizes", data.sections[sIdx].sizes.filter((_, i) => i !== sizeIdx));
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      tab === t ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"
    }`;
  const inputCls    = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls    = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return (
    <AdminShell>
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <div className="p-6 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Cog className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teknoloji Sayfası</h1>
              <p className="text-sm text-gray-500">Üretim teknolojileri içeriğini düzenleyin</p>
            </div>
          </div>
          <a href="/tr/teknoloji" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("hero")}     onClick={() => setTab("hero")}>Hero</button>
          <button className={tabClass("stats")}    onClick={() => setTab("stats")}>İstatistikler</button>
          <button className={tabClass("sections")} onClick={() => setTab("sections")}>
            Bölümler
            <span className="ml-1.5 bg-gray-200 text-gray-600 text-xs rounded-full px-1.5 py-0.5">
              {data.sections.length}
            </span>
          </button>
        </div>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
              <Cog className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-semibold">Hero Bölümü</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div><label className={labelCls}>Başlık (TR)</label><input className={inputCls} value={data.title} onChange={(e) => setField("title", e.target.value)} /></div>
              <div><label className={labelCls}>Başlık (EN)</label><input className={inputCls} value={data.titleEn} onChange={(e) => setField("titleEn", e.target.value)} /></div>
              <div><label className={labelCls}>Alt Başlık (TR)</label><input className={inputCls} value={data.subtitle} onChange={(e) => setField("subtitle", e.target.value)} /></div>
              <div><label className={labelCls}>Alt Başlık (EN)</label><input className={inputCls} value={data.subtitleEn} onChange={(e) => setField("subtitleEn", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Açıklama (TR)</label><textarea rows={3} className={textareaCls} value={data.content} onChange={(e) => setField("content", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Açıklama (EN)</label><textarea rows={3} className={textareaCls} value={data.contentEn} onChange={(e) => setField("contentEn", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <span className="text-white font-semibold">İstatistik Değerleri</span>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700 mb-6">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                Stats barında görünen 3 değeri güncelleyin.
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div><label className={labelCls}>Kuruluş Yılı</label><input className={inputCls} value={data.stats.established} onChange={(e) => setStat("established", e.target.value)} /></div>
                <div><label className={labelCls}>Üretim Kapasitesi</label><input className={inputCls} value={data.stats.capacity} onChange={(e) => setStat("capacity", e.target.value)} /></div>
                <div><label className={labelCls}>Sertifikasyon</label><input className={inputCls} value={data.stats.certified} onChange={(e) => setStat("certified", e.target.value)} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTIONS ── */}
        {tab === "sections" && (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              ref={imgInputRef}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && activeImgSection.current >= 0) {
                  await handleImageUpload(activeImgSection.current, file);
                }
                e.target.value = "";
              }}
            />

            {data.sections.map((sec, idx) => {
              const isOpen = expandedSection === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Accordion header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedSection(isOpen ? null : idx)}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{sec.title || `Bölüm ${idx + 1}`}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sec.images.length} görsel · {sec.isSizesList ? "Ebat listesi" : "Detay metni"}
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 space-y-5">
                      {/* Titles */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><label className={labelCls}>Başlık (TR)</label><input className={inputCls} value={sec.title} onChange={(e) => setSection(idx, "title", e.target.value)} /></div>
                        <div><label className={labelCls}>Başlık (EN)</label><input className={inputCls} value={sec.titleEn} onChange={(e) => setSection(idx, "titleEn", e.target.value)} /></div>
                        <div className="sm:col-span-2"><label className={labelCls}>Açıklama (TR)</label><textarea rows={2} className={textareaCls} value={sec.description} onChange={(e) => setSection(idx, "description", e.target.value)} /></div>
                        <div className="sm:col-span-2"><label className={labelCls}>Açıklama (EN)</label><textarea rows={2} className={textareaCls} value={sec.descriptionEn} onChange={(e) => setSection(idx, "descriptionEn", e.target.value)} /></div>
                      </div>

                      {/* Is sizes list toggle */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={sec.isSizesList}
                          onChange={(e) => setSection(idx, "isSizesList", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">Bu bölüm ebat listesi göstersin</span>
                      </label>

                      {sec.isSizesList ? (
                        /* Sizes editor */
                        <div>
                          <label className={labelCls}>Ebatlar</label>
                          <div className="space-y-2 mb-2">
                            {sec.sizes.map((sz, si) => (
                              <div key={si} className="flex items-center gap-2">
                                <input className={`${inputCls} flex-1`} value={sz} onChange={(e) => setSize(idx, si, e.target.value)} placeholder="örn. 114×110 mm" />
                                <button onClick={() => removeSize(idx, si)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => addSize(idx)} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                            <Plus className="w-4 h-4" /> Ebat Ekle
                          </button>
                        </div>
                      ) : (
                        /* Subtitle + details */
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div><label className={labelCls}>Alt Başlık (TR)</label><input className={inputCls} value={sec.subtitle} onChange={(e) => setSection(idx, "subtitle", e.target.value)} /></div>
                          <div><label className={labelCls}>Alt Başlık (EN)</label><input className={inputCls} value={sec.subtitleEn} onChange={(e) => setSection(idx, "subtitleEn", e.target.value)} /></div>
                          <div className="sm:col-span-2"><label className={labelCls}>Detay Metni (TR)</label><textarea rows={3} className={textareaCls} value={sec.details} onChange={(e) => setSection(idx, "details", e.target.value)} /></div>
                          <div className="sm:col-span-2"><label className={labelCls}>Detay Metni (EN)</label><textarea rows={3} className={textareaCls} value={sec.detailsEn} onChange={(e) => setSection(idx, "detailsEn", e.target.value)} /></div>
                        </div>
                      )}

                      {/* Images */}
                      <div>
                        <label className={labelCls}>Görseller (carousel)</label>
                        <div className="flex flex-wrap gap-3 mb-3">
                          {sec.images.map((img, ii) => (
                            <div key={ii} className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={mediaUrl(img)} alt="" className="h-full w-full object-cover" />
                              <button
                                onClick={() => removeImage(idx, ii)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => { activeImgSection.current = idx; imgInputRef.current?.click(); }}
                            disabled={uploadingImg === idx}
                            className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition"
                          >
                            {uploadingImg === idx
                              ? <RefreshCw className="w-5 h-5 animate-spin" />
                              : <><ImagePlus className="w-5 h-5 mb-1" /><span className="text-xs">Ekle</span></>
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Save bar ── */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && (
            <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>
          )}
          {status === "idle" && <div />}

          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 font-medium text-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

