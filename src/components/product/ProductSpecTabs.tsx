"use client";

import { useState } from "react";
import type { SpecTable, ColorTheme } from "@/lib/productStaticData";

export function ProductSpecTabs({
  tables,
  theme,
}: {
  tables: SpecTable[];
  theme: ColorTheme;
}) {
  const [active, setActive] = useState(0);

  if (tables.length === 0) return null;

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold text-gray-900">Ürün Detayı</h2>

      {/* Tabs */}
      {tables.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-4">
          {tables.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-xl px-8 py-4 font-semibold transition-all ${
                active === i
                  ? `bg-gradient-to-r ${theme.tableHeader} text-white shadow-lg`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label} Ölçüleri
            </button>
          ))}
        </div>
      )}

      {tables.length === 1 && (
        <p className="mb-4 font-semibold text-gray-600">
          {tables[0].label}
        </p>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`bg-gradient-to-r text-white ${theme.tableHeader}`}
              >
                {tables[active].columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tables[active].rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`transition-colors ${theme.tableHover}`}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-6 py-4 ${
                        ci === 0
                          ? "font-medium text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
