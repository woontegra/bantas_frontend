"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Kök <html lang> kök layout’ta sabit; locale değişince burada güncellenir. */
export function DocumentLangEffect() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
