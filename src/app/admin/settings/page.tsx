"use client";

import { AdminShell } from "../_components/AdminShell";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <AdminShell>
      <div className="p-6 ">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
            <p className="text-sm text-gray-500">
              Google, Facebook API entegrasyonları ve genel site ayarları
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
          <Settings className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            API entegrasyonları ve genel ayarlar yakında eklenecek.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}

