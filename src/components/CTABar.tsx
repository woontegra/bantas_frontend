'use client';

import { useTranslations } from 'next-intl';
import { FileText, Download } from 'lucide-react';

export default function CTABar() {
  const t = useTranslations();

  return (
    <div className="w-full bg-gray-50 border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left - Teklif Al */}
          <button className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-emerald-600 text-white rounded-md text-xs sm:text-sm font-light hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Teklif Al</span>
          </button>

          {/* Center - Duyuru Alanı */}
          <div className="flex-1 text-center px-2 sm:px-4">
            <p className="text-xs sm:text-sm font-light text-gray-600">
              Yeni ürünlerimizi keşfedin • Özel kampanyalar devam ediyor
            </p>
          </div>

          {/* Right - Katalog */}
          <button className="w-full sm:w-auto px-4 sm:px-5 py-2 border border-gray-300 text-gray-700 rounded-md text-xs sm:text-sm font-light hover:border-gray-400 hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Katalog</span>
          </button>
        </div>
      </div>
    </div>
  );
}
