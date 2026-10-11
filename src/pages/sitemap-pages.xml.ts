import type { APIRoute } from 'astro';
import { SERVICES } from '../data/services';
import { REMONT_CATEGORIES } from '../data/remont-categories';
import { KOLISA_CITIES } from '../data/kolisa-cities';
import { getBlogPosts } from '../data/blog';
import { urlsetResponse, type SitemapEntry } from '../lib/sitemap';

// Рендериться на запит (Vercel ISR), тож нова стаття з Hygraph потрапляє сюди без деплою.
// Авто та евакуатор мають власні sitemap-и (див. sitemap-index.xml), тому тут їх немає.
export const prerender = false;

// Статичні сторінки беремо прямо з src/pages — нова сторінка з'явиться в sitemap автоматично.
// Динамічні маршрути ([slug] тощо) перелічуються нижче з даних.
const STATIC_PATHS = Object.keys(import.meta.glob('./**/*.astro'))
  .filter((file) => !file.includes('[') && !file.endsWith('/404.astro'))
  .map((file) => file.replace(/^\./, '').replace(/\.astro$/, '').replace(/\/index$/, '') || '/');

const EXCLUDED_PREFIXES = ['/poslugy/evakuator', '/poslugy/prodaz-auto/'];

export const GET: APIRoute = async () => {
  const posts = await getBlogPosts();

  const paths = [
    ...STATIC_PATHS,
    ...SERVICES.map((s) => `/poslugy/${s.slug}`),
    ...REMONT_CATEGORIES.map((c) => `/poslugy/remont-avtomobiliv/${c.slug}`),
    ...KOLISA_CITIES.map((c) => `/poslugy/prodazh-kolis/${c.slug}`),
  ].filter((p) => !EXCLUDED_PREFIXES.some((prefix) => p.startsWith(prefix)));

  const entries: SitemapEntry[] = [
    ...[...new Set(paths)].sort().map((path) => ({ path })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.date })),
  ];

  return urlsetResponse(entries);
};
