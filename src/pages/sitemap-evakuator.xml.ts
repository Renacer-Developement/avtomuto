import type { APIRoute } from 'astro';
import { EVAKUATOR_CITIES } from '../data/evakuator-cities';
import { urlsetResponse } from '../lib/sitemap';

// Окремий sitemap дозволяє в Search Console бачити індексацію саме цих ~50 сторінок сіл
// окремо від решти сайту. Підключений у sitemap-index.xml.
export const GET: APIRoute = () => {
  const urls = ['/poslugy/evakuator', ...EVAKUATOR_CITIES.map((c) => `/poslugy/evakuator/${c.slug}`)];

  return urlsetResponse(urls.map((path) => ({ path })));
};
