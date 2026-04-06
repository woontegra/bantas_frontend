"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
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
export type HeroStat    = { value: string; label: string };

function isLocalUpload(src: string) {
  return (
    src.startsWith("http://localhost") ||
    src.startsWith("http://127.0.0.1") ||
    src.includes("/uploads/")
  );
}

export function HomeHeroClient({
  slides,
  title,
  description,
  badge,
  btn2Text,
  btn2Url,
  stats,
  features,
  ctaText,
  ctaLink,
}: {
  slides: HeroSlidePayload[];
  title: string;
  description: string;
  badge: string;
  btn2Text: string;
  btn2Url: string;
  stats: HeroStat[];
  features: HeroFeature[];
  ctaText: string;
  ctaLink: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (fading || slides.length <= 1) return;
      setFading(true);
      setTimeout(() => {
        setIndex(((next % slides.length) + slides.length) % slides.length);
        setFading(false);
      }, 600);
    },
    [fading, slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => goTo(index + 1), 8000);
    return () => clearInterval(t);
  }, [index, slides.length, goTo]);

  const current = slides[index] ?? slides[0];

  /* Split title at first space to highlight second part */
  const words = (current.title || title).split(" ");
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <section className="relative w-full overflow-hidden bg-[#03030f]" style={{ height: "900px" }}>

      {/* ── Background image slider ── */}
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              i === index && !fading ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
          >
            {/* Ken Burns zoom */}
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                animation: i === index ? "kenBurns 12s ease-in-out forwards" : "none",
              }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
                unoptimized={isLocalUpload(s.image)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Layered overlays for depth ── */}
      {/* Deep navy gradient from left */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#03030f]/95 via-[#03030f]/70 to-[#03030f]/20" />
      {/* Bottom fade */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#03030f] via-transparent to-transparent" />
      {/* Top subtle fade */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#03030f]/40 via-transparent to-transparent" />

      {/* ── Fine grain texture ── */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col h-[900px] px-8 sm:px-14 lg:px-24 xl:px-32">

        {/* Vertical accent line */}
        <div
          className={`absolute left-8 sm:left-14 lg:left-24 xl:left-32 top-[20%] w-px bg-gradient-to-b from-transparent via-emerald-400/60 to-transparent transition-all duration-1000 delay-500 ${
            visible ? "h-48 opacity-100" : "h-0 opacity-0"
          }`}
        />

        {/* ── Content block ── */}
        <div className="flex-1 flex flex-col justify-center pt-28 pb-10 max-w-4xl">

          {/* Label badge */}
          <div
            className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="h-px w-10 bg-emerald-400" />
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.35em]">
              {badge}
            </span>
          </div>

          {/* Giant headline */}
          <div
            className={`mb-8 transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter text-white">
              {firstLine}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {secondLine}
              </span>
            </h1>
          </div>

          {/* Description */}
          <p
            className={`text-base sm:text-lg text-white/55 font-light leading-relaxed max-w-lg mb-10 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {current.subtitle || description}
          </p>

          {/* CTA buttons */}
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href={(current.ctaLink || ctaLink) as "/"}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_0_32px_rgba(52,211,153,0.35)] hover:shadow-[0_0_48px_rgba(52,211,153,0.5)] overflow-hidden"
            >
              <span className="relative z-10">{current.ctaText || ctaText}</span>
              <span className="relative z-10 text-lg leading-none group-hover:translate-x-1 transition-transform duration-300">→</span>
              {/* shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              href={btn2Url as "/"}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm font-medium rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              {btn2Text}
            </Link>
          </div>

          {/* Feature links */}
          <div
            className={`flex flex-wrap gap-x-6 gap-y-2 mt-10 transition-all duration-700 delay-[400ms] ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {features.map((f, i) => (
              <Link
                key={i}
                href={f.href as "/"}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-emerald-400 transition-colors duration-200 group"
              >
                <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-emerald-400 transition-colors duration-200" />
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div
          className={`py-6 border-t border-white/10 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {stats.map((s, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {s.value}
                </span>
                <span className="text-xs text-white/40 font-light uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}

            {/* Slide dots — right side of stats bar */}
            {slides.length > 1 && (
              <div className="ml-auto flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slayt ${i + 1}`}
                    className={`rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-8 h-1.5 bg-emerald-400"
                        : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className={`absolute bottom-24 right-10 z-10 flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/25 transition-all duration-700 delay-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <span className="[writing-mode:vertical-rl]">Keşfet</span>
        <ChevronDown className="h-4 w-4 animate-bounce mt-1" strokeWidth={1.5} />
      </div>

      {/* ── Keyframes ── */}
      <style jsx global>{`
        @keyframes kenBurns {
          0%   { transform: scale(1)    translateX(0px)   translateY(0px); }
          100% { transform: scale(1.08) translateX(-20px) translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
