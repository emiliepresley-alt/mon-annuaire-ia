import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.aifreedirectory.com';
  
  // 1. Les pages statiques (Accueil, Tous les outils, Login)
  const staticRoutes = [
    '',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}/fr${route}`, // On génère pour le français
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
    alternates: {
      languages: {
        fr: `${baseUrl}/fr${route}`,
        en: `${baseUrl}/en${route}`,
      },
    },
  }));

  // 2. Les catégories (on les a en dur dans le code)
  const categories = ['texte', 'image', 'video', 'audio', 'design', 'code', 'marketing', 'support', 'productivite', 'finance', 'education', 'llm', 'prompt', 'data', 'agents'];
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/fr/categorie/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        fr: `${baseUrl}/fr/categorie/${cat}`,
        en: `${baseUrl}/en/categorie/${cat}`,
      },
    },
  }));

  // 3. Les Tags (on les a aussi en dur)
  const tags = ["chatbot", "copywriting", "translation", "summary", "text-to-image", "text-to-video", "text-to-speech", "avatar", "video-editing", "photo-editing", "code-generation", "sql", "api", "automation", "productivity", "ui-ux", "seo", "search", "open-source"];
  const tagRoutes = tags.map((tag) => ({
    url: `${baseUrl}/fr/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    alternates: {
      languages: {
        fr: `${baseUrl}/fr/tag/${tag}`,
        en: `${baseUrl}/en/tag/${tag}`,
      },
    },
  }));

  // 4. Récupérer tous les outils approuvés depuis Supabase (pour le futur)
  // (Pour l'instant, on n'a pas de page /outil/[slug], donc on ne les met pas encore. 
  // On le fera quand on créera la page détail de chaque outil).

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes];
}