import { getTranslations } from "next-intl/server";

export async function BeforeAfterSection() {
  const t = await getTranslations("home.beforeAfter");

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-bold text-brand md:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-8">
          <figure className="overflow-hidden rounded-2xl ring-1 ring-slate-200/80">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
              <span className="text-lg font-semibold text-white/90 drop-shadow">
                {t("before")}
              </span>
            </div>
            <figcaption className="bg-white px-4 py-3 text-center text-sm text-slate-600">
              {t("beforeCaption")}
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl ring-1 ring-slate-200/80">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand to-brand-muted">
              <span className="text-lg font-semibold text-white drop-shadow">
                {t("after")}
              </span>
            </div>
            <figcaption className="bg-white px-4 py-3 text-center text-sm text-slate-600">
              {t("afterCaption")}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
