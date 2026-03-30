'use client';

import { useState, useRef, useEffect } from 'react';
import { Package } from 'lucide-react';

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 mb-3 sm:mb-4">
            Baskı Öncesi / Sonrası
          </h2>
          <p className="text-sm sm:text-base font-light text-gray-600 max-w-2xl mx-auto">
            Ürünlerinizi özel tasarımlarla hayata geçiriyoruz
          </p>
        </div>

        {/* Comparison Container */}
        <div className="max-w-3xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Before Image (Left) */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <Package className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-400 mb-3" />
                <p className="text-sm sm:text-base font-light text-gray-500">Boş Teneke</p>
              </div>
            </div>

            {/* After Image (Right) - Clipped */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="text-center">
                <Package className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-emerald-600 mb-3" />
                <p className="text-sm sm:text-base font-light text-emerald-700">Baskılı Ürün</p>
              </div>
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                  <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
              <p className="text-xs sm:text-sm font-light text-gray-700">Önce</p>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
              <p className="text-xs sm:text-sm font-light text-gray-700">Sonra</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
