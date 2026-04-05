"use client";

import {
  MapPin,
  Phone,
  Mail,
  Send,
  Building2,
  Factory,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Facility {
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

const FACILITY_STYLES = [
  { gradient: "from-blue-700 to-brand", ring: "ring-blue-500", Icon: Factory },
  { gradient: "from-indigo-700 to-purple-700", ring: "ring-indigo-500", Icon: Building2 },
];

export function ContactClient() {
  const [facilities, setFacilities] = useState<Facility[]>(DEFAULT_FACILITIES);
  const [activeFacilityId, setActiveFacilityId] = useState<number>(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.contactSettings) {
          try {
            const parsed = JSON.parse(data.contactSettings);
            if (Array.isArray(parsed?.facilities) && parsed.facilities.length > 0) {
              setFacilities(parsed.facilities);
            }
          } catch {
            // use defaults
          }
        }
      })
      .catch(() => {});
  }, []);

  const facility = facilities.find((f) => f.id === activeFacilityId) ?? facilities[0];
  const styleIdx = facilities.findIndex((f) => f.id === activeFacilityId);
  const style = FACILITY_STYLES[styleIdx] ?? FACILITY_STYLES[0];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Gönderim hatası");
      }
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-20 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center gap-3">
            <MapPin className="h-8 w-8 text-blue-300" />
            <span className="text-sm font-light uppercase tracking-widest text-blue-300">
              Bize Ulaşın
            </span>
          </div>
          <h1 className="mb-3 text-5xl font-light md:text-6xl">İletişim</h1>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-blue-100">
            Sorularınız, önerileriniz ve talepleriniz için aşağıdaki formu
            doldurun ya da doğrudan bizi arayın.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {/* ── Facility Selector ── */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2">
          {facilities.map((f, idx) => {
            const isActive = activeFacilityId === f.id;
            const s = FACILITY_STYLES[idx] ?? FACILITY_STYLES[0];
            const Icon = s.Icon;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFacilityId(f.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 bg-white text-left shadow-md transition-all duration-300 ${
                  isActive
                    ? `border-transparent ring-2 ${s.ring} shadow-xl`
                    : "border-gray-100 hover:shadow-lg"
                }`}
              >
                <div
                  className={`bg-gradient-to-r ${s.gradient} flex items-center gap-3 px-6 py-5 text-white`}
                >
                  <Icon className="h-7 w-7 shrink-0" />
                  <span className="text-lg font-semibold">{f.name}</span>
                  {isActive && (
                    <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                      Seçili
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-6">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    <span>{f.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
                    <a
                      href={`tel:${f.phone.replace(/\s/g, "")}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {f.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                    <a
                      href={`mailto:${f.email}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {f.email}
                    </a>
                  </div>
                </div>
                {!isActive && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Two-column layout: Map | Form ── */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left — Map */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div
              className={`flex items-center gap-2 bg-gradient-to-r ${style.gradient} px-6 py-4`}
            >
              <MapPin className="h-5 w-5 text-white/80" />
              <h2 className="text-base font-semibold text-white">
                {facility?.name} — Konum
              </h2>
            </div>
            <div className="h-[420px] lg:h-[500px]">
              <iframe
                key={facility?.id}
                src={facility?.mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${facility?.name} haritası`}
              />
            </div>
          </div>

          {/* Right — Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h2 className="mb-1 text-2xl font-bold text-gray-900">Mesaj Gönderin</h2>
            <p className="mb-7 text-sm text-gray-500">
              Formu doldurun, en kısa sürede size dönüş yapalım.
            </p>

            {status === "ok" && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-semibold">Mesajınız alındı!</p>
                  <p className="mt-0.5 text-sm text-emerald-700">
                    En kısa sürede size dönüş yapacağız.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {errorMsg || "Bir hata oluştu. Lütfen tekrar deneyin."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ad Soyad"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+90 5xx xxx xx xx"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Konu
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Mesajınızın konusu"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı buraya yazın…"
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Gönderiliyor…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
