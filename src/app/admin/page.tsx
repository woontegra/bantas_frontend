"use client";

import { AdminShell } from "./_components/AdminShell";
import Link from "next/link";
import {
  Layers,
  Package,
  ImageIcon,
  Star,
  Info,
  Newspaper,
  Mail,
  Settings,
  ArrowRight,
} from "lucide-react";

const sections = [
  { href: "/admin/hero", icon: Layers, label: "Hero Slider", desc: "Ana sayfa slider görsellerini yönet" },
  { href: "/admin/products", icon: Package, label: "Ürün Kategorileri", desc: "Ana sayfadaki ürün kartlarını düzenle" },
  { href: "/admin/before-after", icon: ImageIcon, label: "Before / After", desc: "Teneke baskı karşılaştırma görsellerini yönet" },
  { href: "/admin/advantages", icon: Star, label: "Avantajlar", desc: "Özellik ve avantaj bloklarını düzenle" },
  { href: "/admin/about", icon: Info, label: "Hakkımızda", desc: "Şirket tanıtım metni ve görselleri" },
  { href: "/admin/news", icon: Newspaper, label: "Haberler", desc: "Haber ve duyuruları yönet" },
  { href: "/admin/messages", icon: Mail, label: "Mesajlar", desc: "İletişim formundan gelen mesajlar" },
  { href: "/admin/settings", icon: Settings, label: "Site Ayarları", desc: "Logo, telefon, e-posta vb." },
];

export default function AdminDashboard() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Yönetmek istediğiniz bölümü seçin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800">{label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
