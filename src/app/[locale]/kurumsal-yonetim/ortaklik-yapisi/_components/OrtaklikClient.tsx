"use client";

import { Users, PieChart, BarChart2, Info } from "lucide-react";

export interface Shareholder {
  name:       string;
  shares:     string;
  currency:   string;
  percentage: string;
}

export interface StatCard {
  label:    string;
  value:    string;
  sublabel: string;
}

export interface OrtaklikData {
  shareholders: Shareholder[];
  stats:        StatCard[];
  infoTitle:    string;
  infoText:     string;
  ctaTitle:     string;
  ctaText:      string;
}

const STAT_ICONS  = [Users, PieChart, BarChart2];
const STAT_COLORS = [
  { bg: "from-indigo-50 to-blue-50",  border: "border-indigo-200", text: "text-indigo-600" },
  { bg: "from-blue-50 to-cyan-50",    border: "border-blue-200",   text: "text-blue-600"   },
  { bg: "from-purple-50 to-pink-50",  border: "border-purple-200", text: "text-purple-600" },
];

export function OrtaklikClient({ data }: { data: OrtaklikData }) {
  return (
    <div className="min-w-0 flex-1 space-y-6">
      {/* Shareholders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
          <PieChart className="h-5 w-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Ortaklık Dağılımı</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Ortağın Adı-Soyadı / Ticaret Ünvanı
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Sermayedeki Payı (TL)
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Para Birimi
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Sermayedeki Payı (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.shareholders.map((s, i) => (
                <tr
                  key={i}
                  className={`transition-colors hover:bg-indigo-50 ${
                    s.name === "Halka Açık Kısım" ? "bg-blue-50 font-semibold" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-gray-900">{s.shares}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{s.currency}</td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">{s.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Info Box */}
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
