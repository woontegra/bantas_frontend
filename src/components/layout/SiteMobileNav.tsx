"use client";

import { useEffect, useRef, useState } from "react";
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
  /** /urunler özet sayfası (örn. "Tüm ürünler") */
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
  // Ghost-click guard: mobilde dokunuş 300ms sonra tekrar "click" ateşlediği için
  // menü açılır açılmaz backdrop'a düşüp kapanmasın diye kısa süre engelliyoruz.
  const justOpenedRef = useRef(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setCorpOpen(false);
      setProdOpen(false);
    }
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

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
            aria-label="Menüyü kapat"
            onClick={close}
          />
          <div
            id="site-mobile-nav"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw,20rem)] max-w-full flex-col border-l border-slate-200 bg-white shadow-2xl"
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
                onClick={close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
              <Link href="/" className={linkClass} onClick={close}>
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
                      <Link href={item.href} className={subLinkClass} onClick={close}>
                        {item.label}
                      </Link>
                      {item.children?.length ? (
                        <div className="ml-2 border-l border-slate-200 pl-2">
                          {item.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              className={`${subLinkClass} text-xs leading-snug`}
                              onClick={close}
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
                  <Link href="/urunler" className={subLinkClass} onClick={close}>
                    {productsOverviewLabel}
                  </Link>
                  {productItems.map((p) => (
                    <Link key={p.href} href={p.href} className={subLinkClass} onClick={close}>
                      {p.label}
                    </Link>
                  ))}
                </div>
              )}

              {links.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass} onClick={close}>
                  {l.label}
                </Link>
              ))}
              {ePaymentUrl && ePaymentLabel && (
                <a
                  href={ePaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  onClick={close}
                >
                  {ePaymentLabel}
                </a>
              )}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}
