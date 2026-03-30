'use client';

import React from 'react';
import { ChevronRight, Factory, History, Cpu, FileText, Users, Heart, Leaf } from 'lucide-react';
import type { MenuData } from '@/types/menu';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, any> = {
  History,
  Cpu,
  FileText,
  Users,
  Heart,
  Leaf,
  Factory,
};

// Static fallback data for Vercel build
const staticMenuData: MenuData = {
  categories: [
    {
      id: '1',
      title: 'Tarihçe',
      slug: 'tarihce',
      icon: 'History',
      items: [
        { id: '1-1', title: 'Şirket Tarihçesi', slug: 'sirket-tarihcesi', link: '#tarihce' },
        { id: '1-2', title: 'Kilometre Taşları', slug: 'kilometre-taslari', link: '#milestones' },
      ],
    },
    {
      id: '2',
      title: 'Teknoloji',
      slug: 'teknoloji',
      icon: 'Cpu',
      items: [
        { id: '2-1', title: 'Üretim Teknolojisi', slug: 'uretim-teknolojisi', link: '#technology' },
        { id: '2-2', title: 'Ar-Ge Çalışmaları', slug: 'ar-ge', link: '#rnd' },
      ],
    },
    {
      id: '3',
      title: 'Politikalarımız',
      slug: 'politikalarimiz',
      icon: 'FileText',
      items: [
        { id: '3-1', title: 'Kalite Politikası', slug: 'kalite-politikasi', link: '#quality-policy' },
        { id: '3-2', title: 'Çevre Politikası', slug: 'cevre-politikasi', link: '#environment-policy' },
        { id: '3-3', title: 'İş Sağlığı ve Güvenliği', slug: 'is-sagligi', link: '#health-safety' },
      ],
    },
    {
      id: '4',
      title: 'İnsan Kaynakları',
      slug: 'insan-kaynaklari',
      icon: 'Users',
      items: [
        { id: '4-1', title: 'Kariyer Fırsatları', slug: 'kariyer', link: '#careers' },
        { id: '4-2', title: 'Çalışan Hakları', slug: 'calisan-haklari', link: '#employee-rights' },
      ],
    },
    {
      id: '5',
      title: 'Sosyal Sorumluluk',
      slug: 'sosyal-sorumluluk',
      icon: 'Heart',
      items: [
        { id: '5-1', title: 'Toplum Projeleri', slug: 'toplum-projeleri', link: '#community' },
        { id: '5-2', title: 'Eğitim Destekleri', slug: 'egitim', link: '#education' },
      ],
    },
    {
      id: '6',
      title: 'Sürdürülebilirlik',
      slug: 'surdurulebilirlik',
      icon: 'Leaf',
      items: [
        { id: '6-1', title: 'Çevre Yönetimi', slug: 'cevre-yonetimi', link: '#environment' },
        { id: '6-2', title: 'Enerji Verimliliği', slug: 'enerji', link: '#energy' },
      ],
    },
    {
      id: '7',
      title: 'Fabrikamız',
      slug: 'fabrikamiz',
      icon: 'Factory',
      items: [
        { id: '7-1', title: 'Üretim Tesisleri', slug: 'uretim-tesisleri', link: '#facilities' },
        { id: '7-2', title: 'Kapasite', slug: 'kapasite', link: '#capacity' },
      ],
    },
  ],
  featured: {
    image: '',
    title: 'Kalite ve Güven',
    description: 'ISO 9001 sertifikalı üretim süreçlerimizle sektörde öncüyüz',
    buttonText: 'Daha Fazla Bilgi',
    buttonLink: '#about',
  },
};

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const data = staticMenuData;
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  // Set first category as active when data loads
  React.useEffect(() => {
    if (data?.categories && data.categories.length > 0 && !activeCategory) {
      setActiveCategory(data.categories[0].id);
    }
  }, [data, activeCategory]);

  if (!isOpen) return null;

  const categories = data.categories;
  const activeData = categories.find((cat) => cat.id === activeCategory);
  const activeSubMenu = activeData?.items || [];

  return (
    <>
      {/* Backdrop - Click to close */}
      <div
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Fixed Panel Below Header */}
      <div
        className="fixed top-16 left-0 w-full z-50 bg-white"
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          animation: 'fadeSlideDown 0.3s ease-out',
        }}
      >
        <div className="max-w-7xl mx-auto px-12 py-12">
          
          {/* 3 Area Horizontal Layout */}
          <div className="grid grid-cols-12 gap-12">
            
            {/* LEFT AREA - Categories */}
            <div className="col-span-3">
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon ? iconMap[category.icon] || Factory : Factory;
                  const hasSubmenu = category.items.length > 0;
                  
                  if (hasSubmenu) {
                    return (
                      <button
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-light transition-colors duration-200 flex items-center gap-3 ${
                          activeCategory === category.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{category.title}</span>
                      </button>
                    );
                  }
                  
                  return (
                    <a
                      key={category.id}
                      href={`#${category.slug}`}
                      onClick={onClose}
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-light transition-colors duration-200 flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{category.title}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* CENTER AREA - Dynamic Submenu */}
            <div className="col-span-6">
              {activeSubMenu.length > 0 ? (
                <div className="space-y-2">
                  {activeSubMenu.map((item) => (
                    <a
                      key={item.id}
                      href={item.link}
                      onClick={onClose}
                      className="block px-4 py-3 rounded-lg text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm font-light text-gray-400">
                    Detaylı bilgi için ilgili sayfayı ziyaret edin
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT AREA - Visual Block */}
            <div className="col-span-3">
              <div className="relative h-full min-h-[320px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                {/* Background Image or Pattern */}
                {data.featured?.image ? (
                  <img
                    src={data.featured.image}
                    alt={data.featured.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0">
                    <Factory className="absolute inset-0 m-auto w-28 h-28 text-white/5" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Content */}
                {data.featured && (
                  <div className="relative h-full flex flex-col justify-end p-7">
                    <div className="text-white mb-5">
                      <p className="text-2xl font-light mb-1">{data.featured.title}</p>
                      <p className="text-base font-light opacity-90">{data.featured.description}</p>
                    </div>
                    
                    <a
                      href={data.featured.buttonLink}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 hover:bg-white text-gray-900 rounded-lg text-sm font-light transition-colors duration-200 w-fit"
                    >
                      {data.featured.buttonText}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
