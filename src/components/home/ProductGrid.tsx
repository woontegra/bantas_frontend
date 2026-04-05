import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { getHomeProductCategories, mediaUrl } from "@/lib/api";
import { shouldUnoptimizeRemoteImage } from "@/lib/nextImagePolicy";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
];

export async function ProductGrid({ locale }: { locale: string }) {
  const t = await getTranslations("home.products");
  const isEn = locale === "en";

  let categories = await getHomeProductCategories().catch(() => []);

  if (categories.length === 0) {
    const keys = ["olive", "cheese", "oil", "other"] as const;
    categories = keys.map((key, i) => ({
      id: key,
      name: t(key),
      nameEn: t(key),
      image: FALLBACK_IMAGES[i],
      link: "/urunler",
      order: i,
      active: true,
    }));
  }

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold text-brand md:text-4xl">
          {t("title")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const name = isEn ? (cat.nameEn ?? cat.name) : cat.name;
            const imgSrc = cat.image ? mediaUrl(cat.image) : FALLBACK_IMAGES[i % 4];

            return (
              <Link
                key={cat.id}
                href={cat.link ?? "/urunler"}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md hover:ring-brand/20"
              >
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={imgSrc}
                    alt={name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={shouldUnoptimizeRemoteImage(imgSrc)}
                  />
                </div>
                <p className="px-4 py-4 text-center text-sm font-semibold text-slate-800">
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
