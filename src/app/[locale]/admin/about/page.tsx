'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Save } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  titleEn?: string;
  titleAr?: string;
  slug: string;
  icon?: string;
  order: number;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  titleEn?: string;
  titleAr?: string;
  slug: string;
  link: string;
  order: number;
}

export default function MegaMenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menu/about');
      const data = await res.json();
      setCategories(data.categories || []);
      if (data.categories && data.categories.length > 0) {
        setSelectedCategory(data.categories[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Mega Menu Yönetimi</h1>
        <p className="text-gray-600">Kategoriler ve alt sayfaları yönetin</p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left - Categories List */}
        <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium text-gray-900">Kategoriler</h2>
            <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="p-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  selectedCategory === category.id
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{category.title}</p>
                  <p className="text-xs text-gray-500">{category.items.length} alt sayfa</p>
                </div>
                <button className="p-1 hover:bg-white rounded">
                  <Edit2 className="w-4 h-4" />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Right - Category Details & Items */}
        <div className="col-span-8 space-y-6">
          {/* Category Info */}
          {selectedCategoryData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Kategori Bilgileri</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık (TR)
                  </label>
                  <input
                    type="text"
                    value={selectedCategoryData.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={selectedCategoryData.slug}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık (EN)
                  </label>
                  <input
                    type="text"
                    value={selectedCategoryData.titleEn || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={selectedCategoryData.icon || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          {selectedCategoryData && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Alt Sayfalar</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                  <Plus className="w-4 h-4" />
                  Yeni Sayfa
                </button>
              </div>
              <div className="p-4">
                {selectedCategoryData.items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    Bu kategoride henüz alt sayfa yok
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCategoryData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.link}</p>
                        </div>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Bu sayfa şu anda sadece görüntüleme modunda. CRUD işlevleri (Ekle, Düzenle, Sil, Sırala) yakında eklenecek.
        </p>
      </div>
    </div>
  );
}
