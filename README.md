# AvtoMuto

Website for **AvtoMuto (Авто Мито)**, a full-service auto shop in Rudnyky near Stryi, Lviv region:
car repair, car sales, parts, certification, and a 24/7 tow truck.

**Live:** [www.avtomuto.com.ua](https://www.avtomuto.com.ua) · [avtomuto.vercel.app](https://avtomuto.vercel.app)

## Tech stack

- [Astro](https://astro.build) 7 with the [`@astrojs/vercel`](https://docs.astro.build/en/guides/integrations-guide/vercel/) adapter (ISR, 60s)
- [Hygraph](https://hygraph.com) (GraphQL CMS) for frequently changing content: cars in stock and the blog
- `@astrojs/sitemap` plus custom dynamic sitemaps for cars and tow-truck city pages
- Vercel Speed Insights, Google Tag Manager / GA4, cookie consent banner
- Contact form requests delivered to Telegram

## Getting started

Requires Node.js 22.12 or newer (Astro 7 minimum).

```bash
npm install
cp .env.example .env   # fill in the values, see below
npm run dev            # http://localhost:4321
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `HYGRAPH_ENDPOINT` | No | Hygraph content API URL. If unset or unreachable, pages fall back to local content in `src/data`, so the build never fails because of the CMS. |
| `HYGRAPH_TOKEN` | No | Hygraph auth token, if the API is not public |
| `TELEGRAM_BOT_TOKEN` | For the contact form | Bot that delivers contact-form requests |
| `TELEGRAM_CHAT_ID` | For the contact form | Chat that receives the requests |
| `PUBLIC_GTM_ID` | No | Google Tag Manager container ID |
| `PUBLIC_GA4_ID` | No | Google Analytics 4 measurement ID |
| `PUBLIC_GOOGLE_ADS_ID` | No | Google Ads conversion ID |
| `PUBLIC_GSC_VERIFICATION` | No | Google Search Console verification token |

Variables prefixed with `PUBLIC_` are exposed to the browser. Keep everything else server-only.

## Project structure

```
src/
├── pages/                 # Routes (Ukrainian slugs)
│   ├── index.astro        # Home
│   ├── poslugy/           # Services: repair, car sales, tow truck, parts, wheels, detailing…
│   │   ├── evakuator/[city].astro       # Tow-truck landing page per city
│   │   ├── prodazh-kolis/[city].astro   # Wheel sales per city
│   │   └── prodaz-auto/[car].astro      # Car detail pages (from Hygraph)
│   ├── blog/              # Blog list and posts
│   ├── api/contact.ts     # Contact form endpoint → Telegram
│   └── sitemap-*.xml.ts   # Dynamic sitemaps (cars, tow-truck cities)
├── components/            # UI components (Header, CarCatalog, ContactForm, ConsentBanner…)
├── layouts/               # Base page layout
├── lib/                   # Hygraph client and car queries
├── data/                  # Static content: services, cities, team, site settings
├── utils/schema.ts        # JSON-LD structured data helpers
└── styles/global.css
design-system/MASTER.md    # Design direction and UI rules — read before changing the UI
```

## Rendering

Most pages are prerendered at build time. Pages backed by live data opt out with
`export const prerender = false` and are rendered on request, cached with ISR for 60 seconds:
the home page, car listings, car detail and brand pages, the car sitemap, and the contact API.

## Contact form

`POST /api/contact` validates the name and phone number, drops bot submissions through a hidden
honeypot field, and forwards the request to Telegram. It needs `TELEGRAM_BOT_TOKEN` and
`TELEGRAM_CHAT_ID`.

## Deployment

Deployed on Vercel from `main`; pull requests get preview deployments. Security headers
(CSP, `X-Frame-Options`, `Referrer-Policy`, and others) are set in `vercel.json`. If you add a new
third-party script, image host, or API, allow it in the Content-Security-Policy there.

Set the environment variables above in the Vercel project settings.

## Design

The UI follows an editorial, print-inspired direction documented in
[`design-system/MASTER.md`](design-system/MASTER.md). Check it before adding new sections or
components.
