"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Building2, Save, RefreshCw, CheckCircle, AlertCircle, Plus, Trash2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface RegistryRow { label: string; value: string; }
interface PageData {
  registryData: RegistryRow[];
  infoTitle:    string;
  infoText:     string;
  infoLinkText: string;
  infoLinkUrl:  string;
  ctaTitle:     string;
  ctaText:      string;
}

const STATIC: PageData = {
  registryData: [
    { label: "Şirket Türü",                    value: "A.Ş" },
    { label: "Mersis",                          value: "0140034379000018" },
    { label: "Ticaret Sicil Memurluğu",         value: "BALIKESİR" },
    { label: "Ticaret Sicil Numarası",          value: "7140" },
    { label: "Ticaret Unvanı",                  value: "BANTAS BALIKESİR AMBALAJ SANAYİ VE TİCARET A.Ş" },
    { label: "Adres",                           value: "Ömeri Mah. 32520 Sokak No:1 BALIKESİR / BALIKESİR" },
    { label: "Taahhüt Edilen Sermaye Miktarı",  value: "" },
    { label: "Ödenen Sermaye Miktarı",          value: "120.937.500,00" },
    { label: "Kayıtlı Sermaye Tavanı",          value: "250.000.000,00" },
    { label: "Şirket Tescil Tarihi",            value: "07-04-1988" },
    { label: "Vergi Dairesi",                   value: "BALIKESİR - Bandırma Vergi Dairesi Müdürlüğü" },
    { label: "Vergi Numarası",                  value: "1400243710" },
    {
      label: "Sektör",
      value: "Demir veya çelikten yapılmış, kapaklar ve diğer ürünler için kapasite > 50 litre olan kutuların imalatı (demir veya çelikten olmayan diğer)",
    },
    {
      label: "İletişim Bilgileri",
      value: "Telefon: 02667318787\nFax: -\nİnternet Adresi: www.bantas.com.tr",
    },
  ],
  infoTitle:    "Bilgilendirme",
  infoText:     "Bu sayfada yer alan bilgiler, şirketimizin Ticaret Sicil Gazetesi'nde yayımlanan resmi kayıt bilgilerini içermektedir. Bilgilerin güncelliği için",
  infoLinkText: "Ticaret Sicil Gazetesi",
  infoLinkUrl:  "https://www.ticaretsicil.gov.tr",
  ctaTitle:     "Daha Fazla Bilgi",
  ctaText:      "Şirketimizin kurumsal yapısı ve yönetim bilgileri hakkında detaylı bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function TicaretSicilAdminPage() {
  const [data,    setData]    = useState<PageData>(STATIC);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res  = await adminFetch("/api/content-pages/ticaret-sicil-bilgileri");
      const page = res?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.registryData?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/ticaret-sicil-bilgileri", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "ticaret-sicil-bilgileri", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Row helpers ────────────────────────────────────────────────────────
  function addRow() {
    setData(d => ({ ...d, registryData: [...d.registryData, { label: "", value: "" }] }));
  }
  function removeRow(i: number) {
    setData(d => ({ ...d, registryData: d.registryData.filter((_, idx) => idx !== i) }));
  }
  function updateRow(i: number, field: "label" | "value", val: string) {
    setData(d => {
      const rows = [...d.registryData];
      rows[i] = { ...rows[i], [field]: val };
      return { ...d, registryData: rows };
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
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ticaret Sicil Bilgileri</h1>
              <p className="text-sm text-gray-500">Şirket kayıt bilgilerini düzenleyin</p>
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

        {/* ── Registry Rows ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Kayıt Bilgileri Tablosu</h2>
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Satır Ekle
            </button>
          </div>

          <div className="space-y-3">
            {data.registryData.map((row, i) => (
              <div key={i} className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-gray-500">Başlık (Alan Adı)</label>
                    <input
                      value={row.label}
                      onChange={e => updateRow(i, "label", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Alan adı..."
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="mb-1 block text-xs text-gray-500">Değer</label>
                    <textarea
                      rows={row.value.includes("\n") ? 3 : 1}
                      value={row.value}
                      onChange={e => updateRow(i, "value", e.target.value)}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Değer (birden fazla satır için Enter kullanın)..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeRow(i)}
                  className="mt-6 rounded-lg p-1.5 text-red-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-400">
            İpucu: Değer alanında birden fazla satır için Enter tuşunu kullanın (örn. İletişim Bilgileri).
          </p>
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
              <label className="mb-1 block text-xs font-medium text-gray-600">Metin (link öncesi kısım)</label>
              <textarea
                rows={3}
                value={data.infoText}
                onChange={e => setData(d => ({ ...d, infoText: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Link Metni</label>
                <input
                  value={data.infoLinkText}
                  onChange={e => setData(d => ({ ...d, infoLinkText: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Ticaret Sicil Gazetesi"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Link URL</label>
                <input
                  value={data.infoLinkUrl}
                  onChange={e => setData(d => ({ ...d, infoLinkUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
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
