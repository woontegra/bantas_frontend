"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Users, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Shareholder { name: string; shares: string; currency: string; percentage: string; }
interface StatCard    { label: string; value: string; sublabel: string; }
interface PageData {
  shareholders: Shareholder[];
  stats:        StatCard[];
  infoTitle:    string;
  infoText:     string;
  ctaTitle:     string;
  ctaText:      string;
}

const STATIC: PageData = {
  shareholders: [
    { name: "Fikret ÇETİN",      shares: "31.749.628,75",  currency: "TRY", percentage: "13,13" },
    { name: "Adnan ERDAN",        shares: "31.078.916,87",  currency: "TRY", percentage: "12,85" },
    { name: "Muammer BİRAV",      shares: "17.585.110",     currency: "TRY", percentage: "7,27"  },
    { name: "Mutlu HASEN",        shares: "16.087.500",     currency: "TRY", percentage: "6,65"  },
    { name: "Melis ÇETİN",        shares: "2.000.000",      currency: "TRY", percentage: "0,83"  },
    { name: "Fatih ERDAN",        shares: "1.462.500",      currency: "TRY", percentage: "0,60"  },
    { name: "Mahmut ERDAN",       shares: "1.462.500",      currency: "TRY", percentage: "0,60"  },
    { name: "Emine Sevgi BİRAV",  shares: "162.500",        currency: "TRY", percentage: "0,07"  },
    { name: "Halka Açık Kısım",   shares: "140.286.344,38", currency: "TRY", percentage: "58,00" },
  ],
  stats: [
    { label: "Toplam Ortak",   value: "8",      sublabel: "+ Halka Açık Kısım"      },
    { label: "Halka Açıklık",  value: "58,00%", sublabel: "Borsada işlem gören pay" },
    { label: "En Büyük Ortak", value: "13,13%", sublabel: "Fikret ÇETİN"            },
  ],
  infoTitle: "Bilgilendirme",
  infoText:
    "Bu sayfada yer alan ortaklık yapısı bilgileri, şirketimizin güncel sermaye dağılımını göstermektedir. Ortaklık yapısındaki değişiklikler Kamuyu Aydınlatma Platformu (KAP) üzerinden düzenli olarak açıklanmaktadır.",
  ctaTitle: "Yatırımcı İlişkileri",
  ctaText:
    "Ortaklık yapısı ve sermaye değişiklikleri hakkında detaylı bilgi almak için yatırımcı ilişkileri departmanımız ile iletişime geçebilirsiniz.",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function emptyRow(): Shareholder {
  return { name: "", shares: "", currency: "TRY", percentage: "" };
}
function emptyStat(): StatCard {
  return { label: "", value: "", sublabel: "" };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function OrtaklikAdminPage() {
  const [data,    setData]    = useState<PageData>(STATIC);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/ortaklik-yapisi");
      const page = res?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.shareholders?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/ortaklik-yapisi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "ortaklik-yapisi", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Shareholder helpers ────────────────────────────────────────────────
  function addRow()           { setData(d => ({ ...d, shareholders: [...d.shareholders, emptyRow()] })); }
  function removeRow(i: number) { setData(d => ({ ...d, shareholders: d.shareholders.filter((_, idx) => idx !== i) })); }
  function updateRow(i: number, field: keyof Shareholder, val: string) {
    setData(d => {
      const shareholders = [...d.shareholders];
      shareholders[i] = { ...shareholders[i], [field]: val };
      return { ...d, shareholders };
    });
  }

  // ── Stat helpers ───────────────────────────────────────────────────────
  function addStat()            { setData(d => ({ ...d, stats: [...d.stats, emptyStat()] })); }
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
              <h1 className="text-xl font-bold text-gray-900">Ortaklık Yapısı</h1>
              <p className="text-sm text-gray-500">Sermaye yapısı ve ortaklar tablosunu yönetin</p>
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

        {/* ── Shareholders Table ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Ortaklar Tablosu</h2>
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Ortak Ekle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600">
                  <th className="px-3 py-3 w-1/3">Ad / Ünvan</th>
                  <th className="px-3 py-3 w-1/4">Pay Tutarı (TL)</th>
                  <th className="px-3 py-3 w-24">Para Birimi</th>
                  <th className="px-3 py-3 w-28">Pay Oranı (%)</th>
                  <th className="px-3 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.shareholders.map((s, i) => (
                  <tr key={i} className="group">
                    <td className="px-3 py-2">
                      <input
                        value={s.name}
                        onChange={e => updateRow(i, "name", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="Ad Soyad / Ünvan..."
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={s.shares}
                        onChange={e => updateRow(i, "shares", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                        placeholder="31.749.628,75"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={s.currency}
                        onChange={e => updateRow(i, "currency", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="TRY"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={s.percentage}
                        onChange={e => updateRow(i, "percentage", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="13,13"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeRow(i)}
                        className="rounded-lg p-1.5 text-red-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.shareholders.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Henüz ortak yok. "Ortak Ekle" ile ekleyin.
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            İpucu: "Halka Açık Kısım" adını kullanan satır tabloda farklı renkte gösterilir.
          </p>
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
                    <input value={s.label}    onChange={e => updateStat(i, "label",    e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="Toplam Ortak" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Değer</label>
                    <input value={s.value}    onChange={e => updateStat(i, "value",    e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none" placeholder="58,00%" />
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
              <input
                value={data.infoTitle}
                onChange={e => setData(d => ({ ...d, infoTitle: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">İçerik</label>
              <textarea
                rows={4}
                value={data.infoText}
                onChange={e => setData(d => ({ ...d, infoText: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">CTA Bölümü</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
              <input
                value={data.ctaTitle}
                onChange={e => setData(d => ({ ...d, ctaTitle: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
              <textarea
                rows={3}
                value={data.ctaText}
                onChange={e => setData(d => ({ ...d, ctaText: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
