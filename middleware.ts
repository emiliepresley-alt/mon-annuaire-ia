import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});

export const config = {
  // Matcher qui ignore les fichiers API, Next.js, Vercel et les fichiers avec extension (ex: robots.txt, sitemap.xml, favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};