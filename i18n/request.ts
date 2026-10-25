import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // Si aucune locale n'est trouvée, on utilise 'fr' par défaut
  if (!locale || !['fr', 'en'].includes(locale)) {
    locale = 'fr';
  }

  return {
    locale, // <-- Il faut retourner la locale
    messages: (await import(`../messages/${locale}.json`)).default
  };
});