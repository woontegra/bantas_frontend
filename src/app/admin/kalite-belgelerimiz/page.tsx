"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import { mediaUrl } from "@/lib/api";
import {
  Award, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ImagePlus, X, ExternalLink, Info,
  ChevronDown, ChevronUp, Eye, EyeOff,
} from "lucide-react";

interface Certificate {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  standards: string[];
  image: string;
  active: boolean;
}

interface PageData {
  title: string; titleEn: string;
  subtitle: string; subtitleEn: string;
  content: string; contentEn: string;
  intro: { title: string; titleEn: string; text: string; textEn: string };
  footer: { title: string; titleEn: string; description: string; descriptionEn: string };
  certificates: Certificate[];
}

const DEFAULTS: PageData = {
  title: "Kalite Belgelerimiz", titleEn: "Our Quality Certificates",
  subtitle: "Kalite ve Standartlar",  subtitleEn: "Quality & Standards",
  content: "Uluslararası kalite standartlarına uygun üretim yapan firmamız, sahip olduğu belgelerle müşterilerimize güven vermektedir.",
  contentEn: "Our company, producing in accordance with international quality standards, provides confidence to our customers with its certificates.",
  intro: {
    title: "Kalite Güvencemiz", titleEn: "Our Quality Assurance",
    text: "Firmamız, kalite yönetim sistemleri, çevre yönetimi, iş sağlığı ve güvenliği, gıda güvenliği konularında uluslararası standartlara sahiptir.",
    textEn: "Our company holds international standards in quality management systems, environmental management, occupational health & safety, and food safety.",
  },
  footer: {
    title: "Kalite Taahhüdümüz", titleEn: "Our Quality Commitment",
    description: "Bantaş olarak, kalite standartlarımızı sürekli geliştirmeye ve müşterilerimize en yüksek kalitede ürün ve hizmet sunmaya devam ediyoruz.",
    descriptionEn: "As Bantaş, we continue to continuously improve our quality standards and provide our customers with the highest quality products and services.",
  },
  certificates: [
    { title: "ISO 9001:2015 Kalite Yönetim Sistemi", titleEn: "ISO 9001:2015 Quality Management System", description: "ISO 9001:2015 Kalite Yönetim Sistemi belgesi, firmamızın kalite yönetim sisteminin uluslararası standartlara uygun olduğunu göstermektedir.", descriptionEn: "The ISO 9001:2015 Quality Management System certificate demonstrates that our quality management system complies with international standards.", standards: ["ISO 9001:2015"], image: "", active: true },
    { title: "ISO 14001:2015 Çevre Yönetim Sistemi", titleEn: "ISO 14001:2015 Environmental Management System", description: "ISO 14001:2015 Çevre Yönetim Sistemi belgesi, firmamızın çevreye duyarlı üretim yapma taahhüdünü göstermektedir.", descriptionEn: "The ISO 14001:2015 Environmental Management System certificate demonstrates our commitment to environmentally sensitive production.", standards: ["ISO 14001:2015"], image: "", active: true },
    { title: "ISO 45001:2018 İş Sağlığı ve Güvenliği", titleEn: "ISO 45001:2018 Occupational Health & Safety", description: "ISO 45001:2018 İş Sağlığı ve Güvenliği Yönetim Sistemi belgesi, çalışanlarımızın sağlığını ve güvenliğini korumak için gerekli tüm önlemleri aldığımızı göstermektedir.", descriptionEn: "The ISO 45001:2018 certificate demonstrates that we take all necessary measures to protect the health and safety of our employees.", standards: ["ISO 45001:2018"], image: "", active: true },
    { title: "ISO 22000:2018 Gıda Güvenliği Yönetim Sistemi", titleEn: "ISO 22000:2018 Food Safety Management System", description: "ISO 22000:2018 Gıda Güvenliği Yönetim Sistemi belgesi, gıda ile temas eden ambalaj üretimimizin uluslararası gıda güvenliği standartlarına uygun olduğunu göstermektedir.", descriptionEn: "The ISO 22000:2018 certificate demonstrates that our food-contact packaging production complies with international food safety standards.", standards: ["ISO 22000:2018"], image: "", active: true },
    { title: "Helal Gıda Sertifikası", titleEn: "Halal Food Certificate", description: "Helal Gıda Sertifikası, üretim süreçlerimizin ve ürünlerimizin İslami kurallara uygun olduğunu göstermektedir.", descriptionEn: "The Halal Food Certificate demonstrates that our production processes and products comply with Islamic rules.", standards: [], image: "", active: true },
  ],
};

type Tab = "hero" | "intro" | "certs" | "footer";

export default function KaliteBelgelerimizAdminPage() {
  const [tab, setTab]       = useState<Tab>("hero");
  const [data, setData]     = useState<PageData>(DEFAULTS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [expanded, setExpanded] = useState<number | null>(0);
  const [uploading, setUploading] = useState<number | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const activeCert = useRef<number>(-1);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/kalite-belgelerimiz");
      const merged = { ...DEFAULTS };
      if (res.title)      merged.title      = res.title;
      if (res.titleEn)    merged.titleEn    = res.titleEn;
      if (res.subtitle)   merged.subtitle   = res.subtitle;
      if (res.subtitleEn) merged.subtitleEn = res.subtitleEn;
      if (res.content)    merged.content    = res.content;
      if (res.contentEn)  merged.contentEn  = res.contentEn;
      if (res.sections) {
        try {
          const s = JSON.parse(res.sections);
          if (s.intro)  merged.intro  = { ...DEFAULTS.intro,  ...s.intro };
          if (s.footer) merged.footer = { ...DEFAULTS.footer, ...s.footer };
          if (Array.isArray(s.certificates) && s.certificates.length) merged.certificates = s.certificates;
        } catch { /* ignore */ }
      }
      setData(merged);
    } catch { /* keep defaults */ }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      const payload = {
        slug: "kalite-belgelerimiz",
        title: data.title, titleEn: data.titleEn,
        subtitle: data.subtitle, subtitleEn: data.subtitleEn,
        content: data.content, contentEn: data.contentEn,
        sections: JSON.stringify({ intro: data.intro, footer: data.footer, certificates: data.certificates }),
      };
      try {
        await adminFetch("/api/content-pages/kalite-belgelerimiz", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  function setF<K extends keyof PageData>(k: K, v: PageData[K]) { setData((p) => ({ ...p, [k]: v })); }
  function setIntro(k: keyof PageData["intro"], v: string) { setData((p) => ({ ...p, intro: { ...p.intro, [k]: v } })); }
  function setFooter(k: keyof PageData["footer"], v: string) { setData((p) => ({ ...p, footer: { ...p.footer, [k]: v } })); }
  function setCert<K extends keyof Certificate>(idx: number, k: K, v: Certificate[K]) {
    setData((p) => { const c = [...p.certificates]; c[idx] = { ...c[idx], [k]: v }; return { ...p, certificates: c }; });
  }
  function addCert() {
    setData((p) => ({ ...p, certificates: [...p.certificates, { title: "", titleEn: "", description: "", descriptionEn: "", standards: [], image: "", active: true }] }));
    setExpanded(data.certificates.length);
  }
  function removeCert(idx: number) { setData((p) => ({ ...p, certificates: p.certificates.filter((_, i) => i !== idx) })); setExpanded(null); }
  function addStandard(idx: number) { setCert(idx, "standards", [...data.certificates[idx].standards, ""]); }
  function setStandard(cIdx: number, sIdx: number, v: string) {
    const s = [...data.certificates[cIdx].standards]; s[sIdx] = v;
    setCert(cIdx, "standards", s);
  }
  function removeStandard(cIdx: number, sIdx: number) { setCert(cIdx, "standards", data.certificates[cIdx].standards.filter((_, i) => i !== sIdx)); }

  async function uploadImage(certIdx: number, file: File) {
    setUploading(certIdx);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminUpload("/api/upload", fd) as any;
      if (res?.url) setCert(certIdx, "image", res.url);
    } catch { alert("Görsel yüklenemedi."); }
    finally { setUploading(null); }
  }

  const tabClass = (t: Tab) => `px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`;
  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400";
  const ta  = `${inp} resize-none`;
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="p-6 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kalite Belgelerimiz</h1>
              <p className="text-sm text-gray-500">Sertifika içeriklerini ve görsellerini düzenleyin</p>
            </div>
          </div>
          <a href="/tr/kalite-belgelerimiz" target="_blank" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("hero")}  onClick={() => setTab("hero")}>Hero</button>
          <button className={tabClass("intro")} onClick={() => setTab("intro")}>Giriş Kartı</button>
          <button className={tabClass("certs")} onClick={() => setTab("certs")}>
            Sertifikalar
            <span className="ml-1.5 bg-gray-200 text-gray-600 text-xs rounded-full px-1.5 py-0.5">{data.certificates.length}</span>
          </button>
          <button className={tabClass("footer")} onClick={() => setTab("footer")}>Alt Bant</button>
        </div>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Hero Bölümü</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.title} onChange={(e) => setF("title", e.target.value)} /></div>
              <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.titleEn} onChange={(e) => setF("titleEn", e.target.value)} /></div>
              <div><label className={lbl}>Alt Başlık (TR)</label><input className={inp} value={data.subtitle} onChange={(e) => setF("subtitle", e.target.value)} /></div>
              <div><label className={lbl}>Alt Başlık (EN)</label><input className={inp} value={data.subtitleEn} onChange={(e) => setF("subtitleEn", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Açıklama (TR)</label><textarea rows={2} className={ta} value={data.content} onChange={(e) => setF("content", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Açıklama (EN)</label><textarea rows={2} className={ta} value={data.contentEn} onChange={(e) => setF("contentEn", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* ── INTRO ── */}
        {tab === "intro" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <span className="text-white font-semibold">Giriş Bilgi Kartı (Mavi Banner)</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.intro.title} onChange={(e) => setIntro("title", e.target.value)} /></div>
              <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.intro.titleEn} onChange={(e) => setIntro("titleEn", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Metin (TR)</label><textarea rows={3} className={ta} value={data.intro.text} onChange={(e) => setIntro("text", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Metin (EN)</label><textarea rows={3} className={ta} value={data.intro.textEn} onChange={(e) => setIntro("textEn", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* ── CERTS ── */}
        {tab === "certs" && (
          <div className="space-y-3">
            <input type="file" accept="image/*" ref={imgRef} className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && activeCert.current >= 0) await uploadImage(activeCert.current, file);
                e.target.value = "";
              }}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              Her sertifika kartını açıp düzenleyebilir, görsel yükleyebilir ve gizleyebilirsiniz. Yeni sertifika ekleyebilirsiniz.
            </div>

            {data.certificates.map((cert, idx) => {
              const isOpen = expanded === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : idx)}>
                    <div className="relative h-10 w-10 shrink-0 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden">
                      {cert.image
                        ? <img src={mediaUrl(cert.image)} alt="" className="h-full w-full object-contain p-1" />
                        : <Award className="m-auto h-5 w-5 text-gray-300 mt-2.5" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${cert.active ? "text-gray-900" : "text-gray-400 line-through"}`}>
                        {cert.title || `Sertifika ${idx + 1}`}
                      </p>
                      <div className="flex gap-1.5 mt-0.5">
                        {cert.standards.map((s) => <span key={s} className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setCert(idx, "active", !cert.active); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg" title={cert.active ? "Gizle" : "Göster"}>
                        {cert.active ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeCert(idx); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={cert.title} onChange={(e) => setCert(idx, "title", e.target.value)} /></div>
                        <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={cert.titleEn} onChange={(e) => setCert(idx, "titleEn", e.target.value)} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Açıklama (TR)</label><textarea rows={3} className={ta} value={cert.description} onChange={(e) => setCert(idx, "description", e.target.value)} /></div>
                        <div className="sm:col-span-2"><label className={lbl}>Açıklama (EN)</label><textarea rows={3} className={ta} value={cert.descriptionEn} onChange={(e) => setCert(idx, "descriptionEn", e.target.value)} /></div>
                      </div>

                      {/* Standards */}
                      <div>
                        <label className={lbl}>Standart Etiketleri</label>
                        <div className="space-y-2 mb-2">
                          {cert.standards.map((s, si) => (
                            <div key={si} className="flex items-center gap-2">
                              <input className={`${inp} flex-1`} value={s} onChange={(e) => setStandard(idx, si, e.target.value)} placeholder="örn. ISO 9001:2015" />
                              <button onClick={() => removeStandard(idx, si)} className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"><X className="w-4 h-4" /></button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => addStandard(idx)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
                          <Plus className="w-4 h-4" /> Standart Ekle
                        </button>
                      </div>

                      {/* Image */}
                      <div>
                        <label className={lbl}>Sertifika Görseli</label>
                        <div className="flex items-start gap-4">
                          <div className="h-32 w-24 shrink-0 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                            {cert.image
                              ? <img src={mediaUrl(cert.image)} alt="" className="h-full w-full object-contain p-2" />
                              : <div className="flex h-full items-center justify-center"><Award className="h-8 w-8 text-gray-200" /></div>
                            }
                          </div>
                          <div className="space-y-2">
                            <button
                              onClick={() => { activeCert.current = idx; imgRef.current?.click(); }}
                              disabled={uploading === idx}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              {uploading === idx ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                              {uploading === idx ? "Yükleniyor…" : "Görsel Yükle"}
                            </button>
                            {cert.image && (
                              <button onClick={() => setCert(idx, "image", "")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-sm text-red-500 hover:bg-red-50 transition">
                                <X className="w-4 h-4" /> Görseli Kaldır
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={addCert} className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
              <Plus className="w-4 h-4" /> Yeni Sertifika Ekle
            </button>
          </div>
        )}

        {/* ── FOOTER ── */}
        {tab === "footer" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <span className="text-white font-semibold">Alt Bant (CTA)</span>
            </div>
            <div className="p-6 grid gap-5 sm:grid-cols-2">
              <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.footer.title} onChange={(e) => setFooter("title", e.target.value)} /></div>
              <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.footer.titleEn} onChange={(e) => setFooter("titleEn", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Açıklama (TR)</label><textarea rows={3} className={ta} value={data.footer.description} onChange={(e) => setFooter("description", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Açıklama (EN)</label><textarea rows={3} className={ta} value={data.footer.descriptionEn} onChange={(e) => setFooter("descriptionEn", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* ── Save bar ── */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>}
          {status === "error"   && <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>}
          {status === "idle"    && <div />}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-60 font-medium text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

interface ContentPageData {
  title?: string; titleEn?: string;
  subtitle?: string; subtitleEn?: string;
  content?: string; contentEn?: string;
  sections?: string;
}

