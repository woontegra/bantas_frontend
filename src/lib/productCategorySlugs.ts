/** Ürünler alt kategori URL segmentleri */
export const PRODUCT_CATEGORY_SLUGS = [
  "peynir-tenekeleri",
  "yag-tenekeleri",
  "zeytin-tursu-tenekeleri",
  "tiner-antifriz-madeni-yag-tenekeleri",
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORY_SLUGS)[number];

export function isProductCategorySlug(s: string): s is ProductCategorySlug {
  return (PRODUCT_CATEGORY_SLUGS as readonly string[]).includes(s);
}
