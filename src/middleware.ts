import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(tr|en|de|fr|ru|ar)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
