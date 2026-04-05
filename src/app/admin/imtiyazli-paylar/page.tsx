"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Award, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ExternalLink,
} from "lucide-react";

interface Shareholder { name: string; amount: string; }
interface PageData {
  block1Title: string; block1Text: string;
  block2Text: string;
  block3Text: string;
  shareholders: Shareholder[];
  totalAmount: string;
  summaryTitle: string;
  summaryBullets: string[];
  infoTitle: string; infoText: string;
  ctaTitle: string; ctaText: string;
}
interface ContentPageData { sections?: string; }

const DEFAULTS: PageData = {
  block1Title: "A Grubu Paylar",
  block1Text: "A Grubu payların, Esas Sözleşme'nin 8. maddesindeki esaslar çerçevesinde yönetim kurulu üyelerinin yarısını seçiminde aday gösterme imtiyazı vardır. Yönetim Kurulu üye sayısının tek olması durumunda küsurat, aşağıya doğru en yakın tam sayıya yuvarlanır.",
  block2Text: "Olağan ve Olağanüstü Genel Kurul toplantılarında hazır bulunan pay sahiplerinin veya yetkilillerinin her bir A veya B grubu pay için bir oyu vardır.",
  block3Text: "Nama yazılı A Grubu imtiyazlı paylara ilişkin bilgiler aşağıda sunulmuştur.",
  shareholders: [
    { name: "Adnan ERDAN",   amount: "1.874.812,50" },
    { name: "Fikret ÇETİN",  amount: "1.874.812,50" },
    { name: "Muammer BİRAV", amount: "1.312.875,00" },
    { name: "Mutlu HASEKİ", amount: "562.500,00" },
  ],
  totalAmount: "5.625.000,00",
  summaryTitle: "İmtiyaz Özeti",
  summaryBullets: [
    "A Grubu paylar, yönetim kurulu üyelerinin yarısını aday gösterme imtiyazına sahiptir",
    "Her A ve B grubu pay için bir oy hakkı bulunmaktadır",
  ],
  infoTitle: "Yasal Bilgilendirme",
  infoText: "İmtiyazlı paylara ilişkin detaylı bilgiler şirketimizin Esas Sözleşmesi'nin 8. maddesinde düzenlenmiştir.",
  ctaTitle: "Daha Fazla Bilgi",
  ctaText: "İmtiyazlı paylar ve yönetim kurulu yapısı hakkında detaylı bilgi almak için Esas Sözleşme ve Yönetim Kurulu sayfalarımızı inceleyebilirsiniz.",
};

type Tab = "blocks" | "table" | "summary" | "info";

export default function ImtiyazliPaylarAdminPage() {
  const [tab, setTab]       = useState<Tab>("blocks");
  const [data, setData]     = useState<PageData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [status, setStatus]   = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch<ContentPageData>("/api/content-pages/imtiyazli-paylar");
      if (res?.sections) {
        const s = JSON.parse(res.sections);
        setData((p) => ({
          ...p,
          block1Title: s.block1?.title    ?? p.block1Title,
          block1Text:  s.block1?.text     ?? p.block1Text,
          block2Text:  s.block2?.text     ?? p.block2Text,
          block3Text:  s.block3?.text     ?? p.block3Text,
          shareholders: s.shareholders?.length ? s.shareholders : p.shareholders,
          totalAmount:  s.totalAmount     ?? p.totalAmount,
          summaryTitle: s.summaryTitle    ?? p.summaryTitle,
          summaryBullets: s.summaryBullets?.length ? s.summaryBullets : p.summaryBullets,
          infoTitle:   s.infoTitle        ?? p.infoTitle,
          infoText:    s.infoText         ?? p.infoText,
          ctaTitle:    s.ctaTitle         ?? p.ctaTitle,
          ctaText:     s.ctaText          ?? p.ctaText,
        }));
      }
    } catch { /* keep defaults */ }
    finally { setLoading(false); }
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      const payload = {
        slug: "imtiyazli-paylar",
        title: "İmtiyazlı Paylara İlişkin Bilgiler",
        sections: JSON.stringify({
          block1: { title: data.block1Title, text: data.block1Text },
          block2: { text: data.block2Text },
          block3: { text: data.block3Text },
          shareholders: data.shareholders,
          totalAmount: data.totalAmount,
          summaryTitle: data.summaryTitle,
          summaryBullets: data.summaryBullets,
          infoTitle: data.infoTitle,
          infoText: data.infoText,
          ctaTitle: data.ctaTitle,
          ctaText: data.ctaText,
        }),
      };
      try {
        await adminFetch("/api/content-pages/imtiyazli-paylar", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } catch {
        await adminFetch("/api/content-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      setStatus("success"); setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("error"); setTimeout(() => setStatus("idle"), 4000); }
    finally { setSaving(false); }
  }

  function setF<K extends keyof PageData>(k: K, v: PageData[K]) { setData((p) => ({ ...p, [k]: v })); }
  function setShareholder(idx: number, k: keyof Shareholder, v: string) {
    setData((p) => { const arr = [...p.shareholders]; arr[idx] = { ...arr[idx], [k]: v }; return { ...p, shareholders: arr }; });
  }
  function addShareholder() { setData((p) => ({ ...p, shareholders: [...p.shareholders, { name: "", amount: "" }] })); }
  function removeShareholder(idx: number) { setData((p) => ({ ...p, shareholders: p.shareholders.filter((_, i) => i !== idx) })); }
  function setBullet(idx: number, v: string) { setData((p) => { const arr = [...p.summaryBullets]; arr[idx] = v; return { ...p, summaryBullets: arr }; }); }
  function addBullet() { setData((p) => ({ ...p, summaryBullets: [...p.summaryBullets, ""] })); }
  function removeBullet(idx: number) { setData((p) => ({ ...p, summaryBullets: p.summaryBullets.filter((_, i) => i !== idx) })); }

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-gray-900 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`;
  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const ta  = `${inp} resize-none`;
  const lbl = "block text-xs font-medium text-gray-600 mb-1";

  if (loading) return <AdminShell><div className="flex h-64 items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-gray-400" /></div></AdminShell>;

  return (
    <AdminShell>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">İmtiyazlı Paylara İlişkin Bilgiler</h1>
              <p className="text-sm text-gray-500">Sayfa içeriklerini düzenleyin</p>
            </div>
          </div>
          <a href="/tr/kurumsal-yonetim/imtiyazli-paylar" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Sayfayı Gör
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("blocks")}  onClick={() => setTab("blocks")}>Bilgi Kutuları</button>
          <button className={tabClass("table")}   onClick={() => setTab("table")}>Ortaklar Tablosu</button>
          <button className={tabClass("summary")} onClick={() => setTab("summary")}>Özet & Bilgilendirme</button>
          <button className={tabClass("info")}    onClick={() => setTab("info")}>CTA</button>
        </div>

        {/* ── BLOCKS ── */}
        {tab === "blocks" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-6 rounded bg-indigo-500 shrink-0" />
                <p className="font-semibold text-gray-800">1. Kutu (İndigo)</p>
              </div>
              <div><label className={lbl}>Başlık</label><input className={inp} value={data.block1Title} onChange={(e) => setF("block1Title", e.target.value)} /></div>
              <div><label className={lbl}>Metin</label><textarea rows={4} className={ta} value={data.block1Text} onChange={(e) => setF("block1Text", e.target.value)} /></div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-6 rounded bg-blue-500 shrink-0" />
                <p className="font-semibold text-gray-800">2. Kutu (Mavi)</p>
              </div>
              <label className={lbl}>Metin</label>
              <textarea rows={3} className={ta} value={data.block2Text} onChange={(e) => setF("block2Text", e.target.value)} />
            </div>
            <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-6 rounded bg-purple-500 shrink-0" />
                <p className="font-semibold text-gray-800">3. Kutu (Mor)</p>
              </div>
              <label className={lbl}>Metin</label>
              <textarea rows={2} className={ta} value={data.block3Text} onChange={(e) => setF("block3Text", e.target.value)} />
            </div>
          </div>
        )}

        {/* ── TABLE ── */}
        {tab === "table" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <span className="text-white font-semibold">Ortaklar Tablosu</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-full">Ad Soyad / Unvan</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 whitespace-nowrap">Tutar (TL)</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.shareholders.map((s, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">
                          <input className="w-full bg-transparent text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
                            value={s.name} onChange={(e) => setShareholder(i, "name", e.target.value)} placeholder="Ad Soyad" />
                        </td>
                        <td className="px-4 py-2">
                          <input className="w-full bg-transparent text-sm text-right font-mono text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1"
                            value={s.amount} onChange={(e) => setShareholder(i, "amount", e.target.value)} placeholder="0,00" />
                        </td>
                        <td className="px-4 py-2">
                          <button onClick={() => removeShareholder(i)} className="p-1 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addShareholder} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
                <Plus className="w-4 h-4" /> Ortak Ekle
              </button>
              <div>
                <label className={lbl}>Toplam Tutar (TL)</label>
                <input className={`${inp} font-mono`} value={data.totalAmount} onChange={(e) => setF("totalAmount", e.target.value)} placeholder="5.625.000,00" />
              </div>
            </div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {tab === "summary" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <p className="font-semibold text-gray-800">Özet Kartı</p>
              <div><label className={lbl}>Başlık</label><input className={inp} value={data.summaryTitle} onChange={(e) => setF("summaryTitle", e.target.value)} /></div>
              <div>
                <label className={lbl}>Maddeler</label>
                <div className="space-y-2">
                  {data.summaryBullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-2.5 text-xs text-gray-400 shrink-0">{i + 1}.</span>
                      <textarea rows={2} className={`${ta} flex-1`} value={b} onChange={(e) => setBullet(i, e.target.value)} />
                      <button onClick={() => removeBullet(i)} className="mt-2.5 p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addBullet} className="mt-2 flex items-center gap-1.5 text-sm text-indigo-600">
                  <Plus className="w-4 h-4" /> Madde Ekle
                </button>
                <p className="mt-2 text-xs text-gray-400">Toplam tutar ve ortak sayısı otomatik eklenir.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <p className="font-semibold text-gray-800">Bilgilendirme Kutusu</p>
              <div><label className={lbl}>Başlık</label><input className={inp} value={data.infoTitle} onChange={(e) => setF("infoTitle", e.target.value)} /></div>
              <div><label className={lbl}>Metin</label><textarea rows={3} className={ta} value={data.infoText} onChange={(e) => setF("infoText", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        {tab === "info" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <span className="text-white font-semibold">CTA Alt Bant</span>
            </div>
            <div className="p-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className={lbl}>Başlık</label><input className={inp} value={data.ctaTitle} onChange={(e) => setF("ctaTitle", e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Açıklama</label><textarea rows={3} className={ta} value={data.ctaText} onChange={(e) => setF("ctaText", e.target.value)} /></div>
            </div>
          </div>
        )}

        {/* Save bar */}
        <div className="sticky bottom-0 mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-lg backdrop-blur">
          {status === "success" && <span className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Kaydedildi.</span>}
          {status === "error"   && <span className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4" /> Hata oluştu.</span>}
          {status === "idle"    && <div />}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 font-medium text-sm">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
