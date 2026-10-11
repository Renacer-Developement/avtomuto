import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.avtomuto.com.ua',
  trailingSlash: 'never',
  adapter: vercel({
    isr: {
      expiration: 60,
    },
  }),
  // Sitemap-и генеруються на запит у src/pages/sitemap-*.xml.ts. Старий sitemap-0.xml
  // від @astrojs/sitemap міг лишитись у Search Console — ведемо його на новий.
  redirects: {
    '/sitemap-0.xml': '/sitemap-pages.xml',
  },
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
  },
  devToolbar: {
    enabled: false,
  },
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '*.graphassets.com' }],
  },
});
