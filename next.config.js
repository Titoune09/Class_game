/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimisations pour Vercel
  poweredByHeader: false,
  
  // Configuration TypeScript
  typescript: {
    // !! ATTENTION !!
    // Dangereusement autoriser les builds même avec des erreurs TypeScript
    // Retirer en production si vous voulez une stricte vérification
    ignoreBuildErrors: false,
  },
  
  // Configuration ESLint
  eslint: {
    // Autoriser la production même avec des warnings
    ignoreDuringBuilds: false,
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
