import { SITE } from '../data/site';

export interface SitemapEntry {
  /** Шлях від кореня сайту, напр. "/poslugy/evakuator" */
  path: string;
  /** Дата останньої зміни (YYYY-MM-DD або ISO) */
  lastmod?: string;
}

const XML_HEADERS = { 'Content-Type': 'application/xml; charset=utf-8' };

function loc(path: string): string {
  return path === '/' ? SITE.domain : `${SITE.domain}${path}`;
}

export function urlsetResponse(entries: SitemapEntry[]): Response {
  const urls = entries.map(
    (e) => `  <url><loc>${loc(e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  return new Response(body, { headers: XML_HEADERS });
}

export function sitemapIndexResponse(paths: string[]): Response {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <sitemap><loc>${loc(p)}</loc></sitemap>`).join('\n')}
</sitemapindex>
`;
  return new Response(body, { headers: XML_HEADERS });
}
