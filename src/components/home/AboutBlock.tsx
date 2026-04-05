import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAbout, mediaUrl } from "@/lib/api";
import { shouldUnoptimizeRemoteImage } from "@/lib/nextImagePolicy";

const FALLBACK = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d002dc585148?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
];

export async function AboutBlock({ locale }: { locale: string }) {
  const t = await getTranslations("home.about");
  const isEn = locale === "en";

  const sections = await getAbout();
  const about = sections[0] ?? null;

  const title = about ? (isEn ? (about.titleEn ?? about.title) : about.title) : t("title");
  const content = about ? (isEn ? (about.contentEn ?? about.content) : about.content) : null;

  const imgs = [
    about?.image1 ? mediaUrl(about.image1) : FALLBACK[0],
    about?.image2 ? mediaUrl(about.image2) : FALLBACK[1],
    about?.image3 ? mediaUrl(about.image3) : FALLBACK[2],
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-brand md:text-4xl">{title}</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 md:text-base">
            {content ? (
              <p>{content}</p>
            ) : (
              <>
                <p>{t("p1")}</p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
              </>
            )}
          </div>
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-lg lg:h-[400px]">
          <div className="absolute left-0 top-0 h-[55%] w-[58%] overflow-hidden rounded-xl shadow-lg ring-2 ring-white">
            <Image src={imgs[0]} alt="" fill className="object-cover" sizes="300px" unoptimized={shouldUnoptimizeRemoteImage(imgs[0])} />
          </div>
          <div className="absolute bottom-0 right-0 h-[52%] w-[55%] overflow-hidden rounded-xl shadow-lg ring-2 ring-white">
            <Image src={imgs[1]} alt="" fill className="object-cover" sizes="300px" unoptimized={shouldUnoptimizeRemoteImage(imgs[1])} />
          </div>
          <div className="absolute left-[28%] top-[32%] z-10 h-[38%] w-[42%] overflow-hidden rounded-xl shadow-xl ring-2 ring-white">
            <Image src={imgs[2]} alt="" fill className="object-cover" sizes="250px" unoptimized={shouldUnoptimizeRemoteImage(imgs[2])} />
          </div>
        </div>
      </div>
    </section>
  );
}
