import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr'
});

export const config = {
  // Regarde bien cette ligne : elle doit contenir sitemap.xml et robots.txt
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)'
  ]
};