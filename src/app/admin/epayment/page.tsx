"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import {
  CreditCard,
  Link as LinkIcon,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";

const DEFAULT_EPAYMENT_URL =
  "https://bantas.tahsilat.com.tr/payment/?userType=8&tenantId=f1f28d95-4808-444d-9651-16b627e0bace";

export default function EPaymentAdminPage() {
  const [ePaymentUrl, setEPaymentUrl] = useState(DEFAULT_EPAYMENT_URL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    adminFetch<{ ePaymentUrl?: string }>("/api/settings")
      .then((data) => {
        if (data?.ePaymentUrl) setEPaymentUrl(data.ePaymentUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const formData = new FormData();
      formData.append("ePaymentUrl", ePaymentUrl.trim());

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
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">E-Ödeme</h1>
            <p className="text-sm text-gray-500">
              Menüdeki E-Ödeme butonunun yönlendirme adresi
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-white" />
              <h2 className="text-base font-semibold text-white">Ödeme Linki</h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Ziyaretçi menüden <strong>E-Ödeme</strong>&apos;ye tıkladığında
                  bu bağlantı yeni sekmede açılır.
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Ödeme URL
                </label>
                <input
                  type="url"
                  value={ePaymentUrl}
                  onChange={(e) => setEPaymentUrl(e.target.value)}
                  placeholder={DEFAULT_EPAYMENT_URL}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                />
              </div>

              {/* Önizleme */}
              {ePaymentUrl && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 truncate flex-1 mr-3 font-mono">
                    {ePaymentUrl}
                  </p>
                  <a
                    href={ePaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Test Et
                  </a>
                </div>
              )}

              <button
                onClick={() => setEPaymentUrl(DEFAULT_EPAYMENT_URL)}
                className="text-xs text-gray-400 hover:text-gray-600 underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Varsayılana sıfırla
              </button>
            </div>

            {/* Footer / Save */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
              {status === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Başarıyla kaydedildi.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Bir hata oluştu.
                </div>
              )}
              {status === "idle" && <div />}

              <button
                onClick={handleSave}
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
          </div>
        )}
      </div>
    </AdminShell>
  );
}
