'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import MegaMenu from './MegaMenu';

const languages = [
  { code: 'tr', name: 'TR' },
  { code: 'en', name: 'EN' },
  { code: 'de', name: 'DE' },
  { code: 'fr', name: 'FR' },
  { code: 'ru', name: 'RU' },
  { code: 'ar', name: 'AR' },
];

function MobileAboutAccordion({ label, onClose }: { label: string; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { title: 'Tarihçe', items: ['Kuruluş Hikayemiz', 'Kilometre Taşları', 'Vizyonumuz'] },
    { title: 'Teknoloji', items: ['Üretim Teknolojileri', 'Ar-Ge Çalışmaları', 'Dijital Dönüşüm'] },
    { title: 'Politikalarımız', items: ['Bilgi Güvenliği', 'Gıda Güvenliği', 'İK Politikası', 'İş Sağlığı', 'Kalite', 'KVKK'] },
    { title: 'İnsan Kaynakları', items: ['Kariyer Fırsatları', 'Çalışan Hakları', 'Eğitim ve Gelişim'] },
    { title: 'Sosyal Sorumluluk', items: ['Toplumsal Projeler', 'Eğitim Destekleri', 'Çevre Projeleri'] },
    { title: 'Sürdürülebilirlik', items: ['Çevre Politikamız', 'Enerji Verimliliği', 'Geri Dönüşüm'] },
  ];

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
      >
        <span>{label}</span>
        <X className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-1 animate-[fadeIn_0.2s_ease-out]">
          {categories.map((category, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {category.title}
              </div>
              {category.items.map((item, itemIdx) => (
                <a
                  key={itemIdx}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={onClose}
                  className="block px-4 py-2 text-xs font-light text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const isRTL = locale === 'ar';

  const handleMegaMenuEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    const timeout = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
    setCloseTimeout(timeout);
  };

  const menuItems = [
    { key: 'home', label: t('home') },
    { key: 'about', label: t('about') },
    { key: 'products', label: t('products') },
    { key: 'investor', label: t('investor') },
    { key: 'news', label: t('news') },
    { key: 'gallery', label: t('gallery') },
    { key: 'contact', label: t('contact') },
    { key: 'epayment', label: t('epayment') },
  ];

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setLangOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-lg sm:text-xl font-light tracking-wide text-gray-900">
              BANTAS
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              item.key === 'about' ? (
                <div key={item.key}>
                  <button className="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap">
                    {item.label}
                  </button>
                </div>
              ) : (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className="text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>
          
          {/* Mega Menu - Full Container with Hover Control */}
          <div
            className="absolute left-0 right-0 top-0 h-16"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
          </div>

          {/* Right Side - Language + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-light text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{locale.toUpperCase()}</span>
              </button>

              {langOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangOpen(false)}
                  />
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-28 sm:w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full px-3 sm:px-4 py-2 text-${isRTL ? 'right' : 'left'} text-xs sm:text-sm font-light transition-colors duration-200 ${
                          locale === lang.code
                            ? 'bg-gray-50 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile/Tablet Only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className={`fixed top-14 sm:top-16 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-64 sm:w-72 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto`}>
            <nav className="px-4 sm:px-6 py-6 space-y-1">
              {menuItems.map((item) => (
                item.key === 'about' ? (
                  <MobileAboutAccordion key={item.key} label={item.label} onClose={() => setMobileMenuOpen(false)} />
                ) : (
                  <a
                    key={item.key}
                    href={`#${item.key}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
