"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, ImageIcon, Package, Info, Star, Newspaper, LogOut,
  Menu, ChevronRight, ChevronDown, Mail, Settings, Layers, FileStack,
  GalleryHorizontal, Phone, CreditCard, Clock, Cpu, Award, Users,
  Heart, FileText, Calendar, FileBarChart2, TrendingUp, Building2,
  BarChart3, BookOpen, Home, LayoutTemplate,
} from "lucide-react";
import { verifyToken, removeToken } from "@/lib/adminApi";

// ── Types ──────────────────────────────────────────────────────────────────
type NavItem  = { href: string; label: string; icon: LucideIcon; exact?: boolean; };
type NavGroup = {
  heading: string | null;
  icon?:   LucideIcon;
  collapsible?: boolean;
  items:   NavItem[];
};

// ── Navigation structure ───────────────────────────────────────────────────
const navGroups: NavGroup[] = [
  {
    heading: null,
    items: [
      { href: "/admin",          label: "Dashboard",   icon: LayoutDashboard, exact: true },
      { href: "/admin/hero",     label: "Hero Slider", icon: Layers         },
      { href: "/admin/anasayfa", label: "Ana Sayfa",   icon: Home           },
      { href: "/admin/footer",   label: "Footer",      icon: LayoutTemplate },
    ],
  },
  {
    heading: "Ürünler",
    icon: Package,
    collapsible: true,
    items: [
      { href: "/admin/products",      label: "Ana sayfa kartları",   icon: Package    },
      { href: "/admin/product-pages", label: "Menü & alt sayfalar",  icon: FileStack  },
      { href: "/admin/before-after",  label: "Before / After",       icon: ImageIcon  },
      { href: "/admin/advantages",    label: "Avantajlar",           icon: Star       },
    ],
  },
  {
    heading: "Kurumsal",
    icon: Building2,
    collapsible: true,
    items: [
      { href: "/admin/about",              label: "Hakkımızda",         icon: Info    },
      { href: "/admin/tarihce",            label: "Tarihçe",            icon: Clock   },
      { href: "/admin/teknoloji",          label: "Teknoloji",          icon: Cpu     },
      { href: "/admin/kalite-belgelerimiz",label: "Kalite Belgeleri",   icon: Award   },
      { href: "/admin/insan-kaynaklari",   label: "İnsan Kaynakları",   icon: Users   },
      { href: "/admin/sosyal-sorumluluk",  label: "Sosyal Sorumluluk",  icon: Heart   },
      { href: "/admin/pdf-pages",          label: "PDF Sayfaları",      icon: FileText},
    ],
  },
  {
    heading: "Kurumsal Yönetim",
    icon: Building2,
    collapsible: true,
    items: [
      { href: "/admin/ticaret-sicil-bilgileri", label: "Ticaret Sicil",   icon: FileText },
      { href: "/admin/yonetim-kurulu",         label: "Yönetim Kurulu", icon: Users    },
      { href: "/admin/komiteler",              label: "Komiteler",      icon: Users    },
      { href: "/admin/ortaklik-yapisi",        label: "Ortaklık Yapısı",icon: Users    },
      { href: "/admin/politikalar",            label: "Politikalar",    icon: FileText },
    ],
  },
  {
    heading: "Yatırımcı İlişkileri",
    icon: TrendingUp,
    collapsible: true,
    items: [
      { href: "/admin/genel-kurul",       label: "Genel Kurul",        icon: Calendar       },
      { href: "/admin/faaliyet-raporlari",label: "Faaliyet Raporları",  icon: FileBarChart2  },
      { href: "/admin/imtiyazli-paylar",  label: "İmtiyazlı Paylar",   icon: BarChart3      },
    ],
  },
  {
    heading: "İçerik & Medya",
    icon: BookOpen,
    collapsible: true,
    items: [
      { href: "/admin/news",    label: "Haberler", icon: Newspaper        },
      { href: "/admin/gallery", label: "Galeri",   icon: GalleryHorizontal},
    ],
  },
  {
    heading: "Sistem",
    icon: Settings,
    collapsible: true,
    items: [
      { href: "/admin/contact",  label: "İletişim", icon: Phone      },
      { href: "/admin/messages", label: "Mesajlar", icon: Mail       },
      { href: "/admin/epayment", label: "E-Ödeme",  icon: CreditCard },
      { href: "/admin/settings", label: "Ayarlar",  icon: Settings   },
    ],
  },
];

// ── AdminShell ─────────────────────────────────────────────────────────────
export function AdminShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user,        setUser]        = useState<{ name: string; email: string } | null>(null);
  const [ready,       setReady]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Compute which groups are open by default (those that contain the active route)
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    navGroups.forEach((g, gi) => {
      if (g.collapsible) {
        init[gi] = g.items.some(item =>
          item.exact ? pathname === item.href : pathname.startsWith(item.href)
        );
      }
    });
    return init;
  });

  useEffect(() => {
    let cancelled = false;
    const timeoutMs = 8000;
    const deadline = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("verify-timeout")), timeoutMs);
    });
    Promise.race([verifyToken(), deadline])
      .then((res) => { if (cancelled) return; setUser(res.user); setReady(true); })
      .catch(() => {
        if (cancelled) return;
        removeToken(); setReady(true);
        router.replace("/admin/login");
      });
    return () => { cancelled = true; };
  }, [router]);

  function handleLogout() { removeToken(); router.push("/admin/login"); }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  function toggleGroup(gi: number) {
    setOpenGroups(prev => ({ ...prev, [gi]: !prev[gi] }));
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-center text-sm text-slate-600">
          Oturum geçersiz veya süresi doldu. Giriş sayfasına yönlendiriliyorsunuz…
        </p>
        <Link href="/admin/login" className="text-sm font-semibold text-brand underline underline-offset-4">
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  // ── Sidebar component ────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="flex h-full w-[min(100vw,16rem)] max-w-[85vw] flex-col bg-[#0f1028] text-white sm:w-64 sm:max-w-none">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
        <span className="text-lg font-bold">
          <span className="text-red-400">BAN</span>TAŞ
        </span>
        <span className="ml-2 rounded-md bg-brand/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-1">
          {navGroups.map((group, gi) => {
            const isOpen = !group.collapsible || openGroups[gi];
            const GroupIcon = group.icon;
            const anyActive = group.items.some(item => isActive(item.href, item.exact));

            return (
              <div key={gi} className={group.heading ? "mt-1" : ""}>
                {/* Group heading / toggle */}
                {group.heading ? (
                  <button
                    onClick={() => toggleGroup(gi)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition ${
                      anyActive
                        ? "text-brand-muted"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {GroupIcon && <GroupIcon className="h-3.5 w-3.5 shrink-0" />}
                    <span className="flex-1">{group.heading}</span>
                    {isOpen
                      ? <ChevronDown className="h-3 w-3 shrink-0" />
                      : <ChevronRight className="h-3 w-3 shrink-0" />}
                  </button>
                ) : null}

                {/* Items */}
                {isOpen && (
                  <ul className={`space-y-0.5 ${group.heading ? "ml-1 mt-0.5 border-l border-white/5 pl-2" : ""}`}>
                    {group.items.map(({ href, label, icon: Icon, exact }) => {
                      const active = isActive(href, exact);
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex min-h-[38px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                              active
                                ? "bg-brand text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 flex-1 leading-snug">{label}</span>
                            {active && <ChevronRight className="h-3 w-3 shrink-0 text-white/60" />}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 truncate text-xs text-slate-400">{user?.email}</div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 lg:flex lg:flex-col">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <button
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex flex-col lg:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{user?.name}</span>
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Siteyi Gör →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
