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
    <section className="bg-slate-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand/60 mb-3">
            <span className="w-6 h-px bg-brand/40" />
            {t("title")}
            <span className="w-6 h-px bg-brand/40" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Ürün Gruplarımız
          </h2>
          <p className="mt-4 text-slate-500 text-base font-light max-w-xl mx-auto">
            Metal ambalaj çözümlerimizi keşfedin
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const name = isEn ? (cat.nameEn ?? cat.name) : cat.name;
            const imgSrc = cat.image ? mediaUrl(cat.image) : FALLBACK_IMAGES[i % 4];

            return (
              <Link
                key={cat.id}
                href={cat.link ?? "/urunler"}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-brand/30"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden flex items-center justify-center p-6">
                  <Image
                    src={imgSrc}
                    alt={name}
                    fill
                    className="object-contain transition duration-500 group-hover:scale-105 p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={shouldUnoptimizeRemoteImage(imgSrc)}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Label */}
                <div className="px-5 py-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-brand transition-colors duration-200">
                    {name}
                  </p>
                  <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-brand flex items-center justify-center transition-all duration-300">
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
