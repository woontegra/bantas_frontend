"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import { mediaUrl } from "@/lib/api";
import {
  Users, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ImagePlus, X, ExternalLink, Briefcase,
  UserCheck, ImageIcon,
} from "lucide-react";

interface PageData {
  title: string; titleEn: string;
  subtitle: string; subtitleEn: string;
  content: string; contentEn: string;
  policy: {
    title: string; titleEn: string;
    paragraphs: string[]; paragraphsEn: string[];
  };
  recruitment: {
    title: string; titleEn: string;
    paragraphs: string[]; paragraphsEn: string[];
  };
  imageSection: {
    title: string; titleEn: string;
    description: string; descriptionEn: string;
    image: string;
  };
}

const DEFAULTS: PageData = {
  title: "İnsan Kaynakları", titleEn: "Human Resources",
  subtitle: "İnsan Kaynaklarımız", subtitleEn: "Our Human Resources",
  content: "Çalışanlarımız en değerli varlığımızdır. İnsan kaynakları politikamız ve işe alım süreçlerimiz hakkında bilgi edinin.",
  contentEn: "Our employees are our most valuable asset. Learn about our human resources policy and recruitment processes.",
  policy: {
    title: "BANTAŞ İnsan Kaynakları Politikası",
    titleEn: "BANTAŞ Human Resources Policy",
    paragraphs: [
      "Samp olmuş başarılı, çalışanlarının işini ve olağanüstü iş yapan ve katılan Bantaş Toplumu insan kaynagı politikasıdır.",
      "Ölçülebilir yaratıcılık aile ve ölçülebilir samp insan görüşü Olmaması korunması.",
      "Farklı katta uzman ve bağlı fikirleriyle bir arada çalışanların yaratıcı potansiyel olmayan.",
      "Çalışanlarınızın kapsad ve meslekel gelişmelerini Sn yararlı konuda, eğitimlerine ve geliştirme.",
    ],
    paragraphsEn: [
      "Bantaş community human resources policy is based on successful, outstanding employees.",
      "Measurable creativity and measurable human perspective without compromise.",
      "Creative potential of employees working together with experts from different levels.",
      "Supporting the professional development of your employees through useful training and development.",
    ],
  },
  recruitment: {
    title: "BANTAŞ Seçme Ve Yerleştirme Süreci",
    titleEn: "BANTAŞ Selection & Placement Process",
    paragraphs: [
      "Bantaş'ta başvurulan pozisyona en uyumlu kaynagı seçebilmek için, ölçülebilir yeterlilik karşılaştırması yapılmaktadır.",
      "Bantaş'ta başvurulan pozisyona en uyumlu kaynagı seçebilmek için, ölçülebilir yeterlilik karşılaştırması yapılmaktadır.",
      "Aday seçim sürecinde tarafsız, nesnel değerleme yapılmasına dikkat ve esas alınmaktadır.",
      "Adayın potansiyel tarafsızlık nesnel değerleme yapılmasına dikkat ve esas alınmaktadır.",
    ],
    paragraphsEn: [
      "In order to select the most suitable candidate for the applied position at Bantaş, measurable competency comparisons are made.",
      "In order to select the most suitable candidate for the applied position, measurable competency comparisons are made.",
      "Attention is paid to objective, impartial evaluation in the candidate selection process.",
      "Attention is paid to objective, impartial evaluation of the candidate's potential.",
    ],
  },
  imageSection: {
    title: "Çalışanlarımız İle Zirveye Adımızı Yazdırdık",
    titleEn: "We Reached the Summit with Our Employees",
    description: "Çalışanlarımızın hepsi ve güçlü ekibi ile sağladığımız önemli yetkinliklere, üretimimiz üzerli başarılarımızın en büyük etken olan çalışan memnuniyetinin devamını sağlıyoruz.",
    descriptionEn: "With our entire team and the important competencies we have achieved, we continue to ensure employee satisfaction, which is the biggest factor behind our production successes.",
    image: "",
  },
};

type Tab = "hero" | "policy" | "recruitment" | "image";

interface ContentPageData {
  title?: string; titleEn?: string;
  subtitle?: string; subtitleEn?: string;
  content?: string; contentEn?: string;
  sections?: string;
}

export default function InsanKaynaklariAdminPage() {
  const [tab, setTab]         = useState<Tab>("hero");
  const [data, setData]       = useState<PageData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [status, setStatus]   = useState<"idle" | "success" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/insan-kaynaklari");
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
          if (s.policy)      merged.policy      = { ...DEFAULTS.policy,      ...s.policy };
          if (s.recruitment) merged.recruitment = { ...DEFAULTS.recruitment, ...s.recruitment };
          if (s.imageSection) merged.imageSection = { ...DEFAULTS.imageSection, ...s.imageSection };
        } catch { /* keep defaults */ }
      }
      setData(merged);
    } catch { /* keep defaults */ }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      const payload = {
        slug: "insan-kaynaklari",
        title: data.title, titleEn: data.titleEn,
        subtitle: data.subtitle, subtitleEn: data.subtitleEn,
        content: data.content, contentEn: data.contentEn,
        sections: JSON.stringify({
          policy: data.policy,
          recruitment: data.recruitment,
          imageSection: data.imageSection,
        }),
      };
      try {
        await adminFetch("/api/content-pages/insan-kaynaklari", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  function setF<K extends keyof PageData>(k: K, v: PageData[K]) { setData((p) => ({ ...p, [k]: v })); }
  function setPolicyField(k: keyof PageData["policy"], v: string | string[]) {
    setData((p) => ({ ...p, policy: { ...p.policy, [k]: v } }));
  }
  function setRecruitField(k: keyof PageData["recruitment"], v: string | string[]) {
    setData((p) => ({ ...p, recruitment: { ...p.recruitment, [k]: v } }));
  }
  function setImgField(k: keyof PageData["imageSection"], v: string) {
    setData((p) => ({ ...p, imageSection: { ...p.imageSection, [k]: v } }));
  }

  // Paragraph helpers
  function setPara(section: "policy" | "recruitment", lang: "tr" | "en", idx: number, val: string) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    if (section === "policy") {
      const arr = [...data.policy[key]]; arr[idx] = val;
      setPolicyField(key, arr);
    } else {
      const arr = [...data.recruitment[key]]; arr[idx] = val;
      setRecruitField(key, arr);
    }
  }
  function addPara(section: "policy" | "recruitment", lang: "tr" | "en") {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    if (section === "policy") setPolicyField(key, [...data.policy[key], ""]);
    else setRecruitField(key, [...data.recruitment[key], ""]);
  }
  function removePara(section: "policy" | "recruitment", lang: "tr" | "en", idx: number) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    if (section === "policy") setPolicyField(key, data.policy[key].filter((_, i) => i !== idx));
    else setRecruitField(key, data.recruitment[key].filter((_, i) => i !== idx));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminUpload("/api/upload", fd);
      if (res?.url) setImgField("image", res.url);
    } catch { alert("Görsel yüklenemedi."); }
    finally { setUploading(false); }
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`;
  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400";
  const ta  = `${inp} resize-none`;
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  const ParagraphsEditor = ({
    section, lang, items,
  }: { section: "policy" | "recruitment"; lang: "tr" | "en"; items: string[] }) => (
    <div className="space-y-2">
      {items.map((p, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2.5 text-xs text-gray-400 w-4 shrink-0 text-right">{i + 1}.</span>
          <textarea
            rows={2}
            className={`${ta} flex-1`}
            value={p}
            onChange={(e) => setPara(section, lang, i, e.target.value)}
          />
          <button onClick={() => removePara(section, lang, i)} className="mt-2.5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={() => addPara(section, lang)} className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 mt-1">
        <Plus className="w-4 h-4" /> Paragraf Ekle
      </button>
    </div>
  );

  return (
    <AdminShell>
      <div className="p-6 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">İnsan Kaynakları</h1>
              <p className="text-sm text-gray-500">Sayfa içeriklerini düzenleyin</p>
            </div>
          </div>
          <a href="/tr/insan-kaynaklari" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("hero")}       onClick={() => setTab("hero")}>Hero</button>
          <button className={tabClass("policy")}     onClick={() => setTab("policy")}>İK Politikası</button>
          <button className={tabClass("recruitment")} onClick={() => setTab("recruitment")}>Seçme & Yerleştirme</button>
          <button className={tabClass("image")}      onClick={() => setTab("image")}>Görsel Bölümü</button>
        </div>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
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

        {/* ── POLICY ── */}
        {tab === "policy" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">İnsan Kaynakları Politikası</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={lbl}>Bölüm Başlığı (TR)</label><input className={inp} value={data.policy.title} onChange={(e) => setPolicyField("title", e.target.value)} /></div>
                <div><label className={lbl}>Bölüm Başlığı (EN)</label><input className={inp} value={data.policy.titleEn} onChange={(e) => setPolicyField("titleEn", e.target.value)} /></div>
              </div>
              <div>
                <label className={`${lbl} text-sm font-semibold text-gray-800 mb-3`}>Paragraflar (TR)</label>
                <ParagraphsEditor section="policy" lang="tr" items={data.policy.paragraphs} />
              </div>
              <div>
                <label className={`${lbl} text-sm font-semibold text-gray-800 mb-3`}>Paragraflar (EN)</label>
                <ParagraphsEditor section="policy" lang="en" items={data.policy.paragraphsEn} />
              </div>
            </div>
          </div>
        )}

        {/* ── RECRUITMENT ── */}
        {tab === "recruitment" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Seçme ve Yerleştirme Süreci</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={lbl}>Bölüm Başlığı (TR)</label><input className={inp} value={data.recruitment.title} onChange={(e) => setRecruitField("title", e.target.value)} /></div>
                <div><label className={lbl}>Bölüm Başlığı (EN)</label><input className={inp} value={data.recruitment.titleEn} onChange={(e) => setRecruitField("titleEn", e.target.value)} /></div>
              </div>
              <div>
                <label className={`${lbl} text-sm font-semibold text-gray-800 mb-3`}>Paragraflar (TR)</label>
                <ParagraphsEditor section="recruitment" lang="tr" items={data.recruitment.paragraphs} />
              </div>
              <div>
                <label className={`${lbl} text-sm font-semibold text-gray-800 mb-3`}>Paragraflar (EN)</label>
                <ParagraphsEditor section="recruitment" lang="en" items={data.recruitment.paragraphsEn} />
              </div>
            </div>
          </div>
        )}

        {/* ── IMAGE SECTION ── */}
        {tab === "image" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-300" />
              <span className="text-white font-semibold">Görsel Bölümü</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.imageSection.title} onChange={(e) => setImgField("title", e.target.value)} /></div>
                <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.imageSection.titleEn} onChange={(e) => setImgField("titleEn", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Açıklama (TR)</label><textarea rows={3} className={ta} value={data.imageSection.description} onChange={(e) => setImgField("description", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={lbl}>Açıklama (EN)</label><textarea rows={3} className={ta} value={data.imageSection.descriptionEn} onChange={(e) => setImgField("descriptionEn", e.target.value)} /></div>
              </div>

              {/* Image uploader */}
              <div>
                <label className={lbl}>Takım Görseli</label>
                <input type="file" accept="image/*" ref={imgRef} className="hidden"
                  onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadImage(f); e.target.value = ""; }}
                />
                <div className="flex items-start gap-4">
                  <div className="relative h-40 w-64 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {data.imageSection.image ? (
                      <img src={mediaUrl(data.imageSection.image)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => imgRef.current?.click()} disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
                      {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                      {uploading ? "Yükleniyor…" : "Görsel Yükle"}
                    </button>
                    {data.imageSection.image && (
                      <button onClick={() => setImgField("image", "")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-sm text-red-500 hover:bg-red-50 transition">
                        <X className="w-4 h-4" /> Görseli Kaldır
                      </button>
                    )}
                    <p className="text-xs text-gray-400 max-w-[200px]">16:9 en-boy oranında geniş görsel önerilir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save bar */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>}
          {status === "error"   && <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>}
          {status === "idle"    && <div />}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-60 font-medium text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

