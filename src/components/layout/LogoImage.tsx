"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
}

export function LogoImage({ src, alt }: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
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
      className="h-9 w-auto object-contain sm:h-11"
      onError={() => setBroken(true)}
    />
  );
}
