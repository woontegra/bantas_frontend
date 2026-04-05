/**
 * Her ürün kategorisinin eski sitedeki gerçek verileri + renk teması.
 * Admin panelinden content girilene kadar bu veriler gösterilir.
 */

export interface SpecTable {
  label: string;
  columns: string[];
  rows: string[][];
}

export interface ProductFeature {
  icon: "shield" | "check" | "sparkles" | "droplet" | "flame" | "cog" | "zap" | "leaf";
  title: string;
  desc: string;
  bgGradient: string;
  borderColor: string;
  iconColor: string;
}

export interface ColorTheme {
  heroGradient: string;
  heroAccent: string;
  imageBg: string;
  imageIcon: string;
  tableHeader: string;
  tableHover: string;
  ctaGradient: string;
  ctaText: string;
  sidebarHeader: string;
  activeLink: string;
}

export interface ProductStaticData {
  description: string;
  descriptionExtra?: string;
  features: ProductFeature[];
  specTables: SpecTable[];
  theme: ColorTheme;
}

const data: Record<string, ProductStaticData> = {
  "peynir-tenekeleri": {
    description:
      "Peynir ve süt ürünlerinizin tazeliğini uzun süre korumak için özel olarak tasarlanmış tenekelerimiz, gıda güvenliği standartlarına uygun üretilmektedir.",
    descriptionExtra:
      "İçerisinde saklanacak ürünün tazeliğini ve kalitesini korumak amacıyla peynir tenekelerimiz, cinsi ve türü ne olursa olsun tüm peynir çeşitleri için uygundur. Farklı boyut kapasitelerinde üretim yaparak, 220 gr'dan 18 kg'a kadar geniş bir ürün yelpazesi sunuyoruz.",
    theme: {
      heroGradient: "from-blue-900 via-blue-800 to-blue-900",
      heroAccent: "text-blue-400",
      imageBg: "from-blue-50 to-indigo-50",
      imageIcon: "text-blue-300",
      tableHeader: "from-blue-600 to-blue-700",
      tableHover: "hover:bg-blue-50",
      ctaGradient: "from-blue-600 to-indigo-700",
      ctaText: "text-blue-100",
      sidebarHeader: "bg-blue-800",
      activeLink: "text-blue-700",
    },
    features: [
      {
        icon: "shield",
        title: "Hijyenik Üretim",
        desc: "Gıda güvenliği standartlarına uygun, hijyenik koşullarda üretilir.",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
      },
      {
        icon: "check",
        title: "Hava Geçirmez Kapak",
        desc: "Özel kapak sistemi ile ürünün tazeliğini uzun süre korur.",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
      },
      {
        icon: "sparkles",
        title: "Özel Tasarım",
        desc: "Markanıza özel baskı ve tasarım seçenekleri mevcuttur.",
        bgGradient: "from-purple-50 to-pink-50",
        borderColor: "border-purple-200",
        iconColor: "text-purple-600",
      },
    ],
    specTables: [
      {
        label: "Yuvarlak Peynir Teneke Kap",
        columns: ["Kapasite", "Çap (mm)", "Yükseklik (mm)"],
        rows: [
          ["250 gr", "99", "55"],
          ["500 gr", "99", "116"],
          ["1 kg", "99", "202-265"],
        ],
      },
      {
        label: "Dikdörtgen Peynir Teneke Kap",
        columns: ["Kapasite", "En (mm)", "Boy (mm)", "Yükseklik (mm)"],
        rows: [
          ["250 gr", "87", "87", "55"],
          ["500 gr", "87", "87", "90"],
          ["1 kg", "87", "156", "90-94"],
          ["2 kg", "87", "156", "164-170"],
          ["2 kg", "158", "156", "91.5-95"],
          ["3 kg", "158", "156", "120-135"],
          ["5 kg", "158", "156", "191-210"],
          ["5 kg", "235", "255", "95-115"],
          ["10 kg", "235", "235", "175-191"],
          ["18 kg", "235", "235", "315-350"],
        ],
      },
    ],
  },

  "yag-tenekeleri": {
    description:
      "Zeytinyağı, sıvı yağ ve benzeri sıvı ürünlerinizin tazeliğini uzun süre korumak için özel olarak tasarlanmış tenekelerimiz, gıda güvenliği standartlarına uygun üretilmektedir.",
    descriptionExtra:
      "Her çeşit sıvı yağ için uygun olan tenekelerimiz 0.5 lt'den 18 lt'ye kadar farklı ebatlarda ve şekillerde üretilmektedir. Teneke gövde kısmı kullanılacaktır.",
    theme: {
      heroGradient: "from-amber-900 via-yellow-800 to-amber-900",
      heroAccent: "text-yellow-400",
      imageBg: "from-amber-50 to-yellow-50",
      imageIcon: "text-amber-300",
      tableHeader: "from-amber-600 to-orange-600",
      tableHover: "hover:bg-amber-50",
      ctaGradient: "from-amber-600 to-orange-700",
      ctaText: "text-yellow-100",
      sidebarHeader: "bg-amber-800",
      activeLink: "text-amber-700",
    },
    features: [
      {
        icon: "shield",
        title: "Sızdırmaz Yapı",
        desc: "Özel conta sistemi ile sıvı yağların sızdırmasız saklanmasını sağlar.",
        bgGradient: "from-amber-50 to-yellow-50",
        borderColor: "border-amber-200",
        iconColor: "text-amber-600",
      },
      {
        icon: "check",
        title: "Gıda Güvenliği",
        desc: "Gıda sınıfı malzeme ve iç yüzey lakı ile güvenli saklama.",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
      },
      {
        icon: "sparkles",
        title: "Çeşitli Boyutlar",
        desc: "0.5 lt'den 18 lt'ye kadar geniş kapasite seçenekleri.",
        bgGradient: "from-orange-50 to-red-50",
        borderColor: "border-orange-200",
        iconColor: "text-orange-600",
      },
    ],
    specTables: [
      {
        label: "Yağ Teneke Kutu Ebatları",
        columns: ["Kapasite", "En (mm)", "Boy (mm)", "Yükseklik (mm)"],
        rows: [
          ["500 ml", "87", "87", "112"],
          ["1 lt", "87", "87", "210"],
          ["2 lt", "87", "87", "195-220"],
          ["3 lt", "87", "138", "164"],
          ["3 lt", "151", "118", "198"],
          ["4 lt", "151", "118", "260"],
          ["5 lt", "151", "118", "312"],
          ["7 lt", "158", "138", "285"],
          ["10 lt", "197", "157", "290"],
          ["18 lt", "225", "225", "305"],
        ],
      },
    ],
  },

  "zeytin-tursu-tenekeleri": {
    description:
      "Ürünlerinizin en kaliteli şekilde ambalajlanması amacıyla üretilen Turşu-Zeytin ve Turşu çeşitleri için kullanılacak tenekelerimiz, salamura ürünlerin uzun süre tazeliğini korumasını sağlar.",
    descriptionExtra:
      "İçerisinde saklanacak ürünün tazeliğini ve kalitesini korumak amacıyla zeytin tenekelerimiz, çeşidi ve türü ne olursa olsun tüm zeytin ve turşu çeşitleri için uygundur. Farklı boyut kapasitelerinde üretim yaparak, 700 gr'dan 18 kg'a kadar geniş bir ürün yelpazesi sunuyoruz.",
    theme: {
      heroGradient: "from-green-900 via-emerald-800 to-green-900",
      heroAccent: "text-green-400",
      imageBg: "from-green-50 to-emerald-50",
      imageIcon: "text-green-300",
      tableHeader: "from-green-600 to-emerald-600",
      tableHover: "hover:bg-green-50",
      ctaGradient: "from-green-600 to-emerald-700",
      ctaText: "text-green-100",
      sidebarHeader: "bg-green-800",
      activeLink: "text-green-700",
    },
    features: [
      {
        icon: "shield",
        title: "Asit Dirençli",
        desc: "Salamura ürünlere karşı özel iç yüzey kaplaması ile asit dirençli.",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
      },
      {
        icon: "check",
        title: "Hijyenik Saklama",
        desc: "Gıda güvenliği standartlarına uygun, hijyenik koşullarda üretilir.",
        bgGradient: "from-teal-50 to-cyan-50",
        borderColor: "border-teal-200",
        iconColor: "text-teal-600",
      },
      {
        icon: "sparkles",
        title: "Geniş Kapasite",
        desc: "700 gr'dan 18 kg'a kadar farklı boyut seçenekleri.",
        bgGradient: "from-lime-50 to-green-50",
        borderColor: "border-lime-200",
        iconColor: "text-lime-600",
      },
    ],
    specTables: [
      {
        label: "Yuvarlak Zeytin / Turşu Teneke Kap",
        columns: ["Kapasite", "Çap (mm)", "Yükseklik (mm)"],
        rows: [
          ["700 gr", "105", "145"],
          ["1 kg", "105", "160"],
          ["1.5 kg", "152", "145"],
          ["1.5 kg", "115", "145"],
          ["2 kg", "152", "160-165"],
          ["3 kg", "145", "155-145"],
        ],
      },
      {
        label: "Dikdörtgen Zeytin / Turşu Teneke Kap",
        columns: ["Kapasite", "En (mm)", "Boy (mm)", "Yükseklik (mm)"],
        rows: [
          ["500 gr", "87", "87", "112"],
          ["700 gr", "87", "87", "160-163"],
          ["750 gr", "87", "135", "160"],
          ["1 kg", "87", "87", "220-225"],
          ["1.5 kg", "87", "138", "175"],
          ["2.5-3 kg", "158", "138", "130-140"],
          ["4 kg", "158", "138", "255-215"],
          ["5 kg", "158", "138", "270"],
          ["9 kg", "197", "157", "225"],
          ["10 kg", "225", "225", "255-305"],
          ["18 kg", "215", "215", "230-260"],
          ["12-15 kg", "225", "225", "320"],
        ],
      },
    ],
  },

  "tiner-antifriz-madeni-yag-tenekeleri": {
    description:
      "Tiner, antifriz, madeni yağ ve benzeri kimyasal ürünlerinizin güvenli bir şekilde saklanması için özel olarak tasarlanmış tenekelerimiz, kimyasal direnç ve güvenlik standartlarına uygun üretilmektedir.",
    descriptionExtra:
      "Tehlikeli maddelerin güvenli saklanması için özel iç yüzey kaplaması ve sızdırmaz kapak sistemi ile donatılmıştır.",
    theme: {
      heroGradient: "from-slate-900 via-gray-800 to-slate-900",
      heroAccent: "text-slate-400",
      imageBg: "from-slate-50 to-gray-50",
      imageIcon: "text-slate-300",
      tableHeader: "from-slate-600 to-gray-700",
      tableHover: "hover:bg-slate-50",
      ctaGradient: "from-slate-600 to-gray-700",
      ctaText: "text-slate-100",
      sidebarHeader: "bg-slate-700",
      activeLink: "text-slate-700",
    },
    features: [
      {
        icon: "shield",
        title: "Kimyasal Direnç",
        desc: "Kimyasal dirençli iç kaplama ile tehlikeli maddelerin güvenli saklanması.",
        bgGradient: "from-slate-50 to-gray-50",
        borderColor: "border-slate-200",
        iconColor: "text-slate-600",
      },
      {
        icon: "check",
        title: "Sızdırmaz Kapak",
        desc: "Özel conta sistemi ile sıvı kimyasalların sızdırmasız saklanması.",
        bgGradient: "from-red-50 to-orange-50",
        borderColor: "border-red-200",
        iconColor: "text-red-600",
      },
      {
        icon: "sparkles",
        title: "UN Standartları",
        desc: "Uluslararası taşımacılık standartlarına uygun üretim.",
        bgGradient: "from-indigo-50 to-blue-50",
        borderColor: "border-indigo-200",
        iconColor: "text-indigo-600",
      },
    ],
    specTables: [
      {
        label: "Tiner / Antifriz / Madeni Yağ Teneke Ebatları",
        columns: ["Kapasite", "En (mm)", "Boy (mm)", "Yükseklik (mm)"],
        rows: [
          ["0.5 Lt", "157", "118", "220"],
          ["1 Lt", "157", "118", "260"],
          ["2 Lt", "157", "118", "312"],
          ["3 Lt", "158", "138", "285"],
          ["4 Lt", "197", "157", "225"],
          ["5 Lt", "197", "157", "270"],
          ["10 Lt", "225", "225", "255"],
          ["18 Lt", "225", "225", "350"],
          ["20 Lt", "225", "225", "390"],
        ],
      },
    ],
  },
};

const defaultTheme: ColorTheme = {
  heroGradient: "from-blue-900 via-blue-800 to-blue-900",
  heroAccent: "text-blue-400",
  imageBg: "from-blue-50 to-indigo-50",
  imageIcon: "text-blue-300",
  tableHeader: "from-blue-600 to-blue-700",
  tableHover: "hover:bg-blue-50",
  ctaGradient: "from-blue-600 to-indigo-700",
  ctaText: "text-blue-100",
  sidebarHeader: "bg-blue-800",
  activeLink: "text-blue-700",
};

export function getProductStaticData(
  slug: string,
): ProductStaticData | undefined {
  return data[slug];
}

export function getProductTheme(slug: string): ColorTheme {
  return data[slug]?.theme ?? defaultTheme;
}
