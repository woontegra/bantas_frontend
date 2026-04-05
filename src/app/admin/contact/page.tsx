"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  Phone,
  MapPin,
  Mail,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Building2,
  Trash2,
  Eye,
  Info,
  Map,
} from "lucide-react";
import type { ContactMessage } from "@/lib/api";

interface Facility {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  mapSrc: string;
}

const DEFAULT_FACILITIES: Facility[] = [
  {
    id: 1,
    name: "Kutu Oluşum Tesisleri",
    address: "Ömerli Mah. Ömerli 11 Sokak No: 2/1 Bandırma / Balıkesir",
    phone: "+90 (266) 733 87 87",
    email: "info@bantas.com.tr",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.8!2d27.9!3d40.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDE4JzAwLjAiTiAyN8KwNTQnMDAuMCJF!5e0!3m2!1str!2str!4v1234567890",
  },
  {
    id: 2,
    name: "Metal Ofset Tesisleri",
    address: "600 Evler Mah. Örnek San. Sit. Bandırma / Balıkesir",
    phone: "+90 (266) 721 40 00",
    email: "info@bantas.com.tr",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.8!2d27.9!3d40.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDE4JzAwLjAiTiAyN8KwNTQnMDAuMCJF!5e0!3m2!1str!2str!4v1234567891",
  },
];

type Tab = "facilities" | "messages";

export default function ContactAdminPage() {
  const [tab, setTab] = useState<Tab>("facilities");

  // ── Facilities state ──
  const [facilities, setFacilities] = useState<Facility[]>(DEFAULT_FACILITIES);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // ── Messages state ──
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (tab === "messages") loadMessages();
  }, [tab]);

  async function loadSettings() {
    setLoadingSettings(true);
    try {
      const data = await adminFetch<{ contactSettings?: string }>("/api/settings");
      if (data?.contactSettings) {
        const parsed = JSON.parse(data.contactSettings);
        if (Array.isArray(parsed?.facilities) && parsed.facilities.length > 0) {
          setFacilities(parsed.facilities);
        }
      }
    } catch {
      // keep defaults
    } finally {
      setLoadingSettings(false);
    }
  }

  async function loadMessages() {
    setLoadingMsgs(true);
    try {
      setMessages(await adminFetch<ContactMessage[]>("/api/contact"));
    } finally {
      setLoadingMsgs(false);
    }
  }

  function updateFacility(id: number, field: keyof Facility, value: string) {
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  }

  /**
   * Kullanıcı tam <iframe> kodu, embed URL veya normal Google Maps URL
   * yapıştırabilir. Bu fonksiyon her üçünden de doğru src'yi çıkarır.
   */
  function parseMapInput(raw: string): string {
    const trimmed = raw.trim();

    // Tam <iframe ...> kodu yapıştırıldıysa src'yi çıkar
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch) return srcMatch[1];

    // Zaten embed URL ise olduğu gibi döndür
    if (trimmed.includes("google.com/maps/embed")) return trimmed;

    // Normal Google Maps paylaşım linki → embed URL'ye dönüştür
    // Örn: https://www.google.com/maps/place/.../@lat,lng,zoom...
    const placeMatch = trimmed.match(/google\.com\/maps\/(?:place\/[^/]+\/)?@([\d.-]+),([\d.-]+),([\d.]+)z/);
    if (placeMatch) {
      const [, lat, lng, zoom] = placeMatch;
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${Math.round(156543 / Math.pow(2, Number(zoom)) * 256)}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1`;
    }

    // Kısa link veya tanımlanamayan format — olduğu gibi kaydet
    return trimmed;
  }

  function handleMapInput(id: number, raw: string) {
    // Alanı ham girişle güncelle (kullanıcı görsün)
    setFacilities((prev) =>
      prev.map((f) => (f.id === id ? { ...f, mapSrc: raw } : f))
    );
  }

  function resolvedMapSrc(raw: string): string {
    return parseMapInput(raw);
  }

  async function saveFacilities() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      // Kaydederken ham girişi embed URL'ye çevir
      const resolvedFacilities = facilities.map((f) => ({
        ...f,
        mapSrc: parseMapInput(f.mapSrc),
      }));
      const contactSettings = JSON.stringify({ facilities: resolvedFacilities });
      const formData = new FormData();
      formData.append("contactSettings", contactSettings);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("jwtToken") || ""
                : ""
            }`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      setSaving(false);
    }
  }

  async function markRead(id: string) {
    await adminFetch(`/api/contact/${id}/read`, { method: "PATCH" });
    loadMessages();
    if (selectedMsg?.id === id)
      setSelectedMsg((prev) => (prev ? { ...prev, isRead: true } : prev));
  }

  async function deleteMsg(id: string) {
    if (!confirm("Bu mesajı silmek istiyor musunuz?")) return;
    await adminFetch(`/api/contact/${id}`, { method: "DELETE" });
    setSelectedMsg(null);
    loadMessages();
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const tabClass = (t: Tab) =>
    `px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      tab === t
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <AdminShell>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Phone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İletişim Yönetimi</h1>
            <p className="text-sm text-gray-500">Tesis bilgileri ve gelen mesajlar</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit">
          <button className={tabClass("facilities")} onClick={() => setTab("facilities")}>
            <Building2 className="w-4 h-4 inline mr-1.5 mb-0.5" />
            Tesis Bilgileri
          </button>
          <button className={tabClass("messages")} onClick={() => setTab("messages")}>
            <MessageSquare className="w-4 h-4 inline mr-1.5 mb-0.5" />
            Gelen Mesajlar
            {unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* ─── TAB: Facilities ─── */}
        {tab === "facilities" && (
          <div className="space-y-6">
            {loadingSettings ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">Harita için şu üç yöntemden birini kullanabilirsiniz:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
                      <li>Google Maps → <strong>Paylaş → Haritayı göm</strong> → tam <code className="bg-blue-100 px-1 rounded">&lt;iframe&gt;</code> kodunu yapıştırın</li>
                      <li>Yalnızca <code className="bg-blue-100 px-1 rounded">src="..."</code> URL&apos;sini yapıştırın</li>
                      <li>Normal Google Maps paylaşım linkini yapıştırın (otomatik dönüştürülür)</li>
                    </ol>
                  </div>
                </div>

                {facilities.map((f, idx) => (
                  <div key={f.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-white" />
                      <h2 className="text-base font-semibold text-white">
                        Tesis {idx + 1}
                      </h2>
                    </div>
                    <div className="p-6 grid gap-4 sm:grid-cols-2">
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Tesis Adı
                        </label>
                        <input
                          type="text"
                          value={f.name}
                          onChange={(e) => updateFacility(f.id, "name", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Adres
                        </label>
                        <input
                          type="text"
                          value={f.address}
                          onChange={(e) => updateFacility(f.id, "address", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          <Phone className="w-3 h-3 inline mr-1" />
                          Telefon
                        </label>
                        <input
                          type="text"
                          value={f.phone}
                          onChange={(e) => updateFacility(f.id, "phone", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          <Mail className="w-3 h-3 inline mr-1" />
                          E-posta
                        </label>
                        <input
                          type="email"
                          value={f.email}
                          onChange={(e) => updateFacility(f.id, "email", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>

                      {/* Map Src */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Google Harita — iframe kodu veya URL
                        </label>
                        <textarea
                          rows={3}
                          value={f.mapSrc}
                          onChange={(e) => handleMapInput(f.id, e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...> veya sadece URL'
                        />
                        {/* Çözümlenmiş URL göstergesi */}
                        {f.mapSrc && resolvedMapSrc(f.mapSrc) !== f.mapSrc && (
                          <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Embed URL otomatik oluşturuldu — kaydettiğinizde uygulanır.
                          </p>
                        )}
                        {f.mapSrc && !resolvedMapSrc(f.mapSrc).includes("google.com/maps") && (
                          <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Bu URL Google Maps embed formatında görünmüyor.
                          </p>
                        )}
                      </div>

                      {/* Map preview */}
                      {f.mapSrc && resolvedMapSrc(f.mapSrc) && (
                        <div className="sm:col-span-2 rounded-xl overflow-hidden border border-gray-200 h-48">
                          <iframe
                            key={resolvedMapSrc(f.mapSrc)}
                            src={resolvedMapSrc(f.mapSrc)}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            title={`${f.name} önizleme`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Save bar */}
                <div className="flex items-center justify-between py-2">
                  {saveStatus === "success" && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Başarıyla kaydedildi.
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      Bir hata oluştu.
                    </div>
                  )}
                  {saveStatus === "idle" && <div />}

                  <button
                    onClick={saveFacilities}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 font-medium text-sm"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Kaydediliyor…" : "Kaydet"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── TAB: Messages ─── */}
        {tab === "messages" && (
          <div className="flex gap-6 min-h-[500px]">
            {/* List */}
            <div className="w-80 shrink-0 space-y-2">
              {loadingMsgs ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Henüz mesaj yok</p>
                </div>
              ) : (
                messages.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMsg(m);
                      if (!m.isRead) markRead(m.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedMsg?.id === m.id
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`text-sm font-semibold truncate ${
                          !m.isRead ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {m.name}
                      </span>
                      {!m.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {m.subject || "Konu yok"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(m.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </button>
                ))
              )}
            </div>

            {/* Detail */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {!selectedMsg ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                  <Eye className="w-10 h-10 opacity-30" />
                  <p className="text-sm">Mesaj seçin</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{selectedMsg.name}</p>
                      <p className="text-blue-200 text-xs mt-0.5">{selectedMsg.email}</p>
                    </div>
                    <button
                      onClick={() => deleteMsg(selectedMsg.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto">
                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-6 text-xs text-gray-500">
                      {selectedMsg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedMsg.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <a
                          href={`mailto:${selectedMsg.email}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {selectedMsg.email}
                        </a>
                      </span>
                      <span>
                        {new Date(selectedMsg.createdAt).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    {selectedMsg.subject && (
                      <div className="mb-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">Konu: </span>
                        <span className="text-sm text-gray-800">{selectedMsg.subject}</span>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-5 border border-gray-100">
                      {selectedMsg.message}
                    </div>

                    {/* Reply button */}
                    <a
                      href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject || ""}`}
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
                    >
                      <Mail className="w-4 h-4" />
                      E-posta ile Yanıtla
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
