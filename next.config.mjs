import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ajout pour éviter les conflits avec Turbopack (recommandé)
  experimental: {
    turbo: {},
  },
};

export default withNextIntl(nextConfig);