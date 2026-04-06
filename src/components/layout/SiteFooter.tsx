import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { MapPin, Mail, Phone } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function resolveUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

interface FooterLink   { label: string; href: string; }
interface FooterColumn { title: string; links: FooterLink[]; }
interface FooterData {
  address:   string;
  email:     string;
  phone:     string;
  logo?:     string;
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
  const logo      = resolveUrl(api?.logo);

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
            {/* Logo veya metin */}
            <div className="mb-5">
              {logo ? (
                <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex items-baseline gap-0 font-bold">
                  <span className="text-xl text-accent-red">BAN</span>
                  <span className="text-xl text-white">TAŞ</span>
                </div>
              )}
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>{address}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              <a href={`mailto:${email}`} className="break-all hover:text-white">
                {email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                {phone}
              </a>
            </div>
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

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {copyright}</p>
          <a
            href="https://woontegra.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Woontegra Teknoloji Yazılım ve Dijital Hizmetler
          </a>
        </div>
      </div>
    </footer>
  );
}
