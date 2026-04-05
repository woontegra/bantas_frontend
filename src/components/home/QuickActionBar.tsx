import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AnasayfaData {
  quoteTitle?:   string;
  quoteDesc?:    string;
  quoteUrl?:     string;
  kvkkText?:     string;
  catalogTitle?: string;
  catalogDesc?:  string;
  catalogUrl?:   string;
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

export async function QuickActionBar() {
  const t   = await getTranslations("home.quickActions");
  const api = await getAnasayfaData();

  const quoteTitle   = api.quoteTitle   || t("quoteTitle");
  const quoteDesc    = api.quoteDesc    || t("quoteDesc");
  const quoteUrl     = api.quoteUrl     || "/iletisim";
  const kvkkText     = api.kvkkText     || t("kvkk");
  const catalogTitle = api.catalogTitle || t("catalogTitle");
  const catalogDesc  = api.catalogDesc  || t("catalogDesc");
  const catalogUrl   = api.catalogUrl   || "/katalog";

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 md:grid-cols-3">
        <div className="bg-white p-6 text-center md:text-left">
          <Link
            href={quoteUrl as never}
            className="inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-muted"
          >
            {quoteTitle}
          </Link>
          <p className="mt-3 text-sm text-slate-600">{quoteDesc}</p>
        </div>

        <div className="flex items-center bg-brand-dark px-6 py-6 text-center md:px-8">
          <p className="text-sm leading-relaxed text-white/95 md:text-left">{kvkkText}</p>
        </div>

        <div className="bg-white p-6 text-center md:flex md:flex-col md:items-end md:text-right">
          <Link
            href={catalogUrl as never}
            className="inline-block rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-muted"
          >
            {catalogTitle}
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-600 md:max-w-xs">{catalogDesc}</p>
        </div>
      </div>
    </section>
  );
}
