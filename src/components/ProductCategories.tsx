'use client';

import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';
import { useState } from 'react';

const categories = [
  { id: 1, name: 'Zeytin Tenekeleri', icon: Package },
  { id: 2, name: 'Peynir Tenekeleri', icon: Package },
  { id: 3, name: 'Yağ Tenekeleri', icon: Package },
  { id: 4, name: 'Diğer Tenekeler', icon: Package },
];

export default function ProductCategories() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 mb-3 sm:mb-4">
            Ürün Kategorilerimiz
          </h2>
          <p className="text-sm sm:text-base font-light text-gray-600 max-w-2xl mx-auto">
            Geniş ürün yelpazemizle ihtiyaçlarınıza özel çözümler sunuyoruz
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  group relative bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer
                  transition-all duration-300
                  ${hoveredCard === category.id ? 'shadow-xl scale-105 border-emerald-300' : 'shadow-sm hover:shadow-lg'}
                `}
              >
                {/* Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                  <div className={`
                    transition-transform duration-500
                    ${hoveredCard === category.id ? 'scale-110' : 'scale-100'}
                  `}>
                    <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-normal text-gray-900 text-center">
                    {category.name}
                  </h3>
                </div>

                {/* Hover Overlay */}
                <div className={`
                  absolute inset-0 bg-emerald-600/5 pointer-events-none
                  transition-opacity duration-300
                  ${hoveredCard === category.id ? 'opacity-100' : 'opacity-0'}
                `} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
