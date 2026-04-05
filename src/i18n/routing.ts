import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  /**
   * "as-needed" bazı ortamlarda `/` ↔ `/tr` arasında 307 döngüsü üretebiliyor.
   * Her dilde URL öneki tutar; @/navigation Link’leri locale’i otomatik ekler.
   */
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});
