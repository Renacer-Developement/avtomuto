import type { APIRoute } from 'astro';
import { sitemapIndexResponse } from '../lib/sitemap';

// Головний sitemap, на який посилаються robots.txt і <link rel="sitemap"> у BaseHead.
export const GET: APIRoute = () =>
  sitemapIndexResponse(['/sitemap-pages.xml', '/sitemap-cars.xml', '/sitemap-evakuator.xml']);
