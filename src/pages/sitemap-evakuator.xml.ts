import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { EVAKUATOR_CITIES } from '../data/evakuator-cities';

// Сторінки евакуатора вже є в sitemap-index.xml, але окремий sitemap дозволяє в Search Console
// бачити індексацію саме цих ~50 сторінок сіл окремо від решти сайту. Підключений у robots.txt.
export const GET: APIRoute = () => {
  const urls = ['/poslugy/evakuator', ...EVAKUATOR_CITIES.map((c) => `/poslugy/evakuator/${c.slug}`)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE.domain}${u}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
