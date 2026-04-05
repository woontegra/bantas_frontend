"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Users, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface BoardMember { name: string; title: string; details: string; }
interface StatCard    { label: string; value: string; sublabel: string; }
interface PageData {
  boardMembers: BoardMember[];
  stats:        StatCard[];
  infoTitle:    string;
  infoText:     string;
  ctaTitle:     string;
  ctaText:      string;
}

const STATIC: PageData = {
  boardMembers: [
    { name: "Adnan ERDAN",   title: "Yönetim Kurulu Başkanı",          details: `07.03.1952 tarihinde İstanbul'da doğmuştur. Marmara Üniversitesi İktisadi ve İdari Bilimler Fakültesi Kamu Yönetimi Bölümü Mezunu olan Sn.Adnan ERDAN, 11 yaşında başladığı çalışma hayatı içinde Muhasebe mesleği ile iştigal olduktan sonra, 1975 yılında Sn.Fikret ÇETİN ile Tapaş Koll.Şti'ni kurarak 1985 yılına kadar İnşaat taahhüt işleri ile çalışma hayatına devam etmişlerdir. 1986 yılından itibaren Bantaş Bandırma Ambalaj San.ve Tic.A.Ş.'ye ortak olarak Yönetim Kurulu Başkanlığı görevini sürdürmeye devam etmektedir.` },
    { name: "Muammer BİRAV", title: "Yönetim Kurulu Bşk. Vekili",      details: `3.05.1966 tarihinde Manyas'da doğmuştur. İstanbul Üniversitesi İktisat Fakültesi İktisat bölümünden mezun olduktan sonra, Yüksek Lisansını Marmara Üniversitesi Güzel Sanatlar Fakültesi Endüstri Ürünleri Tasarımı bölümünde yapan Sn. Muammer BİRAV, 1992 yılından bu yana Bantaş Bandırma Ambalaj San.ve Tic. A.Ş.'de Yönetim Kurulu Üyeliğine devam etmektedir.` },
    { name: "Melis ÇETİN",   title: "Yönetim Kurulu Üyesi",            details: `24.04.1981 yılında İstanbul'da doğmuştur. Bilgi üniversitesi iletişim fakültesi halkla ilişkiler bölümünden mezun olduktan sonra işletme yüksek lisans eğitimini UC San Diego'da tamamlamıştır. İleri seviyede İngilizce ve Almanca bilen Çetin, Koç Holding, Borusan Holding ve Apple Türkiye'de uzun süre Pazarlama Yöneticiliği yaptıktan sonra 2024 yılı itibari ile Bantaş Yönetim Kurulu'nda yerini almıştır.` },
    { name: "Ayça ÖZEKİN",   title: "Yönetim Kurulu Bağımsız Üyesi",   details: `Dr. Öğr. Üyesi Ayça ÖZEKİN 1985 yılında Bandırma'da dünyaya gelmiştir. 2008 yılında Gazi Üniversitesi İktisadi ve İdari Bilimler Fakültesi Ekonometri Bölümü'nden mezun olmuştur. Doktora eğitimini, 2017 yılında Marmara Üniversitesi Sosyal Bilimler Enstitüsü Yöneylem Araştırması Anabilim Dalı'nda tamamlamıştır. 2018 yılından itibaren aynı kurumda Doktor Öğretim Üyesi olarak çalışmaktadır. Evli ve bir çocuk sahibidir.` },
    { name: "Burak OKBAY",   title: "Yönetim Kurulu Bağımsız Üyesi",   details: `03.03.1985 Bandırma'da doğdu. 2005-2007 yılları arasında Bandırma Meslek Yüksek Okulu Gıda Teknolojisi bölümünü bitirdikten sonra dikey geçiş ile Çanakkale 18 Mart Üniversitesi Ziraat Fakültesi Bitki koruma bölümünü bitirdi. Aynı dönem Anadolu Üniversitesi Çalışma Ekonomisi bölümünden de mezun oldu. Evliyim bir çocuğum var.` },
  ],
  stats: [
    { label: "Toplam Üye",   value: "5",            sublabel: "Yönetim Kurulu Üyesi"       },
    { label: "Bağımsız Üye", value: "2",            sublabel: "Kurumsal yönetim ilkeleri"  },
    { label: "Başkan",       value: "Adnan ERDAN",  sublabel: "Yönetim Kurulu Başkanı"     },
  ],
  infoTitle: "Kurumsal Yönetim İlkeleri",
  infoText:  "Yönetim Kurulumuz, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda şirketimizin stratejik hedeflerini belirlemekte ve faaliyetlerini yönlendirmektedir. Bağımsız üyelerimiz, kurumsal yönetim standartlarının uygulanmasını gözetmektedir.",
  ctaTitle:  "Kurumsal Yönetim",
  ctaText:   "Yönetim kurulumuz ve komitelerimiz hakkında daha fazla bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function YonetimKuruluAdminPage() {
  const [data,    setData]    = useState<PageData>({ boardMembers: [], stats: [], infoTitle: "", infoText: "", ctaTitle: "", ctaText: "" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/yonetim-kurulu");
      const page = res?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.boardMembers?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/yonetim-kurulu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "yonetim-kurulu", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Member helpers ─────────────────────────────────────────────────────
  function addMember() {
    setData(d => ({ ...d, boardMembers: [...d.boardMembers, { name: "", title: "", details: "" }] }));
    setOpenIdx(data.boardMembers.length);
  }
  function removeMember(i: number) {
    setData(d => ({ ...d, boardMembers: d.boardMembers.filter((_, idx) => idx !== i) }));
    setOpenIdx(null);
  }
  function updateMember(i: number, field: keyof Pick<BoardMember, "name" | "title" | "details">, val: string) {
    setData(d => {
      const bm = [...d.boardMembers];
      bm[i] = { ...bm[i], [field]: val };
      return { ...d, boardMembers: bm };
    });
  }

  // ── Stat helpers ───────────────────────────────────────────────────────
  function addStat()            { setData(d => ({ ...d, stats: [...d.stats, { label: "", value: "", sublabel: "" }] })); }
  function removeStat(i: number){ setData(d => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) })); }
  function updateStat(i: number, field: keyof StatCard, val: string) {
    setData(d => {
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [field]: val };
      return { ...d, stats };
    });
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Yönetim Kurulu</h1>
              <p className="text-sm text-gray-500">Yönetim kurulu üyelerini yönetin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {status === "success" && (
              <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="h-4 w-4" /> Kaydedildi</span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> Hata</span>
            )}
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Kaydet
            </button>
          </div>
        </div>

        {/* ── Board Members ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Yönetim Kurulu Üyeleri</h2>
            <button
              onClick={addMember}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Üye Ekle
            </button>
          </div>

          <div className="space-y-3">
            {data.boardMembers.map((m, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
                {/* Row header */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3">
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {openIdx === i
                      ? <ChevronUp className="h-4 w-4 text-gray-400" />
                      : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{m.name || `Üye ${i + 1}`}</span>
                      {m.title && <span className="ml-2 text-xs text-indigo-600">{m.title}</span>}
                    </div>
                  </button>
                  <button
                    onClick={() => removeMember(i)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {openIdx === i && (
                  <div className="space-y-3 p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Ad Soyad</label>
                        <input
                          value={m.name}
                          onChange={e => updateMember(i, "name", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Ad Soyad..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">Unvan / Görev</label>
                        <input
                          value={m.title}
                          onChange={e => updateMember(i, "title", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Yönetim Kurulu Başkanı..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Biyografi / Detay</label>
                      <textarea
                        rows={5}
                        value={m.details}
                        onChange={e => updateMember(i, "details", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="Üye biyografisi ve detaylı bilgiler..."
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {data.boardMembers.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Henüz üye yok. "Üye Ekle" ile ekleyin.
              </p>
            )}
          </div>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">İstatistik Kartları</h2>
            <button
              onClick={addStat}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Kart Ekle
            </button>
          </div>
          <div className="space-y-3">
            {data.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="grid flex-1 grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Başlık</label>
                    <input value={s.label}    onChange={e => updateStat(i, "label",    e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Toplam Üye" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Değer</label>
                    <input value={s.value}    onChange={e => updateStat(i, "value",    e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="5" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Alt Başlık</label>
                    <input value={s.sublabel} onChange={e => updateStat(i, "sublabel", e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Alt başlık..." />
                  </div>
                </div>
                <button onClick={() => removeStat(i)} className="mt-4 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info Box ──────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Bilgi Kutusu</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
              <input value={data.infoTitle} onChange={e => setData(d => ({ ...d, infoTitle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">İçerik</label>
              <textarea rows={4} value={data.infoText} onChange={e => setData(d => ({ ...d, infoText: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">CTA Bölümü</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
              <input value={data.ctaTitle} onChange={e => setData(d => ({ ...d, ctaTitle: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
              <textarea rows={3} value={data.ctaText} onChange={e => setData(d => ({ ...d, ctaText: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
