"use client";

import { useState } from "react";
import { Users, ChevronDown, ShieldCheck, Star, Info } from "lucide-react";

export interface BoardMember { name: string; title: string; details: string; }
export interface StatCard    { label: string; value: string; sublabel: string; }
export interface YonetimKuruluData {
  boardMembers: BoardMember[];
  stats:        StatCard[];
  infoTitle:    string;
  infoText:     string;
  ctaTitle:     string;
  ctaText:      string;
}

const STAT_ICONS  = [Users, ShieldCheck, Star];
const STAT_COLORS = [
  { bg: "from-indigo-50 to-blue-50",  border: "border-indigo-200", text: "text-indigo-600" },
  { bg: "from-blue-50 to-cyan-50",    border: "border-blue-200",   text: "text-blue-600"   },
  { bg: "from-purple-50 to-pink-50",  border: "border-purple-200", text: "text-purple-600" },
];

export function YonetimKuruluClient({ data }: { data: YonetimKuruluData }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-w-0 flex-1 space-y-6">
      {/* Board members accordion */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <Users className="h-5 w-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Yönetim Kurulu Üyeleri</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {data.boardMembers.map((m, i) => (
            <div key={i}>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-indigo-50"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{m.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-indigo-600">{m.title}</p>
                </div>
                <ChevronDown
                  className={`ml-4 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    expanded === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded === i && (
                <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
                  {m.details ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {m.details}
                    </p>
                  ) : (
                    <p className="italic text-sm text-gray-400">
                      Detaylı bilgi yakında eklenecektir.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {data.stats.map((s, i) => {
          const Icon  = STAT_ICONS[i % STAT_ICONS.length];
          const color = STAT_COLORS[i % STAT_COLORS.length];
          return (
            <div key={i} className={`rounded-2xl border bg-gradient-to-br p-5 ${color.bg} ${color.border}`}>
              <div className="mb-2 flex items-center gap-2">
                <Icon className={`h-7 w-7 ${color.text}`} />
                <span className="text-sm font-semibold text-gray-800">{s.label}</span>
              </div>
              <p className={`text-3xl font-bold ${color.text}`}>{s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.sublabel}</p>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div>
          <p className="mb-1 text-sm font-semibold text-blue-900">{data.infoTitle}</p>
          <p className="text-sm leading-relaxed text-blue-800">{data.infoText}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center text-white">
        <Users className="mx-auto mb-4 h-12 w-12 opacity-80" />
        <h2 className="mb-3 text-2xl font-light md:text-3xl">{data.ctaTitle}</h2>
        <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-blue-100">{data.ctaText}</p>
      </div>
    </div>
  );
}
