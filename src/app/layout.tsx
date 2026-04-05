import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: { default: "Bantaş", template: "%s | Bantaş" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Tek kök <html>/<body> — admin ve [locale] alt layout’ları buranın içine oturur.
 * (İki ayrı kök layout Next.js’te takılma / garip RSC davranışına yol açabiliyor.)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen font-sans antialiased text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
