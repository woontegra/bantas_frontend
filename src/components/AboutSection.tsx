'use client';

import { Factory, Users, Globe2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          
          {/* Left - Text Content */}
          <div className="space-y-5 sm:space-y-6 md:space-y-7">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900">
              Hakkımızda
            </h2>

            <div className="space-y-4 sm:space-y-5">
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
                Bantaş Metal Ambalaj, 1993 yılında kurulmuş olup, metal ambalaj sektöründe 
                31 yıllık deneyimi ile Türkiye'nin önde gelen üreticilerinden biridir.
              </p>

              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
                Modern üretim tesisimizde, son teknoloji makineler ve uzman kadromuzla, 
                müşterilerimize en kaliteli ürünleri sunmayı hedefliyoruz.
              </p>

              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
                Yurt içi ve yurt dışı pazarlarda güçlü bir konuma sahip olan firmamız, 
                sürekli gelişim ve yenilik ilkesiyle çalışmalarını sürdürmektedir.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Factory className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900">31+</p>
                <p className="text-xs sm:text-sm font-light text-gray-600">Yıl Tecrübe</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900">500+</p>
                <p className="text-xs sm:text-sm font-light text-gray-600">Müşteri</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Globe2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900">15+</p>
                <p className="text-xs sm:text-sm font-light text-gray-600">Ülke</p>
              </div>
            </div>
          </div>

          {/* Right - Images Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Large Image */}
            <div className="col-span-2 aspect-[16/10] bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg overflow-hidden shadow-md">
              <div className="w-full h-full flex items-center justify-center">
                <Factory className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
              </div>
            </div>

            {/* Two Small Images */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden shadow-sm">
              <div className="w-full h-full flex items-center justify-center">
                <Factory className="w-12 h-12 sm:w-14 sm:h-14 text-gray-300" />
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden shadow-sm">
              <div className="w-full h-full flex items-center justify-center">
                <Factory className="w-12 h-12 sm:w-14 sm:h-14 text-gray-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
