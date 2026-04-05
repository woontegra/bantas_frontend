"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Calendar,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  GripVertical,
  Factory,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
} from "lucide-react";

type Category = "company" | "product" | "achievement";

interface TimelineEvent {
  year: string;
  category: Category;
  text: string;
  textEn: string;
}

interface HistoryData {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  content: string;
  contentEn: string;
  stats: { experience: string; capacity: string; products: string };
  cta: { title: string; titleEn: string; description: string; descriptionEn: string };
  events: TimelineEvent[];
}

const DEFAULTS: HistoryData = {
  title: "Tarihçemiz",
  titleEn: "Our History",
  subtitle: "Yolculuğumuz",
  subtitleEn: "Our Journey",
  content:
    "1986 yılından bu yana metal ambalaj sektöründe öncü bir firma olarak, kalite ve yenilikçiliği bir araya getirerek büyümeye devam ediyoruz.",
  contentEn:
    "Since 1986, as a pioneer in the metal packaging industry, we continue to grow by combining quality and innovation.",
  stats: { experience: "38+", capacity: "1M+", products: "727" },
  cta: {
    title: "Geleceğe Doğru",
    titleEn: "Towards the Future",
    description:
      "40 yılı aşkın tecrübemizle, metal ambalaj sektöründe yenilikçi çözümler sunmaya ve müşterilerimize en kaliteli hizmeti vermeye devam ediyoruz.",
    descriptionEn:
      "With over 40 years of experience, we continue to offer innovative solutions in the metal packaging industry.",
  },
  events: [
    { year: "1986", category: "company",     text: "Şirketimiz Türkiye ve ortadoğu ülkelerine yönelik olarak 1986 yılında BANTAS adıyla kurulmuş ve ilk ürünlerini üretmeye başlamıştır.", textEn: "Our company was founded under the name BANTAS in 1986 targeting Turkey and Middle Eastern countries." },
    { year: "1994", category: "company",     text: "Bantas 1994 yılında BANTAS adı altında kurulmuş olup, Türkiye ve Ortadoğu ülkelerine yönelik olarak üretim yapmaya başlamıştır.", textEn: "Bantas was established in 1994 and began production targeting Turkey and Middle Eastern countries." },
    { year: "1998", category: "achievement", text: "Geliştirdiğimiz ürünler Türkiye ve Orta Doğu ülkelerinde büyük ilgi görmüş ve bu ülkelere ihracat yapılmaya başlanmıştır.", textEn: "Our products attracted great interest in Turkey and Middle Eastern countries, and exports began." },
    { year: "1998", category: "company",     text: "Geliştirdiğimiz ürünler Türkiye ve Orta Doğu ülkelerinde büyük ilgi görmüş ve bu ülkelere ihracat yapılmaya başlanmıştır. Aynı zamanda iç piyasada da önemli bir konuma gelmiştir.", textEn: "We also established an important position in the domestic market." },
    { year: "2005", category: "product",     text: "750 bin adet 500cc Metal Kutu, Hazırlık Tenekesi, Boya Tenekesi üretme kapasitesine ulaşmıştır.", textEn: "Reached production capacity of 750 thousand units of 500cc Metal Cans." },
    { year: "2008", category: "achievement", text: "Müşterilerimizin 727 farklı ürün çeşidine sahip olup, tüm sektörlere hitap edebilecek ürün çeşidi ile hizmet vermekteyiz.", textEn: "We serve with 727 different product varieties catering to all sectors." },
    { year: "2009", category: "product",     text: "Ofset baskı teknolojisi sayesinde 500 ml 1 lt 2 lt 5 lt 10 lt 20 lt ambalajlar üzerine 6 renk baskı yapılabilmektedir.", textEn: "Thanks to offset printing technology, 6-color printing became available on packaging from 500ml to 20lt." },
    { year: "2010", category: "company",     text: "Yeni fabrika binasına taşınma ve üretim kapasitesini artırma.", textEn: "Moved to a new factory building and increased production capacity." },
    { year: "2011", category: "product",     text: "18 litreli 20 lt ambalajlar üretim hattı kuruldu ve 500cc metal ambalaj üretimi başladı.", textEn: "Production line for 18-20 litre packaging was established and 500cc metal packaging production began." },
    { year: "2016", category: "achievement", text: "Kalite belgeleri kazanıldı. Türkiye ve Orta Doğu ülkelerinde satış ağı genişletildi.", textEn: "Quality certificates obtained and sales network expanded in Turkey and Middle Eastern countries." },
    { year: "2017", category: "product",     text: "Gelişen ve büyüyen yapımız için yeni bir fabrika kuruldu. Çevre dostu ve sürdürülebilir üretim anlayışı benimsendi.", textEn: "A new factory was established for our growing structure. Environmentally friendly and sustainable production approach was adopted." },
  ],
};

const CATEGORY_OPTIONS: { value: Category; label: string; icon: React.ElementType }[] = [
  { value: "company",     label: "Şirket",  icon: Factory    },
  { value: "product",     label: "Ürün",    icon: Award      },
  { value: "achievement", label: "Başarı",  icon: TrendingUp },
];

const CATEGORY_COLORS: Record<Category, string> = {
  company:     "bg-blue-100 text-blue-700",
  product:     "bg-emerald-100 text-emerald-700",
  achievement: "bg-purple-100 text-purple-700",
};

type Tab = "hero" | "stats" | "events" | "cta";

export default function TarihceAdminPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [data, setData] = useState<HistoryData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<{
        title?: string; titleEn?: string;
        subtitle?: string; subtitleEn?: string;
        content?: string; contentEn?: string;
        sections?: string;
      }>("/api/content-pages/tarihce");

      const merged = { ...DEFAULTS };
      if (res.title)    merged.title    = res.title;
      if (res.titleEn)  merged.titleEn  = res.titleEn;
      if (res.subtitle) merged.subtitle = res.subtitle;
      if (res.subtitleEn) merged.subtitleEn = res.subtitleEn;
      if (res.content)  merged.content  = res.content;
      if (res.contentEn) merged.contentEn = res.contentEn;
      if (res.sections) {
        try {
          const s = JSON.parse(res.sections);
          if (s.stats)  merged.stats  = { ...DEFAULTS.stats,  ...s.stats };
          if (s.cta)    merged.cta    = { ...DEFAULTS.cta,    ...s.cta };
          if (Array.isArray(s.events) && s.events.length) merged.events = s.events;
        } catch { /* ignore */ }
      }
      setData(merged);
    } catch {
      // 404 or error → keep defaults
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setStatus("idle");
    try {
      const payload = {
        slug: "tarihce",
        title:      data.title,
        titleEn:    data.titleEn,
        subtitle:   data.subtitle,
        subtitleEn: data.subtitleEn,
        content:    data.content,
        contentEn:  data.contentEn,
        sections: JSON.stringify({
          stats:  data.stats,
          cta:    data.cta,
          events: data.events,
        }),
      };

      // Try PUT first (update), if 404 then POST (create)
      try {
        await adminFetch("/api/content-pages/tarihce", {
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
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof HistoryData>(key: K, val: HistoryData[K]) {
    setData((p) => ({ ...p, [key]: val }));
  }

  function setStat(k: keyof HistoryData["stats"], v: string) {
    setData((p) => ({ ...p, stats: { ...p.stats, [k]: v } }));
  }

  function setCta(k: keyof HistoryData["cta"], v: string) {
    setData((p) => ({ ...p, cta: { ...p.cta, [k]: v } }));
  }

  function setEvent(idx: number, k: keyof TimelineEvent, v: string) {
    setData((p) => {
      const evs = [...p.events];
      evs[idx] = { ...evs[idx], [k]: v };
      return { ...p, events: evs };
    });
  }

  function addEvent() {
    setData((p) => ({
      ...p,
      events: [...p.events, { year: String(new Date().getFullYear()), category: "company", text: "", textEn: "" }],
    }));
    setExpandedEvent(data.events.length);
  }

  function removeEvent(idx: number) {
    setData((p) => ({ ...p, events: p.events.filter((_, i) => i !== idx) }));
    setExpandedEvent(null);
  }

  function moveEvent(idx: number, dir: -1 | 1) {
    setData((p) => {
      const evs = [...p.events];
      const swap = idx + dir;
      if (swap < 0 || swap >= evs.length) return p;
      [evs[idx], evs[swap]] = [evs[swap], evs[idx]];
      return { ...p, events: evs };
    });
    setExpandedEvent(idx + dir);
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      tab === t ? "bg-slate-800 text-white shadow" : "text-gray-600 hover:bg-gray-100"
    }`;

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return (
    <AdminShell>
      <div className="flex items-center justify-center h-64">
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
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tarihçe Sayfası</h1>
              <p className="text-sm text-gray-500">Websitesindeki tarihçe içeriğini düzenleyin</p>
            </div>
          </div>
          <a
            href="/tr/tarihce"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("hero")}   onClick={() => setTab("hero")}>   Hero </button>
          <button className={tabClass("stats")}  onClick={() => setTab("stats")}>  İstatistikler </button>
          <button className={tabClass("events")} onClick={() => setTab("events")}>
            Zaman Tüneli
            <span className="ml-1.5 text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5">
              {data.events.length}
            </span>
          </button>
          <button className={tabClass("cta")}    onClick={() => setTab("cta")}>    Alt Bant </button>
        </div>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold">Hero Bölümü</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Başlık (TR)</label>
                <input className={inputCls} value={data.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Başlık (EN)</label>
                <input className={inputCls} value={data.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Alt Başlık / Etiket (TR)</label>
                <input className={inputCls} value={data.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Alt Başlık / Etiket (EN)</label>
                <input className={inputCls} value={data.subtitleEn} onChange={(e) => set("subtitleEn", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Açıklama (TR)</label>
                <textarea rows={3} className={textareaCls} value={data.content} onChange={(e) => set("content", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Açıklama (EN)</label>
                <textarea rows={3} className={textareaCls} value={data.contentEn} onChange={(e) => set("contentEn", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <span className="text-white font-semibold">İstatistik Değerleri</span>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700 mb-6">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                Sayfa üzerindeki 3 büyük istatistik sayısını güncelleyin. Etiketler çeviri dosyasından gelir.
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Yıllık Tecrübe</label>
                  <input className={inputCls} value={data.stats.experience} onChange={(e) => setStat("experience", e.target.value)} placeholder="38+" />
                </div>
                <div>
                  <label className={labelCls}>Üretim Kapasitesi</label>
                  <input className={inputCls} value={data.stats.capacity} onChange={(e) => setStat("capacity", e.target.value)} placeholder="1M+" />
                </div>
                <div>
                  <label className={labelCls}>Ürün Çeşidi</label>
                  <input className={inputCls} value={data.stats.products} onChange={(e) => setStat("products", e.target.value)} placeholder="727" />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center bg-slate-50 rounded-xl p-5 border border-slate-100">
                {[
                  { val: data.stats.experience, label: "Yıllık Tecrübe" },
                  { val: data.stats.capacity,   label: "Üretim Kapasitesi" },
                  { val: data.stats.products,   label: "Ürün Çeşidi" },
                ].map(({ val, label }, i) => (
                  <div key={i} className={i === 1 ? "border-x border-slate-200" : ""}>
                    <p className="text-2xl font-bold text-slate-900">{val}</p>
                    <p className="text-xs text-gray-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── EVENTS ── */}
        {tab === "events" && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              Her olayı ayrı ayrı düzenleyebilir, yeni ekleyebilir veya silebilirsiniz. Sırayı yukarı/aşağı oklarıyla değiştirebilirsiniz.
            </div>

            {data.events.map((ev, idx) => {
              const CatIcon = CATEGORY_OPTIONS.find((o) => o.value === ev.category)?.icon ?? Factory;
              const isOpen = expandedEvent === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Row header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedEvent(isOpen ? null : idx)}
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="text-sm font-bold text-slate-700 w-12 shrink-0">{ev.year}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[ev.category]}`}>
                      <CatIcon className="w-3 h-3" />
                      {CATEGORY_OPTIONS.find((o) => o.value === ev.category)?.label}
                    </span>
                    <p className="flex-1 text-sm text-gray-500 truncate min-w-0">{ev.text || <span className="italic text-gray-300">İçerik yok</span>}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); moveEvent(idx, -1); }} className="p-1 hover:bg-gray-100 rounded-lg" title="Yukarı">
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveEvent(idx, 1); }} className="p-1 hover:bg-gray-100 rounded-lg" title="Aşağı">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeEvent(idx); }} className="p-1 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600" title="Sil">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Yıl</label>
                        <input className={inputCls} value={ev.year} onChange={(e) => setEvent(idx, "year", e.target.value)} placeholder="2024" />
                      </div>
                      <div>
                        <label className={labelCls}>Kategori</label>
                        <select
                          className={inputCls}
                          value={ev.category}
                          onChange={(e) => setEvent(idx, "category", e.target.value as Category)}
                        >
                          {CATEGORY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Metin (TR)</label>
                        <textarea rows={3} className={textareaCls} value={ev.text} onChange={(e) => setEvent(idx, "text", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Metin (EN)</label>
                        <textarea rows={3} className={textareaCls} value={ev.textEn} onChange={(e) => setEvent(idx, "textEn", e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addEvent}
              className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-slate-400 hover:text-slate-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yeni Olay Ekle
            </button>
          </div>
        )}

        {/* ── CTA ── */}
        {tab === "cta" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <span className="text-white font-semibold">Alt Bant (CTA)</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Başlık (TR)</label>
                <input className={inputCls} value={data.cta.title} onChange={(e) => setCta("title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Başlık (EN)</label>
                <input className={inputCls} value={data.cta.titleEn} onChange={(e) => setCta("titleEn", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Açıklama (TR)</label>
                <textarea rows={3} className={textareaCls} value={data.cta.description} onChange={(e) => setCta("description", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Açıklama (EN)</label>
                <textarea rows={3} className={textareaCls} value={data.cta.descriptionEn} onChange={(e) => setCta("descriptionEn", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Save bar ── */}
        <div className="sticky bottom-0 flex items-center justify-between mt-6 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl px-5 py-3 shadow-lg">
          {status === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" /> Kaydedildi.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" /> Bir hata oluştu.
            </div>
          )}
          {status === "idle" && <div />}

          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition disabled:opacity-60 font-medium text-sm"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

