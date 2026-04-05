"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";
import { adminFetch } from "@/lib/adminApi";
import { Loader2, Mail, MailOpen } from "lucide-react";
import type { ContactMessage } from "@/lib/api";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  async function load() {
    setLoading(true);
    try { setMessages(await adminFetch<ContactMessage[]>("/api/contact")); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await adminFetch(`/api/contact/${id}/read`, { method: "PUT" });
    load();
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">İletişim Mesajları</h1>
        <p className="mt-0.5 text-sm text-slate-500">Siteden gelen mesajlar</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700">
              Tüm Mesajlar ({messages.length})
            </div>
            <div className="divide-y divide-slate-100">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-400">Henüz mesaj yok.</p>
              )}
              {messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelected(m); if (!m.isRead) markRead(m.id); }}
                  className={`w-full px-5 py-4 text-left transition hover:bg-slate-50 ${selected?.id === m.id ? "bg-brand/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${m.isRead ? "text-slate-300" : "text-brand"}`}>
                      {m.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-semibold ${m.isRead ? "text-slate-500" : "text-slate-900"}`}>{m.name}</p>
                      <p className="truncate text-xs text-slate-500">{m.subject ?? m.email}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{new Date(m.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selected ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 border-b border-slate-100 pb-4">
                <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-sm text-brand hover:underline">{selected.email}</a>
                {selected.phone && <p className="text-sm text-slate-500">{selected.phone}</p>}
                {selected.subject && <p className="mt-2 text-sm font-medium text-slate-700">{selected.subject}</p>}
                <p className="mt-1 text-xs text-slate-400">{new Date(selected.createdAt).toLocaleString("tr-TR")}</p>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{selected.message}</p>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ""}`}
                className="mt-6 inline-block rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-muted"
              >
                E-posta ile Yanıtla
              </a>
            </div>
          ) : (
            <div className="hidden items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 lg:flex">
              Görüntülemek için bir mesaj seçin
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
