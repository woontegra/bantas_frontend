"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch, adminUpload } from "@/lib/adminApi";
import {
  Settings, Save, RefreshCw, CheckCircle, AlertCircle,
  Upload, Globe, BarChart3, Facebook, Mail, Lock, UserPlus,
  Trash2, Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────
interface SiteSettings {
  id?: string;
  siteName: string;
  logo?: string;
  favicon?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsole?: string;
  facebookPixelId?: string;
  facebookAccessToken?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

type Tab = "genel" | "analytics" | "eposta" | "guvenlik";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function mediaUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

// ── Helper: status badge ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: "idle" | "success" | "error" }) {
  if (status === "idle") return null;
  return status === "success" ? (
    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
      <CheckCircle className="w-4 h-4" /> Kaydedildi
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-sm text-red-600">
      <AlertCircle className="w-4 h-4" /> Hata oluştu
    </span>
  );
}

// ── Field helpers ──────────────────────────────────────────────────────────
function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {note && <p className="mb-1.5 text-xs text-gray-400">{note}</p>}
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${props.className ?? ""}`}
    />
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("genel");

  // ── Genel / Analytics / Eposta ─────────────────────────────────────────
  const [settings, setSettings] = useState<SiteSettings>({ siteName: "BANTAS" });
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [status,  setStatus]    = useState<"idle" | "success" | "error">("idle");
  const [logoFile,    setLogoFile]    = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview,    setLogoPreview]    = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const logoRef    = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  // ── Şifre değiştirme ───────────────────────────────────────────────────
  const [pwEmail,   setPwEmail]   = useState("");
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew,     setPwNew]     = useState("");
  const [pwNew2,    setPwNew2]    = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [pwStatus,  setPwStatus]  = useState<"idle" | "success" | "error">("idle");
  const [pwMsg,     setPwMsg]     = useState("");

  // ── Kullanıcı yönetimi ─────────────────────────────────────────────────
  const [users,     setUsers]     = useState<AdminUser[]>([]);
  const [newEmail,  setNewEmail]  = useState("");
  const [newName,   setNewName]   = useState("");
  const [newPass,   setNewPass]   = useState("");
  const [newRole,   setNewRole]   = useState("admin");
  const [userSaving, setUserSaving] = useState(false);
  const [userStatus, setUserStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => { loadSettings(); loadUsers(); }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/settings");
      if (res) setSettings(res as SiteSettings);
    } catch {}
    setLoading(false);
  }

  async function loadUsers() {
    try {
      const res = await adminFetch("/api/auth/users");
      setUsers((res as AdminUser[]) || []);
    } catch {}
  }

  function pickLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  }

  function pickFavicon(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFaviconFile(f);
    setFaviconPreview(URL.createObjectURL(f));
  }

  async function saveSettings() {
    setSaving(true); setStatus("idle");
    try {
      const fd = new FormData();
      Object.entries(settings).forEach(([k, v]) => {
        if (v != null && k !== "id") fd.append(k, String(v));
      });
      if (logoFile)    fd.append("logo",    logoFile);
      if (faviconFile) fd.append("favicon", faviconFile);
      await adminUpload("/api/settings", fd, "PUT");
      setStatus("success");
      setLogoFile(null); setFaviconFile(null);
      loadSettings();
    } catch { setStatus("error"); }
    finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  function setSetting(key: keyof SiteSettings) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSettings(s => ({ ...s, [key]: e.target.value }));
  }

  async function changePassword() {
    if (!pwEmail || !pwCurrent || !pwNew) { setPwMsg("Tüm alanları doldurun."); setPwStatus("error"); return; }
    if (pwNew !== pwNew2)                 { setPwMsg("Yeni şifreler eşleşmiyor."); setPwStatus("error"); return; }
    setPwStatus("idle"); setPwMsg("");
    try {
      const res = await adminFetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pwEmail, currentPassword: pwCurrent, newPassword: pwNew }),
      });
      if ((res as any)?.error) { setPwStatus("error"); setPwMsg((res as any).error); return; }
      setPwStatus("success"); setPwMsg("Şifre başarıyla güncellendi.");
      setPwCurrent(""); setPwNew(""); setPwNew2("");
    } catch { setPwStatus("error"); setPwMsg("Bağlantı hatası."); }
    setTimeout(() => setPwStatus("idle"), 4000);
  }

  async function createUser() {
    if (!newEmail || !newName || !newPass) return;
    setUserSaving(true); setUserStatus("idle");
    try {
      await adminFetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, password: newPass, role: newRole }),
      });
      setUserStatus("success");
      setNewEmail(""); setNewName(""); setNewPass(""); setNewRole("admin");
      loadUsers();
    } catch { setUserStatus("error"); }
    finally { setUserSaving(false); setTimeout(() => setUserStatus("idle"), 3000); }
  }

  async function toggleUser(u: AdminUser) {
    await adminFetch(`/api/auth/users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: u.name, role: u.role, active: !u.active }),
    });
    loadUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    await adminFetch(`/api/auth/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "genel",    label: "Genel",        icon: <Globe     className="w-4 h-4" /> },
    { id: "analytics",label: "Analytics",    icon: <BarChart3 className="w-4 h-4" /> },
    { id: "eposta",   label: "İletişim",     icon: <Mail      className="w-4 h-4" /> },
    { id: "guvenlik", label: "Güvenlik",     icon: <Lock      className="w-4 h-4" /> },
  ];

  return (
    <AdminShell>
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
            <p className="text-sm text-gray-500">Logo, Analytics, E-posta ve güvenlik ayarları</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                tab === t.id
                  ? "border-b-2 border-indigo-600 text-indigo-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading && tab !== "guvenlik" ? (
          <div className="flex items-center gap-2 text-gray-400 py-12"><RefreshCw className="w-4 h-4 animate-spin" /> Yükleniyor…</div>
        ) : (
          <>
            {/* ── GENEL ─────────────────────────────────────────────────────── */}
            {tab === "genel" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-gray-900">Site Adı</h2>
                  <Field label="Site Adı">
                    <Input value={settings.siteName} onChange={setSetting("siteName")} placeholder="BANTAS" />
                  </Field>
                </div>

                {/* Logo */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-gray-900">Logo</h2>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-32 h-20 rounded-xl border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {(logoPreview || mediaUrl(settings.logo)) ? (
                        <Image
                          src={logoPreview || mediaUrl(settings.logo)}
                          alt="Logo"
                          width={128} height={80}
                          className="object-contain w-full h-full p-2"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Logo yok</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input ref={logoRef} type="file" accept="image/*,.svg" className="hidden" onChange={pickLogo} />
                      <button
                        onClick={() => logoRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" /> Logo Seç
                      </button>
                      <p className="text-xs text-gray-400">SVG, PNG veya JPG. Şeffaf arka plan önerilir.</p>
                      {logoFile && <p className="text-xs text-indigo-600">{logoFile.name} seçildi</p>}
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <h2 className="font-semibold text-gray-900">Favicon</h2>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {(faviconPreview || mediaUrl(settings.favicon)) ? (
                        <Image
                          src={faviconPreview || mediaUrl(settings.favicon)}
                          alt="Favicon"
                          width={64} height={64}
                          className="object-contain w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Yok</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input ref={faviconRef} type="file" accept="image/*,.ico" className="hidden" onChange={pickFavicon} />
                      <button
                        onClick={() => faviconRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" /> Favicon Seç
                      </button>
                      <p className="text-xs text-gray-400">.ico, .png — ideal boyut 32×32 veya 64×64 px</p>
                      {faviconFile && <p className="text-xs text-indigo-600">{faviconFile.name} seçildi</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* ── ANALYTICS ─────────────────────────────────────────────────── */}
            {tab === "analytics" && (
              <div className="space-y-6">
                {/* Google */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-gray-900">Google</h2>
                  </div>
                  <Field label="Google Analytics 4 Measurement ID" note="Ör: G-XXXXXXXXXX">
                    <Input
                      value={settings.googleAnalyticsId ?? ""}
                      onChange={setSetting("googleAnalyticsId")}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </Field>
                  <Field label="Google Tag Manager ID" note="Ör: GTM-XXXXXXX">
                    <Input
                      value={settings.googleTagManagerId ?? ""}
                      onChange={setSetting("googleTagManagerId")}
                      placeholder="GTM-XXXXXXX"
                    />
                  </Field>
                  <Field
                    label="Google Search Console Doğrulama Kodu"
                    note="HTML meta tag içindeki content değeri (google-site-verification=…)"
                  >
                    <Input
                      value={settings.googleSearchConsole ?? ""}
                      onChange={setSetting("googleSearchConsole")}
                      placeholder="google-site-verification=xxxxxxxxxxxxxxx"
                    />
                  </Field>
                </div>

                {/* Facebook */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <h2 className="font-semibold text-gray-900">Facebook / Meta</h2>
                  </div>
                  <Field label="Facebook Pixel ID" note="Ör: 1234567890123">
                    <Input
                      value={settings.facebookPixelId ?? ""}
                      onChange={setSetting("facebookPixelId")}
                      placeholder="1234567890123"
                    />
                  </Field>
                  <Field
                    label="Facebook Conversions API Token"
                    note="Meta Events Manager → Veri Kaynakları → API Ayarları → Erişim Jetonu"
                  >
                    <Input
                      value={settings.facebookAccessToken ?? ""}
                      onChange={setSetting("facebookAccessToken")}
                      placeholder="EAAN…"
                      type="password"
                    />
                  </Field>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* ── İLETİŞİM (EPOSTA) ─────────────────────────────────────────── */}
            {tab === "eposta" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-semibold text-gray-900">İletişim Bilgileri</h2>
                  </div>
                  <Field label="E-posta Adresi">
                    <Input
                      value={settings.email ?? ""}
                      onChange={setSetting("email")}
                      type="email"
                      placeholder="info@bantas.com.tr"
                    />
                  </Field>
                  <Field label="Telefon">
                    <Input
                      value={settings.phone ?? ""}
                      onChange={setSetting("phone")}
                      placeholder="+90 (266) 733 20 20"
                    />
                  </Field>
                  <Field label="Adres">
                    <textarea
                      value={settings.address ?? ""}
                      onChange={setSetting("address")}
                      rows={3}
                      placeholder="Şirket adresi…"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </Field>
                </div>

                <div className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="ml-auto flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* ── GÜVENLİK ──────────────────────────────────────────────────── */}
            {tab === "guvenlik" && (
              <div className="space-y-6">
                {/* Şifre Değiştir */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-semibold text-gray-900">Şifre Değiştir</h2>
                  </div>
                  <Field label="Kullanıcı E-postası">
                    <Input value={pwEmail} onChange={e => setPwEmail(e.target.value)} type="email" placeholder="admin@bantas.com" />
                  </Field>
                  <Field label="Mevcut Şifre">
                    <div className="relative">
                      <Input
                        value={pwCurrent}
                        onChange={e => setPwCurrent(e.target.value)}
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Yeni Şifre">
                      <Input value={pwNew} onChange={e => setPwNew(e.target.value)} type={showPw ? "text" : "password"} placeholder="••••••••" />
                    </Field>
                    <Field label="Yeni Şifre (Tekrar)">
                      <Input value={pwNew2} onChange={e => setPwNew2(e.target.value)} type={showPw ? "text" : "password"} placeholder="••••••••" />
                    </Field>
                  </div>
                  {pwMsg && (
                    <p className={`text-sm flex items-center gap-1.5 ${pwStatus === "success" ? "text-emerald-600" : "text-red-500"}`}>
                      {pwStatus === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {pwMsg}
                    </p>
                  )}
                  <button
                    onClick={changePassword}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Lock className="w-4 h-4" /> Şifreyi Güncelle
                  </button>
                </div>

                {/* Kullanıcı Yönetimi */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-semibold text-gray-900">Kullanıcı Yönetimi</h2>
                  </div>

                  {/* Kullanıcı listesi */}
                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                    {users.length === 0 && (
                      <p className="py-6 text-center text-sm text-gray-400">Kullanıcı bulunamadı</p>
                    )}
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email} — <span className="capitalize">{u.role}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {u.active ? "Aktif" : "Pasif"}
                          </span>
                          <button
                            onClick={() => toggleUser(u)}
                            title={u.active ? "Pasif yap" : "Aktif yap"}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                          >
                            {u.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            title="Sil"
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Yeni kullanıcı */}
                  <div className="border-t border-gray-100 pt-5 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-700">Yeni Kullanıcı Ekle</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Ad Soyad">
                        <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ahmet Yılmaz" />
                      </Field>
                      <Field label="E-posta">
                        <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" placeholder="ahmet@bantas.com" />
                      </Field>
                      <Field label="Şifre">
                        <Input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" placeholder="••••••••" />
                      </Field>
                      <Field label="Rol">
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                      </Field>
                    </div>
                    {userStatus !== "idle" && (
                      <p className={`text-sm flex items-center gap-1.5 ${userStatus === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {userStatus === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {userStatus === "success" ? "Kullanıcı oluşturuldu." : "Kullanıcı oluşturulamadı."}
                      </p>
                    )}
                    <button
                      onClick={createUser}
                      disabled={userSaving || !newEmail || !newName || !newPass}
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                    >
                      {userSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      Kullanıcı Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
