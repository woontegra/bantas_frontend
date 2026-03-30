'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Factory, Award, Globe, Cpu, Leaf, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import CTABar from '@/components/CTABar';
import ProductCategories from '@/components/ProductCategories';
import Advantages from '@/components/Advantages';
import BeforeAfter from '@/components/BeforeAfter';
import IntroText from '@/components/IntroText';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  const t = useTranslations();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  const floatingIcons = [
    { icon: Factory, label: t('icons.production'), color: 'text-emerald-600' },
    { icon: Award, label: t('icons.quality'), color: 'text-blue-600' },
    { icon: Globe, label: t('icons.export'), color: 'text-indigo-600' },
    { icon: Cpu, label: t('icons.technology'), color: 'text-cyan-600' },
    { icon: Leaf, label: t('icons.sustainability'), color: 'text-teal-600' },
  ];

  const features = [
    t('hero.productionProcess'),
    t('hero.productGroups'),
    t('hero.sustainability'),
  ];

  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <>
      <Header />
      
      <main className="relative h-[850px] max-h-[900px] overflow-visible">
        {/* Navy Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] pointer-events-none"></div>
        
        {/* Radial Light Effect - Center Right */}
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 via-transparent to-transparent blur-3xl pointer-events-none"></div>
        
        {/* Grain Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        ></div>

        {/* Main Hero Content - Professional Editorial Layout */}
        <div className="relative z-10 h-full flex items-center pt-16 sm:pt-20">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center h-full">
              
              {/* Left Content Area - Small Title, Thin Font - RTL Support */}
              <div className={`space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-7 lg:space-y-8 order-2 lg:order-1 ${isRTL ? 'lg:text-right' : ''}`}>
                {/* Small Elegant Title */}
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-normal leading-snug sm:leading-relaxed text-white tracking-tight break-words">
                  {t('hero.title')}
                </h1>
                
                {/* Description - Thin Font */}
                <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl font-light text-gray-300 leading-relaxed max-w-full lg:max-w-xl break-words">
                  {t('hero.description')}
                </p>

                {/* 3 Link List - Minimal - RTL Support */}
                <div className="space-y-2 xs:space-y-3 sm:space-y-4 pt-2 sm:pt-3 md:pt-4">
                  {features.map((item, index) => (
                    <a 
                      key={index}
                      href="#"
                      className={`flex items-center gap-2 sm:gap-3 text-[11px] xs:text-xs sm:text-sm md:text-base font-light text-gray-300 group cursor-pointer hover:text-emerald-400 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-all duration-300 flex-shrink-0"></div>
                      <span className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform duration-300 break-words`}>{item}</span>
                    </a>
                  ))}
                </div>

                {/* 1 Minimal Button - RTL Support */}
                <button className={`mt-4 xs:mt-5 sm:mt-6 md:mt-8 px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-emerald-600 text-white rounded-md text-[11px] xs:text-xs sm:text-sm font-light hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 flex items-center gap-2 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {t('hero.cta')}
                  <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform duration-300 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Right Side - Clean Circle Only */}
              <div className="relative order-1 lg:order-2 h-[600px] lg:h-[700px]">
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* Central Circle */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[340px] lg:h-[340px] pointer-events-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/15 via-transparent to-blue-500/15 blur-3xl"></div>
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 border border-white/30 shadow-2xl overflow-hidden backdrop-blur-md">
                      <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-12">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100/60 via-white/80 to-gray-100/60 shadow-inner flex items-center justify-center">
                          <div className="text-center">
                            <Factory className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto text-gray-600 mb-3" />
                            <p className="text-gray-800 font-light text-base sm:text-lg md:text-xl">Metal Ambalaj</p>
                            <p className="text-gray-500 text-sm sm:text-base font-light mt-1">Premium Kalite</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
                    </div>
                    <div className="absolute -inset-3 rounded-full border border-white/20"></div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Premium Floating Icons - Below Hero */}
        <div className="absolute -bottom-12 sm:-bottom-14 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Desktop & Tablet - Centered Row */}
            <div className="hidden sm:flex justify-center items-center gap-6 md:gap-8 lg:gap-10">
              {floatingIcons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setHoveredIcon(index)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    {/* Container - 120px */}
                    <div className="w-[120px] h-[120px] flex items-center justify-center relative">
                      {/* Outer Ring */}
                      <div className={`
                        absolute inset-0 rounded-full
                        border-2 border-white/30
                        transition-all duration-300
                        ${hoveredIcon === index ? 'border-emerald-400/50 scale-105' : ''}
                      `}></div>
                      
                      {/* Icon Circle - 96px */}
                      <div className={`
                        w-24 h-24 rounded-full 
                        bg-gradient-to-br from-white via-gray-50 to-white
                        border border-white/20
                        shadow-lg
                        flex items-center justify-center cursor-pointer
                        transition-all duration-300 ease-out
                        ${hoveredIcon === index 
                          ? 'scale-110 -translate-y-1 shadow-2xl shadow-emerald-500/20' 
                          : 'hover:scale-105'
                        }
                      `}>
                        <Icon className={`
                          w-10 h-10 transition-all duration-300
                          ${hoveredIcon === index 
                            ? 'text-emerald-600 scale-110' 
                            : 'text-gray-600'
                          }
                        `} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className={`
                      absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                      px-3 py-1.5 bg-gray-900 text-white text-xs font-light rounded-md
                      transition-all duration-300 pointer-events-none shadow-lg
                      ${hoveredIcon === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
                    `}>
                      {item.label}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile - 2 Rows */}
            <div className="sm:hidden flex flex-col gap-4 items-center">
              {/* First Row - 3 icons */}
              <div className="flex justify-center items-center gap-4">
                {floatingIcons.slice(0, 3).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setHoveredIcon(index)}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <div className="w-[100px] h-[100px] flex items-center justify-center relative">
                        {/* Outer Ring */}
                        <div className={`
                          absolute inset-0 rounded-full
                          border-2 border-white/30
                          transition-all duration-300
                          ${hoveredIcon === index ? 'border-emerald-400/50 scale-105' : ''}
                        `}></div>
                        
                        <div className={`
                          w-20 h-20 rounded-full 
                          bg-gradient-to-br from-white via-gray-50 to-white
                          border border-white/20
                          shadow-lg
                          flex items-center justify-center cursor-pointer
                          transition-all duration-300 ease-out
                          ${hoveredIcon === index 
                            ? 'scale-110 -translate-y-1 shadow-2xl shadow-emerald-500/20' 
                            : ''
                          }
                        `}>
                          <Icon className={`
                            w-8 h-8 transition-all duration-300
                            ${hoveredIcon === index 
                              ? 'text-emerald-600 scale-110' 
                              : 'text-gray-600'
                            }
                          `} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Second Row - 2 icons */}
              <div className="flex justify-center items-center gap-4">
                {floatingIcons.slice(3, 5).map((item, index) => {
                  const Icon = item.icon;
                  const actualIndex = index + 3;
                  return (
                    <div
                      key={actualIndex}
                      className="relative group"
                      onMouseEnter={() => setHoveredIcon(actualIndex)}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <div className="w-[100px] h-[100px] flex items-center justify-center relative">
                        {/* Outer Ring */}
                        <div className={`
                          absolute inset-0 rounded-full
                          border-2 border-white/30
                          transition-all duration-300
                          ${hoveredIcon === actualIndex ? 'border-emerald-400/50 scale-105' : ''}
                        `}></div>
                        
                        <div className={`
                          w-20 h-20 rounded-full 
                          bg-gradient-to-br from-white via-gray-50 to-white
                          border border-white/20
                          shadow-lg
                          flex items-center justify-center cursor-pointer
                          transition-all duration-300 ease-out
                          ${hoveredIcon === actualIndex 
                            ? 'scale-110 -translate-y-1 shadow-2xl shadow-emerald-500/20' 
                            : ''
                          }
                        `}>
                          <Icon className={`
                            w-8 h-8 transition-all duration-300
                            ${hoveredIcon === actualIndex 
                              ? 'text-emerald-600 scale-110' 
                              : 'text-gray-600'
                            }
                          `} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Bar Section */}
      <CTABar />

      {/* Product Categories Section */}
      <ProductCategories />

      {/* Advantages Section */}
      <Advantages />

      {/* Before/After Comparison Section */}
      <BeforeAfter />

      {/* Intro Text Section */}
      <IntroText />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </>
  );
}
