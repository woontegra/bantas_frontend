"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import { mediaUrl } from "@/lib/api";
import {
  Heart, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ImagePlus, X, ExternalLink, TreePine,
  Users, Lightbulb, ChevronDown, ChevronUp, ImageIcon,
} from "lucide-react";

interface Project {
  title: string;
  titleEn: string;
  paragraphs: string[];
  paragraphsEn: string[];
}

interface PageData {
  title: string; titleEn: string;
  subtitle: string; subtitleEn: string;
  content: string; contentEn: string;
  intro: {
    title: string; titleEn: string;
    paragraphs: string[]; paragraphsEn: string[];
    image: string;
  };
  projectsTitle: string; projectsTitleEn: string;
  projects: Project[];
  footer: { title: string; titleEn: string; description: string; descriptionEn: string };
}

const DEFAULTS: PageData = {
  title: "Sosyal Sorumluluk", titleEn: "Social Responsibility",
  subtitle: "Sosyal Sorumluluğumuz", subtitleEn: "Our Social Responsibility",
  content: "Topluma ve çevreye karşı sorumluluğumuzun bilincindeyiz. Sosyal sorumluluk projelerimiz ve çevre duyarlılığımız hakkında bilgi edinin.",
  contentEn: "We are aware of our responsibility towards society and the environment. Learn about our social responsibility projects and environmental sensitivity.",
  intro: {
    title: "SOSYAL SORUMLULUĞUMUZUN BİLİNCİNDEYİZ.",
    titleEn: "WE ARE AWARE OF OUR SOCIAL RESPONSIBILITY.",
    paragraphs: [
      "Bantaş A.Ş. olarak, sosyal sorumluluk bilinci taşımakın, ülkemizin sosyal kalkınma yönünde.",
      "Nasıl ki, çalışanlarımız, ailelerimiz, topluma katkı sağlama konusunda.",
      "Topluma Ve Çevreye Destek Olmamız Tarzı faaliyetlere toplamızın sosyal ve ölçme sağlık emeği, zaman ve yatırım.",
    ],
    paragraphsEn: [
      "As Bantaş A.Ş., we carry a sense of social responsibility towards the social development of our country.",
      "Just as we contribute to our employees, our families, and society.",
      "We invest our time and effort in activities that support society and the environment.",
    ],
    image: "",
  },
  projectsTitle: "Eğitim Alan Seni Destekliyor Projesi",
  projectsTitleEn: "Education Support Project",
  projects: [
    {
      title: "Doğal kaynakların korunması bizim görevimizdir",
      titleEn: "Protecting natural resources is our duty",
      paragraphs: [
        "Bantaş A.Ş. bütünleşme, olumunu fikirlerin kışımız, geri dönüşüm kazandırmaktadır için.",
        "Diğer olarak ki cins kapı atik kullanma iştiraksiz geri dönüşümü sağlamak, yeniş tam tarafları.",
      ],
      paragraphsEn: [
        "Bantaş A.Ş. is committed to recycling and sustainable use of natural resources.",
        "We aim to maximize recycling and minimize waste across all our operations.",
      ],
    },
    {
      title: "Toplum ve Çevre Destek İnitiatifleri",
      titleEn: "Community & Environment Support Initiatives",
      paragraphs: [
        "Gelişmekte olanınızı toplamızın sosyal ve ölçme sağlık emeği, zaman ve yatırım.",
        "Kullanılan yasan etkinliklere yapılmaktadır öncelikle verip katkıları desteklemektedir.",
      ],
      paragraphsEn: [
        "We invest time and resources in the social and health development of our community.",
        "We prioritize contributing to and supporting community events and initiatives.",
      ],
    },
    {
      title: "Eğitim ve Gelecek Nesiller",
      titleEn: "Education and Future Generations",
      paragraphs: [
        "Gelişmekte ortama etkinlerin güvenli ile kapı yarıştırmaları etkinliklere.",
        "Gelir ortama etkinlerin güvenli ile kapı yarıştırmaları etkinliklere yapılmaktadır.",
      ],
      paragraphsEn: [
        "We support educational initiatives that create safe environments for future generations.",
        "We invest in programs that empower young people through education and opportunity.",
      ],
    },
  ],
  footer: {
    title: "Sosyal Sorumluluk Taahhüdümüz",
    titleEn: "Our Social Responsibility Commitment",
    description: "Bantaş olarak, topluma ve çevreye karşı sorumluluğumuzun bilincinde olarak, sürdürülebilir projeler geliştirmeye ve gelecek nesillere daha yaşanabilir bir dünya bırakmaya devam ediyoruz.",
    descriptionEn: "As Bantaş, aware of our responsibility to society and the environment, we continue to develop sustainable projects and leave a more livable world for future generations.",
  },
};

type Tab = "hero" | "intro" | "projects" | "footer";

interface ContentPageData {
  title?: string; titleEn?: string;
  subtitle?: string; subtitleEn?: string;
  content?: string; contentEn?: string;
  sections?: string;
}

export default function SosyalSorumlulukAdminPage() {
  const [tab, setTab]           = useState<Tab>("hero");
  const [data, setData]         = useState<PageData>(DEFAULTS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [expanded, setExpanded] = useState<number | null>(0);
  const [uploadingIntro, setUploadingIntro] = useState(false);
  const introImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/sosyal-sorumluluk");
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
          if (s.intro)          merged.intro          = { ...DEFAULTS.intro, ...s.intro };
          if (s.projectsTitle)  merged.projectsTitle  = s.projectsTitle;
          if (s.projectsTitleEn)merged.projectsTitleEn= s.projectsTitleEn;
          if (Array.isArray(s.projects) && s.projects.length) merged.projects = s.projects;
          if (s.footer)         merged.footer         = { ...DEFAULTS.footer, ...s.footer };
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
        slug: "sosyal-sorumluluk",
        title: data.title, titleEn: data.titleEn,
        subtitle: data.subtitle, subtitleEn: data.subtitleEn,
        content: data.content, contentEn: data.contentEn,
        sections: JSON.stringify({
          intro: data.intro,
          projectsTitle: data.projectsTitle,
          projectsTitleEn: data.projectsTitleEn,
          projects: data.projects,
          footer: data.footer,
        }),
      };
      try {
        await adminFetch("/api/content-pages/sosyal-sorumluluk", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  function setF<K extends keyof PageData>(k: K, v: PageData[K]) { setData((p) => ({ ...p, [k]: v })); }
  function setIntro(k: keyof PageData["intro"], v: string | string[]) { setData((p) => ({ ...p, intro: { ...p.intro, [k]: v } })); }
  function setFooter(k: keyof PageData["footer"], v: string) { setData((p) => ({ ...p, footer: { ...p.footer, [k]: v } })); }

  function setProject<K extends keyof Project>(idx: number, k: K, v: Project[K]) {
    setData((p) => { const arr = [...p.projects]; arr[idx] = { ...arr[idx], [k]: v }; return { ...p, projects: arr }; });
  }
  function addProject() {
    setData((p) => ({ ...p, projects: [...p.projects, { title: "", titleEn: "", paragraphs: [""], paragraphsEn: [""] }] }));
    setExpanded(data.projects.length);
  }
  function removeProject(idx: number) { setData((p) => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) })); setExpanded(null); }

  function setPara(projIdx: number, lang: "tr" | "en", paraIdx: number, val: string) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    const arr = [...data.projects[projIdx][key]]; arr[paraIdx] = val;
    setProject(projIdx, key, arr);
  }
  function addPara(projIdx: number, lang: "tr" | "en") {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    setProject(projIdx, key, [...data.projects[projIdx][key], ""]);
  }
  function removePara(projIdx: number, lang: "tr" | "en", paraIdx: number) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    setProject(projIdx, key, data.projects[projIdx][key].filter((_, i) => i !== paraIdx));
  }

  function setIntroPara(lang: "tr" | "en", idx: number, val: string) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    const arr = [...(data.intro[key] as string[])]; arr[idx] = val;
    setIntro(key, arr);
  }
  function addIntroPara(lang: "tr" | "en") {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    setIntro(key, [...(data.intro[key] as string[]), ""]);
  }
  function removeIntroPara(lang: "tr" | "en", idx: number) {
    const key = lang === "tr" ? "paragraphs" : "paragraphsEn";
    setIntro(key, (data.intro[key] as string[]).filter((_, i) => i !== idx));
  }

  async function uploadIntroImage(file: File) {
    setUploadingIntro(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminUpload("/api/upload", fd) as any;
      if (res?.url) setIntro("image", res.url);
    } catch { alert("Görsel yüklenemedi."); }
    finally { setUploadingIntro(false); }
  }

  const PROJECT_ICONS = [TreePine, Users, Lightbulb];
  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`;
  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400";
  const ta  = `${inp} resize-none`;
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sosyal Sorumluluk</h1>
              <p className="text-sm text-gray-500">Sayfa içeriklerini düzenleyin</p>
            </div>
          </div>
          <a href="/tr/sosyal-sorumluluk" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("hero")}     onClick={() => setTab("hero")}>Hero</button>
          <button className={tabClass("intro")}    onClick={() => setTab("intro")}>Giriş</button>
          <button className={tabClass("projects")} onClick={() => setTab("projects")}>
            Projeler
            <span className="ml-1.5 bg-gray-200 text-gray-600 text-xs rounded-full px-1.5 py-0.5">{data.projects.length}</span>
          </button>
          <button className={tabClass("footer")}   onClick={() => setTab("footer")}>Alt Bant</button>
        </div>

        {/* ── HERO ── */}
        {tab === "hero" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-400" />
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
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <span className="text-white font-semibold">Giriş Bölümü</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.intro.title} onChange={(e) => setIntro("title", e.target.value)} /></div>
                <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.intro.titleEn} onChange={(e) => setIntro("titleEn", e.target.value)} /></div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Paragraflar (TR)</p>
                  <div className="space-y-2">
                    {data.intro.paragraphs.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-2.5 text-xs text-gray-400 w-4 shrink-0 text-right">{i + 1}.</span>
                        <textarea rows={2} className={`${ta} flex-1`} value={p} onChange={(e) => setIntroPara("tr", i, e.target.value)} />
                        <button onClick={() => removeIntroPara("tr", i)} className="mt-2.5 p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addIntroPara("tr")} className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 mt-1">
                      <Plus className="w-4 h-4" /> Paragraf Ekle
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Paragraflar (EN)</p>
                  <div className="space-y-2">
                    {data.intro.paragraphsEn.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-2.5 text-xs text-gray-400 w-4 shrink-0 text-right">{i + 1}.</span>
                        <textarea rows={2} className={`${ta} flex-1`} value={p} onChange={(e) => setIntroPara("en", i, e.target.value)} />
                        <button onClick={() => removeIntroPara("en", i)} className="mt-2.5 p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button onClick={() => addIntroPara("en")} className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 mt-1">
                      <Plus className="w-4 h-4" /> Paragraf Ekle
                    </button>
                  </div>
                </div>
              </div>

              {/* Intro image */}
              <div>
                <label className={lbl}>Yan Görsel</label>
                <input type="file" accept="image/*" ref={introImgRef} className="hidden"
                  onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadIntroImage(f); e.target.value = ""; }}
                />
                <div className="flex items-start gap-4">
                  <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    {data.intro.image
                      ? <img src={mediaUrl(data.intro.image)} alt="" className="h-full w-full object-contain p-2" />
                      : <div className="flex h-full items-center justify-center"><ImageIcon className="h-8 w-8 text-gray-200" /></div>
                    }
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => introImgRef.current?.click()} disabled={uploadingIntro}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
                      {uploadingIntro ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                      {uploadingIntro ? "Yükleniyor…" : "Görsel Yükle"}
                    </button>
                    {data.intro.image && (
                      <button onClick={() => setIntro("image", "")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-sm text-red-500 hover:bg-red-50 transition">
                        <X className="w-4 h-4" /> Görseli Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === "projects" && (
          <div className="space-y-4">
            {/* Projects heading */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Projeler Bölümü Başlığı</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={data.projectsTitle} onChange={(e) => setF("projectsTitle", e.target.value)} /></div>
                <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={data.projectsTitleEn} onChange={(e) => setF("projectsTitleEn", e.target.value)} /></div>
              </div>
            </div>

            {/* Project items */}
            {data.projects.map((proj, idx) => {
              const Icon = PROJECT_ICONS[idx % PROJECT_ICONS.length];
              const isOpen = expanded === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : idx)}>
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="flex-1 font-medium text-gray-900 truncate">{proj.title || `Proje ${idx + 1}`}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); removeProject(idx); }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><label className={lbl}>Başlık (TR)</label><input className={inp} value={proj.title} onChange={(e) => setProject(idx, "title", e.target.value)} /></div>
                        <div><label className={lbl}>Başlık (EN)</label><input className={inp} value={proj.titleEn} onChange={(e) => setProject(idx, "titleEn", e.target.value)} /></div>
                      </div>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Paragraflar (TR)</p>
                          <div className="space-y-2">
                            {proj.paragraphs.map((p, pi) => (
                              <div key={pi} className="flex items-start gap-2">
                                <span className="mt-2.5 text-xs text-gray-400 w-4 shrink-0 text-right">{pi + 1}.</span>
                                <textarea rows={2} className={`${ta} flex-1`} value={p} onChange={(e) => setPara(idx, "tr", pi, e.target.value)} />
                                <button onClick={() => removePara(idx, "tr", pi)} className="mt-2.5 p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            ))}
                            <button onClick={() => addPara(idx, "tr")} className="flex items-center gap-1.5 text-sm text-green-600 mt-1">
                              <Plus className="w-4 h-4" /> Paragraf Ekle
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-3">Paragraflar (EN)</p>
                          <div className="space-y-2">
                            {proj.paragraphsEn.map((p, pi) => (
                              <div key={pi} className="flex items-start gap-2">
                                <span className="mt-2.5 text-xs text-gray-400 w-4 shrink-0 text-right">{pi + 1}.</span>
                                <textarea rows={2} className={`${ta} flex-1`} value={p} onChange={(e) => setPara(idx, "en", pi, e.target.value)} />
                                <button onClick={() => removePara(idx, "en", pi)} className="mt-2.5 p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><X className="w-3.5 h-3.5" /></button>
                              </div>
                            ))}
                            <button onClick={() => addPara(idx, "en")} className="flex items-center gap-1.5 text-sm text-green-600 mt-1">
                              <Plus className="w-4 h-4" /> Paragraf Ekle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={addProject}
              className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors">
              <Plus className="w-4 h-4" /> Yeni Proje Ekle
            </button>
          </div>
        )}

        {/* ── FOOTER ── */}
        {tab === "footer" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
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

        {/* Save bar */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>}
          {status === "error"   && <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>}
          {status === "idle"    && <div />}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-60 font-medium text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
