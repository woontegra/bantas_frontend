'use client';

import { Package, Image, Award, Bell, Info, Menu } from 'lucide-react';

const stats = [
  { icon: Package, label: 'Ürünler', value: '4', color: 'bg-blue-50 text-blue-600' },
  { icon: Image, label: 'Before/After', value: '1', color: 'bg-purple-50 text-purple-600' },
  { icon: Award, label: 'Avantajlar', value: '3', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Bell, label: 'Duyurular', value: '1', color: 'bg-orange-50 text-orange-600' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Hoş geldiniz, içerik yönetim panelinize</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors duration-200">
            Yeni Ürün Ekle
          </button>
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
            Duyuru Oluştur
          </button>
          <button className="px-4 py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200">
            İçerik Düzenle
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Yeni ürün eklendi</p>
              <p className="text-xs text-gray-500 mt-1">Zeytin Tenekeleri kategorisi</p>
            </div>
            <span className="text-xs text-gray-400">2 saat önce</span>
          </div>
          <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Duyuru güncellendi</p>
              <p className="text-xs text-gray-500 mt-1">Ana sayfa duyuru barı</p>
            </div>
            <span className="text-xs text-gray-400">5 saat önce</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Hakkımızda bölümü düzenlendi</p>
              <p className="text-xs text-gray-500 mt-1">Metin ve görseller güncellendi</p>
            </div>
            <span className="text-xs text-gray-400">1 gün önce</span>
          </div>
        </div>
      </div>
    </div>
  );
}
