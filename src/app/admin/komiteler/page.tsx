"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Users, Save, RefreshCw, CheckCircle, AlertCircle,
  Plus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface Member    { name: string; role: string; }
interface Committee { name: string; members: Member[]; }
interface StatCard  { label: string; value: string; sublabel: string; }
interface PageData {
  committees: Committee[];
  stats:      StatCard[];
  infoTitle:  string;
  infoText:   string;
  ctaTitle:   string;
  ctaText:    string;
}

const STATIC: PageData = {
  committees: [
    {
      name: "Denetimden Sorumlu Komite",
      members: [
        { name: "Dr. Ayça ÖZEKİN", role: "Denetim Komitesi Başkanı" },
        { name: "Burak OKBAY",      role: "Denetim Komitesi Üyesi" },
      ],
    },
    {
      name: "Kurumsal Yönetim Komitesi",
      members: [
        { name: "Burak OKBAY",      role: "Kurumsal Yönetim Komitesi Başkanı" },
        { name: "Dr. Ayça ÖZEKİN", role: "Kurumsal Yönetim Komitesi Üyesi" },
        { name: "Volkan EROL",      role: "Kurumsal Yönetim Komitesi Üyesi" },
      ],
    },
    {
      name: "Riskin Erken Saptanması Komitesi",
      members: [
        { name: "Dr. Ayça ÖZEKİN",  role: "Riskin Erken Saptanması Komitesi Başkanı" },
        { name: "Burak OKBAY",       role: "Riskin Erken Saptanması Komitesi Üyesi" },
        { name: "Perihan KÜÇÜKOĞLU", role: "Riskin Erken Saptanması Komitesi Üyesi" },
      ],
    },
  ],
  stats: [
    { label: "Toplam Komite",  value: "3", sublabel: "Aktif Komite" },
    { label: "Denetim",        value: "2", sublabel: "Denetim Komitesi Üyesi" },
    { label: "Risk Yönetimi",  value: "3", sublabel: "Risk Komitesi Üyesi" },
  ],
  infoTitle: "Komite Görevleri",
  infoText:
    "Yönetim Kurulu bünyesinde oluşturulan komiteler, Sermaye Piyasası Kurulu'nun Kurumsal Yönetim İlkeleri doğrultusunda görev yapmaktadır. Komiteler, ilgili alanlarda detaylı inceleme ve değerlendirme yaparak Yönetim Kurulu'na tavsiyelerde bulunmaktadır.",
  ctaTitle: "Kurumsal Yönetim",
  ctaText:
    "Komitelerimiz ve kurumsal yönetim yapımız hakkında daha fazla bilgi almak için diğer kurumsal yönetim sayfalarımızı inceleyebilirsiniz.",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function KomitelerAdminPage() {
  const [data,    setData]    = useState<PageData>({ committees: [], stats: [], infoTitle: "", infoText: "", ctaTitle: "", ctaText: "" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "success" | "error">("idle");

  // accordion open state for committees
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // ── Load ────────────────────────────────────────────────────────────────
  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/content-pages/komiteler");
      const page = res?.data || res;
      if (page?.sections) {
        const parsed: PageData = JSON.parse(page.sections);
        if (parsed?.committees?.length) { setData(parsed); setLoading(false); return; }
      }
    } catch { /* fall through */ }
    setData(STATIC);
    setLoading(false);
  }

  // ── Save ────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true); setStatus("idle");
    try {
      await adminFetch("/api/content-pages/komiteler", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "komiteler", sections: JSON.stringify(data) }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  // ── Committee helpers ───────────────────────────────────────────────────
  function addCommittee() {
    setData(d => ({ ...d, committees: [...d.committees, { name: "", members: [] }] }));
    setOpenIdx(data.committees.length);
  }

  function removeCommittee(i: number) {
    setData(d => ({ ...d, committees: d.committees.filter((_, idx) => idx !== i) }));
    setOpenIdx(null);
  }

  function updateCommittee(i: number, field: "name", val: string) {
    setData(d => {
      const committees = [...d.committees];
      committees[i] = { ...committees[i], [field]: val };
      return { ...d, committees };
    });
  }

  function addMember(ci: number) {
    setData(d => {
      const committees = [...d.committees];
      committees[ci] = { ...committees[ci], members: [...committees[ci].members, { name: "", role: "" }] };
      return { ...d, committees };
    });
  }

  function removeMember(ci: number, mi: number) {
    setData(d => {
      const committees = [...d.committees];
      committees[ci] = { ...committees[ci], members: committees[ci].members.filter((_, idx) => idx !== mi) };
      return { ...d, committees };
    });
  }

  function updateMember(ci: number, mi: number, field: keyof Member, val: string) {
    setData(d => {
      const committees = [...d.committees];
      const members = [...committees[ci].members];
      members[mi] = { ...members[mi], [field]: val };
      committees[ci] = { ...committees[ci], members };
      return { ...d, committees };
    });
  }

  // ── Stat helpers ────────────────────────────────────────────────────────
  function addStat() {
    setData(d => ({ ...d, stats: [...d.stats, { label: "", value: "", sublabel: "" }] }));
  }

  function removeStat(i: number) {
    setData(d => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));
  }

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
              <h1 className="text-xl font-bold text-gray-900">Komiteler</h1>
              <p className="text-sm text-gray-500">Yönetim kurulu komitelerini yönetin</p>
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

        {/* ── Committees ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Komiteler</h2>
            <button
              onClick={addCommittee}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-4 w-4" /> Komite Ekle
            </button>
          </div>

          <div className="space-y-3">
            {data.committees.map((c, ci) => (
              <div key={ci} className="overflow-hidden rounded-xl border border-gray-200">
                {/* Committee header */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3">
                  <button
                    onClick={() => setOpenIdx(openIdx === ci ? null : ci)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {openIdx === ci
                      ? <ChevronUp className="h-4 w-4 text-gray-500" />
                      : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    <span className="font-medium text-gray-800">{c.name || `Komite ${ci + 1}`}</span>
                    <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                      {c.members.length} üye
                    </span>
                  </button>
                  <button
                    onClick={() => removeCommittee(ci)}
                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {openIdx === ci && (
                  <div className="space-y-4 p-4">
                    {/* Committee name */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Komite Adı</label>
                      <input
                        value={c.name}
                        onChange={e => updateCommittee(ci, "name", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="Komite adını girin..."
                      />
                    </div>

                    {/* Members */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-600">Üyeler</label>
                        <button
                          onClick={() => addMember(ci)}
                          className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                        >
                          <Plus className="h-3 w-3" /> Üye Ekle
                        </button>
                      </div>
                      <div className="space-y-2">
                        {c.members.map((m, mi) => (
                          <div key={mi} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <div className="flex-1 space-y-2">
                              <input
                                value={m.name}
                                onChange={e => updateMember(ci, mi, "name", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                                placeholder="Ad Soyad..."
                              />
                              <input
                                value={m.role}
                                onChange={e => updateMember(ci, mi, "role", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                                placeholder="Görev / Unvan..."
                              />
                            </div>
                            <button
                              onClick={() => removeMember(ci, mi)}
                              className="mt-1 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {c.members.length === 0 && (
                          <p className="py-2 text-center text-sm text-gray-400">Henüz üye yok</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {data.committees.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                Henüz komite yok. "Komite Ekle" butonu ile ekleyin.
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
              <div key={i} className="flex items-start gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="grid flex-1 grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Başlık</label>
                    <input
                      value={s.label}
                      onChange={e => updateStat(i, "label", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Başlık..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Değer</label>
                    <input
                      value={s.value}
                      onChange={e => updateStat(i, "value", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Alt Başlık</label>
                    <input
                      value={s.sublabel}
                      onChange={e => updateStat(i, "sublabel", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
                      placeholder="Alt başlık..."
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeStat(i)}
                  className="mt-5 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info Box ─────────────────────────────────────────────────────── */}
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

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
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
