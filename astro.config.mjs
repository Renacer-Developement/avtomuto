import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.avtomuto.com.ua',
  trailingSlash: 'never',
  adapter: vercel({
    isr: {
      expiration: 60,
    },
  }),
  integrations: [
    sitemap({
      // Сторінки авто рендеряться на запит (Hygraph), тому живуть в окремому динамічному
      // sitemap-cars.xml — посилаємось на нього з індексу, щоб Google точно його знайшов.
      customSitemaps: ['https://www.avtomuto.com.ua/sitemap-cars.xml'],
    }),
  ],
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
