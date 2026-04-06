"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  /** "header" → kırmızı/lacivert renk  |  "footer" → kırmızı/beyaz renk */
  variant?: "header" | "footer";
  className?: string;
}

export function LogoImage({ src, alt, variant = "header", className }: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return variant === "footer" ? (
      <div className="flex items-baseline gap-0 font-bold">
        <span className="text-xl text-accent-red">BAN</span>
        <span className="text-xl text-white">TAŞ</span>
      </div>
    ) : (
      <span className="font-bold tracking-tight">
        <span className="text-lg text-accent-red sm:text-xl">BAN</span>
        <span className="text-lg text-brand sm:text-xl">TAŞ</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className ?? (variant === "footer" ? "h-10 w-auto object-contain" : "h-9 w-auto object-contain sm:h-11")}
      onError={() => setBroken(true)}
    />
  );
}
