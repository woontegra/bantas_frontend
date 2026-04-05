"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  dragHint?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "",
  afterAlt = "",
  dragHint,
}: Props) {
  const [pct, setPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const calcPct = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(100, Math.max(0, raw)));
  }, []);

  const endDrag = useCallback((pointerId: number) => {
    isDragging.current = false;
    const el = containerRef.current;
    if (!el) return;
    try {
      el.releasePointerCapture(pointerId);
    } catch {
      /* zaten bırakılmış */
    }
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    el.setPointerCapture(e.pointerId);
    calcPct(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    calcPct(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    endDrag(e.pointerId);
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    endDrag(e.pointerId);
  };

  const rightInset = 100 - pct;

  return (
    <div className="group relative">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-col-resize touch-none select-none overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-200"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={() => {
          isDragging.current = false;
        }}
        style={{ touchAction: "none" }}
      >
        {/* pointer-events-none: görseller fareyi yutmasın; sürükleme konteynerde */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 p-6 md:p-10">
            <Image
              src={afterSrc}
              alt={afterAlt}
              fill
              draggable={false}
              className="object-contain select-none"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={
                afterSrc.startsWith("http://localhost") ||
                afterSrc.startsWith("http://127.0.0.1") ||
                afterSrc.includes("/uploads/")
              }
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-100"
          style={{ clipPath: `inset(0 ${rightInset}% 0 0)` }}
        >
          <div className="absolute inset-0 p-6 md:p-10">
            <Image
              src={beforeSrc}
              alt={beforeAlt}
              fill
              draggable={false}
              className="object-contain select-none"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={
                beforeSrc.startsWith("http://localhost") ||
                beforeSrc.startsWith("http://127.0.0.1") ||
                beforeSrc.includes("/uploads/")
              }
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-[2px] bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)]"
          style={{ left: `calc(${pct}% - 1px)` }}
        />

        {/* Kolu da tıklanabilir; olay konteynere kabarcıklanır */}
        <div
          className="pointer-events-auto absolute top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full bg-white shadow-2xl ring-4 ring-white/70 transition-shadow group-hover:ring-brand/40"
          style={{ left: `${pct}%` }}
          aria-hidden
        >
          <ChevronsLeftRight className="h-5 w-5 text-brand" strokeWidth={2.5} />
        </div>
      </div>

      {dragHint ? (
        <p className="mt-3 text-center text-xs text-slate-400">{dragHint}</p>
      ) : null}
    </div>
  );
}
