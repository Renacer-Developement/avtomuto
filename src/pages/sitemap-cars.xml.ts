import type { APIRoute } from 'astro';
import { getCarListings, brandSlug } from '../lib/cars';
import { urlsetResponse } from '../lib/sitemap';

// Сторінки авто й марок рендеряться на запит (дані з Hygraph), тому для них окремий живий
// sitemap. Оновлюється разом з ISR,
// тож нове авто з CMS потрапляє сюди без деплою. Підключений у sitemap-index.xml.
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

  return urlsetResponse(urls.map((path) => ({ path })));
};
