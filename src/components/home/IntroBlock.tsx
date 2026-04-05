import { getTranslations } from "next-intl/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AnasayfaData {
  introTitle?:     string;
  introHighlight?: string;
  introBody?:      string;
}

async function getAnasayfaData(): Promise<AnasayfaData> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/anasayfa-settings`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return {};
    return JSON.parse(page.sections) as AnasayfaData;
  } catch {
    return {};
  }
}

export async function IntroBlock() {
  const t   = await getTranslations("home.intro");
  const api = await getAnasayfaData();

  const title     = api.introTitle     || t("title");
  const highlight = api.introHighlight || t("titleHighlight");
  const body      = api.introBody      || t("body");

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
          {title}{" "}
          <span className="border-b-4 border-brand pb-0.5 text-brand">
            {highlight}
          </span>
        </h2>
        <p className="mt-6 text-base leading-relaxed text-slate-600">{body}</p>
      </div>
    </section>
  );
}
