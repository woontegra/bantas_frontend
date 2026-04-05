"use client";

import { useState } from "react";
import {
  Calendar, ChevronDown, FileText, ExternalLink,
  CheckCircle, AlertCircle, Info,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface GKDocument {
  name: string;
  pdfUrl: string;
}

export interface GKMeeting {
  title: string;
  date: string;
  type: "Olağan" | "Olağanüstü";
  documents: GKDocument[];
}

interface Props {
  meetings: GKMeeting[];
  locale: string;
}

export function GenelKurulClient({ meetings, locale }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const isEn = locale === "en";

  const ordinary      = meetings.filter((m) => m.type === "Olağan");
  const extraordinary = meetings.filter((m) => m.type === "Olağanüstü");

  const toggle = (i: number) => setExpanded(expanded === i ? null : i);

  const pdfHref = (url: string) =>
    url.startsWith("http") ? url : `${API_URL}${url}`;

  return (
    <div className="space-y-8">
      {/* Accordion */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <Calendar className="h-5 w-5 text-white" />
          <h2 className="text-lg font-semibold text-white">
            {isEn ? "General Assembly Meetings" : "Genel Kurul Toplantıları"}
          </h2>
        </div>

        {meetings.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-200" />
            <p className="text-sm">{isEn ? "No meetings found." : "Henüz toplantı eklenmedi."}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {meetings.map((m, idx) => (
              <div key={idx}>
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-indigo-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{m.title}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.type === "Olağan" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {isEn ? (m.type === "Olağan" ? "Ordinary" : "Extraordinary") : m.type}
                      </span>
                      <span className="text-sm text-gray-500">{m.date}</span>
                    </div>
                  </div>
                  <ChevronDown className={`ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${expanded === idx ? "rotate-180" : ""}`} />
                </button>

                {expanded === idx && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                    {m.documents.length === 0 ? (
                      <p className="text-sm text-gray-400">{isEn ? "No documents." : "Belge eklenmedi."}</p>
                    ) : (
                      <div className="space-y-2">
                        {m.documents.map((doc, di) => (
                          doc.pdfUrl ? (
                            <a
                              key={di}
                              href={pdfHref(doc.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-indigo-400 hover:bg-indigo-50"
                            >
                              <FileText className="h-6 w-6 shrink-0 text-indigo-500 group-hover:text-indigo-700" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-400">{isEn ? "PDF Document" : "PDF Belgesi"}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-indigo-500" />
                            </a>
                          ) : (
                            <div key={di} className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 opacity-50">
                              <FileText className="h-6 w-6 shrink-0 text-gray-300" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-500 truncate">{doc.name}</p>
                                <p className="text-xs text-gray-400">{isEn ? "PDF not uploaded yet" : "PDF henüz yüklenmedi"}</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {meetings.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-600" />
              <span className="font-semibold text-gray-800 text-sm">{isEn ? "Total Meetings" : "Toplam Toplantı"}</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{meetings.length}</p>
            <p className="mt-1 text-xs text-gray-500">{isEn ? "All time" : "Tüm zamanlar"}</p>
          </div>
          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-800 text-sm">{isEn ? "Ordinary" : "Olağan"}</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{ordinary.length}</p>
            <p className="mt-1 text-xs text-gray-500">{isEn ? "Ordinary meetings" : "Olağan genel kurul"}</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-600" />
              <span className="font-semibold text-gray-800 text-sm">{isEn ? "Extraordinary" : "Olağanüstü"}</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{extraordinary.length}</p>
            <p className="mt-1 text-xs text-gray-500">{isEn ? "Extraordinary meetings" : "Olağanüstü genel kurul"}</p>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="mb-1 font-semibold text-blue-900 text-sm">
            {isEn ? "Information" : "Bilgilendirme"}
          </p>
          <p className="text-sm leading-relaxed text-blue-800">
            {isEn
              ? "All general assembly meeting documents are available for download. Documents are provided in PDF format."
              : "Tüm genel kurul toplantı belgelerine buradan ulaşabilirsiniz. Belgeler PDF formatında sunulmaktadır. Herhangi bir sorunuz için yatırımcı ilişkileri departmanımız ile iletişime geçebilirsiniz."}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center text-white">
        <Calendar className="mx-auto mb-4 h-12 w-12 opacity-80" />
        <h2 className="mb-3 text-2xl font-light md:text-3xl">
          {isEn ? "Stay Informed" : "Güncel Kalın"}
        </h2>
        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-blue-100">
          {isEn
            ? "All important notifications are shared on our Investor Relations page. Please visit regularly for the latest updates."
            : "Tüm önemli bilgilendirmeler Yatırımcı İlişkileri sayfamızda düzenli olarak yayımlanmaktadır. Güncel gelişmeleri takip etmek için sayfamızı ziyaret etmeye devam edin."}
        </p>
      </div>
    </div>
  );
}
