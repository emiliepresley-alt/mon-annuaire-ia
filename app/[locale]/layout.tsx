import { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import '../globals.css';
import Script from 'next/script';
export const viewport: Viewport = {
  themeColor: '#0b0c10',
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Header' });
  const baseUrl = 'https://www.aifreedirectory.com';

  return {
    metadataBase: new URL(baseUrl),
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${baseUrl}/${locale}`,
      siteName: 'AI Free Directory',
      images: [
        {
          url: `${baseUrl}/opengraph-image`, 
          width: 1200,
          height: 630,
          alt: 'AI Free Directory',
        },
      ],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('subtitle'),
      images: [`${baseUrl}/opengraph-image`],
    },
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-[#0b0c10] text-white">
	  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-P6DZ2WT3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
		
		<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0451071798143683"
  crossOrigin="anonymous"
></script>
      </body>
    </html>
  );
}