import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { getCarListings, brandSlug } from '../lib/cars';

// @astrojs/sitemap бачить лише пререндерені сторінки, а сторінки авто й марок рендеряться
// на запит (дані з Hygraph) — тому для них окремий живий sitemap. Оновлюється разом з ISR,
// тож нове авто з CMS потрапляє сюди без деплою. Підключений у public/robots.txt.
export const prerender = false;

export const GET: APIRoute = async () => {
  // Продані авто не віддаємо в sitemap: сторінка лишається доступною, але краулінг
  // краще витрачати на авто, які реально можна купити.
  const cars = (await getCarListings()).filter((c) => c.status !== 'sold');
  const brands = [...new Set(cars.map((c) => brandSlug(c.name)).filter(Boolean))];

  const urls = [
    ...cars.map((c) => `/poslugy/prodaz-auto/${c.slug}`),
    ...brands.map((b) => `/poslugy/prodaz-auto/marka/${b}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.domain}${u}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
