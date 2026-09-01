import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://avtomuto.com.ua',
  trailingSlash: 'never',
  adapter: vercel(),
  integrations: [sitemap()],
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
