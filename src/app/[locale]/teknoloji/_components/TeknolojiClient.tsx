"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Factory, Ruler } from "lucide-react";
import { mediaUrl } from "@/lib/api";
import Image from "next/image";
import { shouldUnoptimizeRemoteImage as unoptimized } from "@/lib/nextImagePolicy";

/* ── Image Carousel ── */
export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const hasImages = images && images.length > 0;

  return (
    <div className="group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700">
      {hasImages ? (
        <Image
          src={mediaUrl(images[idx])}
          alt={`${alt} ${idx + 1}`}
          fill
          className="object-cover"
          unoptimized={unoptimized(mediaUrl(images[idx]))}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-white">
          <div className="text-center">
            <Factory className="mx-auto mb-3 h-16 w-16 opacity-40" />
            <p className="text-sm text-white/60">Görsel yüklenmedi</p>
          </div>
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Nav arrows */}
      {hasImages && images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-gray-800 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-gray-800 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sizes List Panel ── */
export function SizesList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  const corner = items.filter((_, i) => i < 5);
  const round  = items.filter((_, i) => i >= 5);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Ruler className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-5">
        {corner.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Köşeli Tenekeler
            </p>
            <ul className="space-y-1.5">
              {corner.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-sm bg-indigo-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {round.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Yuvarlak Tenekeler
            </p>
            <ul className="space-y-1.5">
              {round.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
