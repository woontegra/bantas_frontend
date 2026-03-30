'use client';

import { Shield, Award, Sparkles } from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: 'Güvenilir Hizmet',
    description: 'Müşteri memnuniyeti odaklı güvenilir hizmet anlayışı',
  },
  {
    icon: Award,
    title: '31 Yıllık Tecrübe',
    description: 'Sektörde 31 yıllık deneyim ve uzmanlık',
  },
  {
    icon: Sparkles,
    title: 'Yüksek Kalite',
    description: 'Uluslararası standartlarda kalite güvencesi',
  },
];

export default function Advantages() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3 sm:space-y-4"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-normal text-gray-900">
                  {advantage.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm font-light text-gray-600 max-w-xs mx-auto leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
