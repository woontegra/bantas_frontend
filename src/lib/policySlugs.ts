/** Politikalarımız alt sayfa URL segmentleri (sıra: Kurumsal menü ile aynı) */
export const POLICY_SLUGS = [
  "bilgi-guvenligi-politikasi",
  "gida-guvenligi-politikasi",
  "insan-kaynaklari-politikasi",
  "is-sagligi-guvenligi-politikasi",
  "kalite-politikasi",
  "kisisel-veri-saklama-ve-imha-politikasi",
  "kisisel-verilerin-korunmasi-ve-islenmesi-politikasi",
  "web-sitesi-aydinlatma-politikasi",
  "kvkk-basvuru-formu",
] as const;

export type PolicySlug = (typeof POLICY_SLUGS)[number];

export function isPolicySlug(s: string): s is PolicySlug {
  return (POLICY_SLUGS as readonly string[]).includes(s);
}
