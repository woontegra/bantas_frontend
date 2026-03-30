'use client';

import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const corporateLinks = [
    { label: 'Hakkımızda', href: '#about' },
    { label: 'Tarihçe', href: '#history' },
    { label: 'Teknoloji', href: '#technology' },
    { label: 'Kalite Belgeleri', href: '#quality-certificates' },
  ];

  const investorLinks = [
    { label: 'Bilgi Toplum Hizmetleri', href: '#information-society' },
    { label: 'Yönetim Kurulu', href: '#board' },
    { label: 'Komiteler', href: '#committees' },
    { label: 'Genel Kurul Bilgileri', href: '#general-assembly' },
  ];

  const menuLinks = [
    { label: 'Haberler', href: '#news' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'İletişim', href: '#contact' },
    { label: 'E-Ödeme', href: '#e-payment' },
  ];

  const socialMedia = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-[#1a1f2e] via-[#252b3d] to-[#1a1f2e] text-gray-300 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          
          {/* Left Column - Company Info */}
          <div className={`space-y-5 sm:space-y-6 ${isRTL ? 'sm:text-right' : ''}`}>
            {/* Logo with Glow Effect */}
            <div className="mb-6 sm:mb-7">
              <h3 className="text-2xl sm:text-3xl font-light tracking-wider text-white relative inline-block">
                BANTAS
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent"></div>
              </h3>
              <p className="text-[10px] sm:text-xs font-light text-gray-500 mt-3 tracking-wide">
                METAL AMBALAJ
              </p>
            </div>

            {/* Address */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-start gap-3 group`}>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-light leading-relaxed text-gray-400">
                  Organize Sanayi Bölgesi<br />
                  1. Cadde No: 123<br />
                  İzmir, Türkiye
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 group`}>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Phone className="w-4 h-4 text-emerald-400" />
              </div>
              <a href="tel:+902321234567" className="text-xs sm:text-sm font-light text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                +90 (232) 123 45 67
              </a>
            </div>

            {/* Email */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3 group`}>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Mail className="w-4 h-4 text-emerald-400" />
              </div>
              <a href="mailto:info@bantas.com.tr" className="text-xs sm:text-sm font-light text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                info@bantas.com.tr
              </a>
            </div>
          </div>

          {/* Column 2 - Kurumsal */}
          <div className={`space-y-4 sm:space-y-5 ${isRTL ? 'sm:text-right' : ''}`}>
            <div>
              <h4 className="text-sm sm:text-base font-normal text-white mb-4 sm:mb-5 tracking-wide">
                Kurumsal
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {corporateLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`text-xs sm:text-sm font-light text-gray-400 hover:text-emerald-400 hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} inline-flex items-center gap-2 transition-all duration-300 group`}
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3 - Yatırımcı İlişkileri */}
          <div className={`space-y-4 sm:space-y-5 ${isRTL ? 'sm:text-right' : ''}`}>
            <div>
              <h4 className="text-sm sm:text-base font-normal text-white mb-4 sm:mb-5 tracking-wide">
                Yatırımcı İlişkileri
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {investorLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`text-xs sm:text-sm font-light text-gray-400 hover:text-emerald-400 hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} inline-flex items-center gap-2 transition-all duration-300 group`}
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4 - Menü */}
          <div className={`space-y-4 sm:space-y-5 ${isRTL ? 'sm:text-right' : ''}`}>
            <div>
              <h4 className="text-sm sm:text-base font-normal text-white mb-4 sm:mb-5 tracking-wide">
                Menü
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`text-xs sm:text-sm font-light text-gray-400 hover:text-emerald-400 hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} inline-flex items-center gap-2 transition-all duration-300 group`}
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors duration-300"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar - Copyright & Social Media */}
      <div className="relative z-10 border-t border-white/5 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
          <div className={`flex flex-col sm:flex-row ${isRTL ? 'sm:flex-row-reverse' : ''} items-center justify-between gap-5 sm:gap-6`}>
            
            {/* Copyright */}
            <div className={`text-xs sm:text-sm font-light text-gray-500 ${isRTL ? 'sm:text-right' : 'sm:text-left'} text-center`}>
              © {new Date().getFullYear()} <span className="text-gray-400">Bantaş Metal Ambalaj</span> • Tüm hakları saklıdır.
            </div>

            {/* Social Media Icons */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-2.5 sm:gap-3`}>
              {socialMedia.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300"></div>
                    <Icon className="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-500 group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
