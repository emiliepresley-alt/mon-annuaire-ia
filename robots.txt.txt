import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.aifreedirectory.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/fr/admin', 
        '/en/admin',
        '/fr/login',
        '/en/login',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}