import { getTranslations } from "next-intl/server";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { getBeforeAfter, mediaUrl } from "@/lib/api";

const FALLBACK_BEFORE = "/images/tin-before.svg";
/** public’te tin-after.png yoktu; slider’ın kırılmasını önlemek için geçerli bir görsel */
const FALLBACK_AFTER =
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80";

export async function QualitySection({ locale }: { locale: string }) {
  const t = await getTranslations("home.qualitySection");
  const isEn = locale === "en";

  const items = await getBeforeAfter().catch(() => []);
  const item = items[0] ?? null;

  const beforeSrc = item?.beforeImage ? mediaUrl(item.beforeImage) : FALLBACK_BEFORE;
  const afterSrc = item?.afterImage ? mediaUrl(item.afterImage) : FALLBACK_AFTER;
  const title = item ? (isEn ? (item.titleEn ?? item.title) : item.title) : t("title");
  const body = item ? (isEn ? (item.descriptionEn ?? item.description) : item.description) : t("body");

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-14">
        <BeforeAfterSlider
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeAlt={t("beforeLabel")}
          afterAlt={t("afterLabel")}
          dragHint={t("dragHint")}
        />

        <div>
          <h2 className="text-2xl font-bold leading-tight text-brand md:text-3xl">
            {title}
          </h2>
          {body && (
            <p className="mt-5 text-base leading-relaxed text-slate-600">{body}</p>
          )}
        </div>
      </div>
    </section>
  );
}
