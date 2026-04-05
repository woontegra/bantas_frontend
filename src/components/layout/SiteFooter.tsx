import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FooterLink   { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }
interface FooterData {
  address:   string;
  email:     string;
  phone:     string;
  columns:   FooterColumn[];
  copyright: string;
}

async function getFooterData(): Promise<FooterData | null> {
  try {
    const res = await fetch(`${API_URL}/api/content-pages/footer-settings`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const page = json.data || json;
    if (!page?.sections) return null;
    const parsed: FooterData = JSON.parse(page.sections);
    if (!parsed?.columns?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function SiteFooter() {
  const tf = await getTranslations("home.footer");
  const tb = await getTranslations("home.topBar");

  const api = await getFooterData();
  const colClass = "space-y-3 text-sm text-slate-300";

  // Use API data if available, otherwise fallback to translations
  const address   = api?.address   ?? tf("addressLine1");
  const email     = api?.email     ?? tb("email");
  const phone     = api?.phone     ?? tb("phone");
  const copyright = api?.copyright ?? "Bantaş A.Ş.";

  // Default columns (translation-based)
  const defaultColumns: FooterColumn[] = [
    {
      title: tf("kurumsalTitle"),
      links: [
        { label: tf("linkAbout"),   href: "/hakkimizda"          },
        { label: tf("linkHistory"), href: "/tarihce"             },
        { label: tf("linkTech"),    href: "/teknoloji"           },
        { label: tf("linkCerts"),   href: "/kalite-belgelerimiz" },
      ],
    },
    {
      title: tf("investorTitle"),
      links: [
        { label: tf("linkBilgi"),    href: "/bilgi-toplumu-hizmetleri" },
        { label: tf("linkBoard"),    href: "/yonetim-kurulu"           },
        { label: tf("linkPolicies"), href: "/politikalar"              },
        { label: tf("linkGK"),       href: "/genel-kurul"              },
      ],
    },
    {
      title: tf("menuTitle"),
      links: [
        { label: tf("linkAbout"),      href: "/hakkimizda" },
        { label: tf("linkGallery"),    href: "/galeri"      },
        { label: tf("linkContact"),    href: "/iletisim"    },
        { label: tf("linkNewsletter"), href: "/e-bulten"    },
      ],
    },
  ];

  const columns = api?.columns ?? defaultColumns;

  return (
    <footer className="bg-[#0f1028] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info column */}
          <div className={colClass}>
            <div className="mb-4 flex items-baseline gap-0 font-bold">
              <span className="text-xl text-accent-red">BAN</span>
              <span className="text-xl text-white">TAŞ</span>
            </div>
            <p>{address}</p>
            <a href={`mailto:${email}`} className="block break-all hover:text-white">
              {email}
            </a>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="block break-all hover:text-white">
              {phone}
            </a>
          </div>

          {/* Dynamic columns */}
          {columns.map((col, ci) => (
            <div key={ci} className={colClass}>
              <p className="font-semibold text-white">{col.title}</p>
              {col.links.map((link, li) => (
                link.href.startsWith("http") ? (
                  <a key={li} href={link.href} target="_blank" rel="noopener noreferrer" className="block hover:text-white">
                    {link.label}
                  </a>
                ) : (
                  <Link key={li} href={link.href as never} className="block hover:text-white">
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {copyright}
        </p>
      </div>
    </footer>
  );
}
