"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "@/navigation";

export type CorporateNavItem = {
  href: string;
  label: string;
  children?: CorporateNavItem[];
};

/** Ana liste ve Politikalarımız flyout aynı cam panel stili */
const menuPanelClass =
  "rounded-2xl border border-slate-200/80 bg-white/85 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.2)] ring-1 ring-slate-900/[0.06] backdrop-blur-xl backdrop-saturate-150";

const menuLinkClass =
  "block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-gradient-to-r hover:from-white/60 hover:to-transparent hover:text-brand";

export function KurumsalNavDropdown({
  triggerLabel,
  items,
}: {
  triggerLabel: string;
  items: CorporateNavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [policyFlyout, setPolicyFlyout] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setPolicyFlyout(false);
  }, [open]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div
      ref={rootRef}
      data-kurumsal-dropdown=""
      className="relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-0.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-brand"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {triggerLabel}
        <ChevronDown
          className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {/* Akışta köprü: fare butondan menüye inerken mouseleave tetiklenmesin */}
      <div
        className={`relative z-[80] ${open ? "block" : "hidden"}`}
        aria-hidden={!open}
      >
        <div className="h-1.5 w-full shrink-0" />
        <div className="absolute left-0 top-0 min-w-[min(100vw-2rem,240px)] max-w-[calc(100vw-2rem)] pt-0 lg:left-1/2 lg:-translate-x-1/2">
          {/* overflow-visible: sağa açılan Politikalarımız flyout kesilmesin */}
          <div className={`overflow-visible py-2 ${menuPanelClass}`}>
            <ul className="overflow-visible py-0.5">
              {items.map((item) =>
                item.children?.length ? (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setPolicyFlyout(true)}
                    onMouseLeave={() => setPolicyFlyout(false)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-gradient-to-r hover:from-white/60 hover:to-transparent hover:text-brand ${
                        policyFlyout ? "bg-white/50 text-brand" : ""
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                          policyFlyout ? "translate-x-0.5 text-brand" : ""
                        }`}
                        aria-hidden
                      />
                    </Link>
                    {/* Sağa flyout: görseldeki isimler referanstı; stil ana menü ile uyumlu, zarif */}
                    <div
                      className={`absolute z-[100] max-lg:left-2 max-lg:right-2 max-lg:top-full max-lg:mt-1 max-lg:pl-0 lg:left-full lg:top-0 lg:pl-2 lg:-ml-1 ${
                        policyFlyout
                          ? "pointer-events-auto translate-x-0 translate-y-0 opacity-100"
                          : "pointer-events-none opacity-0 lg:-translate-x-1.5 max-lg:translate-y-1"
                      } transition-all duration-200 ease-out`}
                      role="presentation"
                    >
                      <div
                        className={`max-h-[min(72vh,440px)] overflow-y-auto py-2 lg:min-w-[17.5rem] lg:max-w-[min(100vw-2rem,20rem)] ${menuPanelClass}`}
                      >
                        <ul className="py-0.5">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`${menuLinkClass} py-3 text-[13px] leading-snug`}
                                onClick={() => setOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={menuLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
