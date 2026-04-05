"use client";

import { Factory, Award, Globe, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";

export type HeroSlidePayload = {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

export type HeroFeature = { label: string; href: string };

function isLocalUpload(src: string) {
  return (
    src.startsWith("http://localhost") ||
    src.startsWith("http://127.0.0.1") ||
    src.includes("/uploads/")
  );
}

function CircleImage({
  src,
  alt,
  fallbackIcon: Icon,
  fallbackColor,
}: {
  src?: string;
  alt: string;
  fallbackIcon: React.ElementType;
  fallbackColor: string;
}) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center ${fallbackColor}`}
      >
        <Icon className="w-14 h-14 opacity-70" />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover rounded-full"
      sizes="(max-width: 768px) 200px, 320px"
      unoptimized={isLocalUpload(src)}
      onError={() => setError(true)}
    />
  );
}

export function HomeHeroClient({
  slides,
  title,
  description,
  features,
  ctaText,
  ctaLink,
}: {
  slides: HeroSlidePayload[];
  title: string;
  description: string;
  features: HeroFeature[];
  ctaText: string;
  ctaLink: string;
}) {
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const main = slides[0];
  const topRight = slides[1];
  const bottomLeft = slides[2];

  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden">
      {/* Navy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0f2a5a] to-[#1e3a8a]" />

      {/* Radial glow center-right */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 min-h-[88vh] flex items-center pt-20 pb-10">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── Left ── */}
            <div
              className={`space-y-7 transition-all duration-700 ${
                enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-normal leading-snug text-white tracking-tight">
                {title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg font-light text-white/70 leading-relaxed max-w-xl">
                {description}
              </p>

              {/* Feature list */}
              <div className="space-y-3 pt-1">
                {features.map((f, i) => (
                  <Link
                    key={i}
                    href={f.href as "/"}
                    className="flex items-center gap-3 text-sm font-light text-white/60 hover:text-emerald-400 transition-colors duration-300 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {f.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ctaLink as "/"}
                className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-md transition-all duration-300 shadow-lg shadow-emerald-700/30 hover:shadow-emerald-500/40 group"
              >
                {ctaText}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* ── Right — floating circles ── */}
            <div
              className={`relative h-[520px] sm:h-[600px] lg:h-[680px] transition-all duration-1000 delay-300 ${
                enter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Top-right circle */}
              <div
                className="absolute top-4 right-4 sm:top-8 sm:right-8 lg:top-10 lg:right-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 z-10"
                style={{ animation: "heroFloat 6s ease-in-out infinite" }}
              >
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/90 to-white/80 border border-white/30 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  <CircleImage
                    src={topRight?.image}
                    alt={topRight?.title ?? ""}
                    fallbackIcon={Award}
                    fallbackColor="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                </div>
                <div className="absolute -inset-1.5 rounded-full border border-white/15" />
              </div>

              {/* Center (main) circle */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 z-20"
                style={{
                  animation: "heroFloat 8s ease-in-out infinite",
                  animationDelay: "0.5s",
                }}
              >
                <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-3xl" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/95 to-white/85 border border-white/25 shadow-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-500">
                  {main?.image ? (
                    <CircleImage
                      src={main.image}
                      alt={main.title}
                      fallbackIcon={Factory}
                      fallbackColor="bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white">
                      <Factory className="w-16 h-16 text-gray-500 mb-2" />
                      <p className="text-gray-700 font-light text-base">Metal Ambalaj</p>
                      <p className="text-gray-400 text-sm font-light">Premium Kalite</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent rounded-full" />
                </div>
                <div className="absolute -inset-2 rounded-full border border-white/20" />
              </div>

              {/* Bottom-left circle */}
              <div
                className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 lg:bottom-10 lg:left-10 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 z-10"
                style={{
                  animation: "heroFloat 7s ease-in-out infinite",
                  animationDelay: "1s",
                }}
              >
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/90 to-white/80 border border-white/30 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-500">
                  <CircleImage
                    src={bottomLeft?.image}
                    alt={bottomLeft?.title ?? ""}
                    fallbackIcon={Globe}
                    fallbackColor="bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full" />
                </div>
                <div className="absolute -inset-1.5 rounded-full border border-white/15" />
              </div>

              {/* Bottom icon bar */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2"
                style={{
                  animation: "heroFloat 9s ease-in-out infinite",
                  animationDelay: "2s",
                }}
              >
                {slides.slice(0, 5).map((s, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm overflow-hidden flex-shrink-0 hover:scale-110 transition-transform duration-300"
                  >
                    <div className="relative w-full h-full">
                      {s.image && (
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          className="object-cover rounded-full"
                          sizes="48px"
                          unoptimized={isLocalUpload(s.image)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Float keyframes */}
      <style jsx global>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25%       { transform: translateY(-14px) translateX(8px); }
          50%       { transform: translateY(-22px) translateX(-4px); }
          75%       { transform: translateY(-8px) translateX(12px); }
        }
      `}</style>
    </section>
  );
}
