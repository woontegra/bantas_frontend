"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import type { CorporateNavItem } from "./KurumsalNavDropdown";

type FlatLink = { href: string; label: string };

export function SiteMobileNav({
  homeLabel,
  corporateLabel,
  productsLabel,
  productsOverviewLabel,
  corporateItems,
  productItems,
  links,
  ePaymentUrl,
  ePaymentLabel,
}: {
  homeLabel: string;
  corporateLabel: string;
  productsLabel: string;
  productsOverviewLabel: string;
  corporateItems: CorporateNavItem[];
  productItems: FlatLink[];
  links: FlatLink[];
  ePaymentUrl?: string;
  ePaymentLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Backdrop'ın açılış anında ghost-click ile kapanmasını engelle
  const justOpenedRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) { setCorpOpen(false); setProdOpen(false); }
  }, [open]);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function openMenu() {
    justOpenedRef.current = true;
    setOpen(true);
    setTimeout(() => { justOpenedRef.current = false; }, 400);
  }

  function close() {
    if (justOpenedRef.current) return;
    setOpen(false);
  }

  const linkClass =
    "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100 hover:text-brand";
  const subLinkClass =
    "block rounded-md py-2 pl-3 pr-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-brand";

  const overlay = open ? (
    <>
      {/* Backdrop — body'ye mount edildi: header'ın stacking context'inden bağımsız */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
        aria-hidden="true"
        onClick={close}
      />

      {/* Menü paneli */}
      <div
        id="site-mobile-nav"
        className="fixed inset-y-0 right-0 flex w-[min(100vw,20rem)] max-w-full flex-col border-l border-slate-200 bg-white shadow-2xl"
        style={{ zIndex: 9999 }}
        role="dialog"
        aria-modal="true"
        aria-label="Site menüsü"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-sm font-bold text-brand-dark">Menü</span>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
          <Link href="/" className={linkClass} onClick={() => setOpen(false)}>
            {homeLabel}
          </Link>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
            aria-expanded={corpOpen}
            onClick={() => setCorpOpen((v) => !v)}
          >
            {corporateLabel}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${corpOpen ? "rotate-180" : ""}`}
            />
          </button>
          {corpOpen && (
            <div className="mb-2 ml-1 space-y-1 border-l-2 border-brand/25 pl-3">
              {corporateItems.map((item) => (
                <div key={item.href}>
                  <Link href={item.href} className={subLinkClass} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <div className="ml-2 border-l border-slate-200 pl-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`${subLinkClass} text-xs leading-snug`}
                          onClick={() => setOpen(false)}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-800 hover:bg-slate-100"
            aria-expanded={prodOpen}
            onClick={() => setProdOpen((v) => !v)}
          >
            {productsLabel}
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform ${prodOpen ? "rotate-180" : ""}`}
            />
          </button>
          {prodOpen && (
            <div className="mb-2 ml-1 space-y-0.5 border-l-2 border-brand/25 pl-3">
              <Link href="/urunler" className={subLinkClass} onClick={() => setOpen(false)}>
                {productsOverviewLabel}
              </Link>
              {productItems.map((p) => (
                <Link key={p.href} href={p.href} className={subLinkClass} onClick={() => setOpen(false)}>
                  {p.label}
                </Link>
              ))}
            </div>
          )}

          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {ePaymentUrl && ePaymentLabel && (
            <a
              href={ePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {ePaymentLabel}
            </a>
          )}
        </nav>
      </div>
    </>
  ) : null;

  return (
    <div className="flex items-center lg:hidden">
      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100"
        aria-expanded={open}
        aria-controls="site-mobile-nav"
        aria-label="Menüyü aç"
        onClick={openMenu}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Portal: overlay'i doğrudan body'ye bağlıyoruz — header'ın z-index kısıtından kaçınmak için */}
      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </div>
  );
}
