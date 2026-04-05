"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export type HeroSlidePayload = {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

function isLocalUpload(src: string) {
  return (
    src.startsWith("http://localhost") ||
    src.startsWith("http://127.0.0.1") ||
    src.includes("/uploads/")
  );
}

export function HomeHeroClient({
  slides,
  companyName,
  tagline,
}: {
  slides: HeroSlidePayload[];
  companyName: string;
  tagline: string;
}) {
  const [index, setIndex] = useState(0);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEnter(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      8000,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[index] ?? slides[0];

  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-[#06061a]">
      {/* Arka plan slaytları + Ken Burns */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={`${s.image}-${i}`}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-full animate-hero-ken-burns will-change-transform">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                  unoptimized={isLocalUpload(s.image)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cam efekti + renk */}
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-br from-brand/35 via-transparent to-accent-red/20 mix-blend-overlay"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-t from-[#030308] via-brand-dark/75 to-brand/45"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgba(255,255,255,0.12),transparent_55%)]"
        aria-hidden
      />

      {/* İnce ızgara */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.2] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]"
        aria-hidden
      />

      {/* Dekoratif halka (çok hafif) */}
      <div
        className="pointer-events-none absolute -left-[20%] top-1/2 z-[3] h-[min(90vw,720px)] w-[min(90vw,720px)] -translate-y-1/2 rounded-full border border-white/[0.07] opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[15%] top-[10%] z-[3] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full border border-white/[0.05]"
        aria-hidden
      />

      {/* İçerik */}
      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-4 pb-28 pt-28 text-center md:pb-32">
        <div
          className={`max-w-5xl transition-opacity duration-700 ${
            enter ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className={`mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/75 sm:text-xs ${
              enter ? "animate-hero-fade-up" : ""
            }`}
          >
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-white/50 sm:w-12" />
            {companyName}
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-white/50 sm:w-12" />
          </p>

          <h1
            className={`break-words text-balance bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent drop-shadow-[0_4px_32px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl ${
              enter ? "animate-hero-fade-up-delay" : ""
            }`}
          >
            {current.title}
          </h1>

          {current.subtitle ? (
            <p
              className={`mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg md:leading-relaxed ${
                enter ? "animate-hero-fade-up-delay-2" : ""
              }`}
            >
              {current.subtitle}
            </p>
          ) : null}

          <div
            className={`mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center ${
              enter ? "animate-hero-fade-up-delay-3" : ""
            }`}
          >
            <Link
              href={current.ctaLink}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-10 py-4 text-sm font-semibold text-brand shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_-12px_rgba(47,47,143,0.55)]"
            >
              <span className="absolute inset-0 bg-white/95 backdrop-blur-md transition duration-300 group-hover:bg-white" />
              <span className="relative flex items-center gap-2">
                {current.ctaText}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
            <span className="hidden h-10 w-px bg-white/20 sm:block" aria-hidden />
            <p className="max-w-xs text-left text-xs leading-relaxed text-white/50 sm:max-w-sm">
              {tagline}
            </p>
          </div>
        </div>

        {/* Slayt noktaları */}
        {slides.length > 1 ? (
          <div
            className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-28"
            role="tablist"
            aria-label="Hero slaytları"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slayt ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-10 bg-white shadow-[0_0_16px_rgba(255,255,255,0.5)]"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        ) : null}

        {/* Kaydırma ipucu */}
        <div
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40"
          aria-hidden
        >
          <span className="animate-hero-scroll-hint">
            <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </section>
  );
}
