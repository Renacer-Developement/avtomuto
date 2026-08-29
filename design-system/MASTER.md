# AvtoMuto — Editorial Design System (v2)

**Supersedes the earlier "Torque Geometry" direction.** The gauge/tachometer banner,
pill-badges-with-pulsing-dots, blurred glow blobs, and floating overlap cards were all
identified as generic "AI SaaS landing page" tells and have been removed site-wide.
Nothing below should reintroduce those four patterns.

## Direction: editorial / print-inspired, asymmetric

Think magazine spread / newspaper listing, not SaaS product page. Devices to use:
- **Kicker labels** (`.eyebrow`): plain caps text + a short rule, never a pill/badge shape.
- **Oversized ghost index numerals** (`.index-mark`): huge, very low-opacity numbers
  positioned behind headlines for scale/drama — replaces decorative blobs.
- **Hard-edged offset color blocks** (`.offset-block`): a flat solid rectangle offset by a
  fixed pixel amount behind a photo/element — a print-registration-misprint device,
  replaces blurred glow decoration. No blur, no border-radius on the offset shape.
- **Numbered editorial lists** instead of symmetric icon-in-circle card grids — see
  `ServiceCard.astro` (now a `.service-row`: big index number, small inline icon, title,
  description, ruled top border, no card container/shadow/border-radius). Wrapped in a
  CSS `column-count: 2` magazine flow, not a rigid `display:grid` card grid.
- **Asymmetric columns**: hero uses `5fr 7fr` (or similar deliberate imbalance), not a
  neutral ~1:1 split, and NOT vertically centered — text top-aligned.
- Thin 1px rules / dividers to separate content (stat strips, list rows) instead of
  bordered+radius+shadow cards.

## Explicitly banned (do not reintroduce anywhere on the site)
- Pill/rounded badges with a pulsing dot (`.pill-badge`, `.pill-badge__dot` — deleted from
  global.css, don't recreate).
- Blurred radial-gradient "glow" shapes behind photos (`.hero__blob` — deleted).
- White floating cards overlapping a photo corner with a drop shadow (`.hero__floating-card`
  — deleted).
- Symmetric 3–4 column grids of bordered cards with a circle icon on top, bold title, gray
  description, repeated identically (the old `ServiceCard`/`.service-card` — replaced).
- Any new gauge/dashboard/dial imagery (the "Torque Geometry" banner concept — dropped
  entirely per explicit decision, do not resurrect).

## Typography — IMPORTANT font-support note
- **Headings** (`--font-heading`): **Oswald** (weights 500/600/700 loaded). Bold condensed,
  works as both body headlines and huge display numerals.
  ⚠️ We initially picked "Big Shoulders Display" for this — **it has no Cyrillic glyphs at
  all** (verified against Google Fonts' metadata API), so every heading silently fell back
  to Inter. This site is 100% Ukrainian-language content, so **any heading font swap MUST
  be verified for a `cyrillic` subset before use** — check
  `https://fonts.google.com/metadata/fonts` (search the `subsets` array for the family) or
  ask before assuming. Oswald, Inter, and JetBrains Mono are all confirmed Cyrillic-safe.
  Max weight for Oswald is 700 — don't use font-weight 800/900 with `--font-heading`.
- **Body**: Inter (400–800, Cyrillic-safe).
- **Mono accents** (`--font-mono`, eyebrows/index numbers/captions): JetBrains Mono
  (Cyrillic-safe).

## Brand colors — still unchanged
```
--color-accent: #ff6b00
--color-accent-dark: #cc5500
--color-black: #141414
--color-black-deep: #0c0c0c
--color-white: #ffffff
--color-gray-light: #f4f4f4
--color-gray-mid: #6b6b6b
--color-border: #e2e2e2
```

## Utilities available (src/styles/global.css)
`.eyebrow`, `.index-mark` (+ `.index-mark--on-dark`), `.offset-block` (+
`.offset-block--ink` for a black instead of orange offset). Use these instead of inventing
new one-off decoration.

## Dev workflow gotcha
This project's dev server (already running on :4321) sometimes serves a **stale Vite CSS
module** after a full-file rewrite (via the Write tool) — the HTML picks up new
classes/markup but the `<style>` for that component keeps serving old rules. If a page
looks visually broken after an edit but the file on disk is correct, run
`touch <file>` and wait ~1s before re-checking; don't assume the CSS is wrong.

## Status — rollout complete (done by the main session, sequentially, not agents)
- [x] Homepage — hero rebuilt (asymmetric, no badge/blob/card), services section rebuilt
      as numbered editorial list, StatsRow de-iconified, final-cta given an eyebrow +
      left-aligned.
- [x] `ServiceCard.astro` → `.service-row` (numbered list item), used by homepage +
      `poslugy/index.astro`.
- [x] `RelatedServices.astro` → ruled row list (was bordered icon-box cards).
- [x] Font fix (Oswald + Cyrillic verification) applied globally via `--font-heading`.
- [x] `EvakuatorBanner.astro` — icon box sharpened (radius removed), otherwise already
      reasonable (single CTA banner, not a repeated grid).
- [x] `poslugy/[slug].astro` — hero rebuilt (eyebrow instead of icon box, asymmetric 5:7
      grid, offset-block photo), cities-section/blog-links radius sharpened.
- [x] `poslugy/remont-avtomobiliv/index.astro` — categories grid → numbered editorial
      list (same pattern as ServiceCard). `[category].astro` — eyebrow added, was already
      clean otherwise.
- [x] `poslugy/evakuator/[city].astro` + `poslugy/prodazh-kolis/[city].astro` — hero
      icon-circle removed → eyebrow; the 3 bordered info-cards → a ruled data-strip
      (mono label / big Oswald value / note), matching the homepage stats pattern.
- [x] `poslugy/prodaz-auto/index.astro`, `[car].astro`, `marka/[brand].astro` — these
      were already fairly clean (chip filters, a real `<dl>` spec list, functional
      gallery/lightbox JS left untouched) — just added eyebrows. CarCard/CarCatalog were
      not touched (different genre — product listing cards, not decorative feature cards).
- [x] `blog/index.astro` — featured post now uses `.offset-block` (black card, hard
      orange offset instead of rounded corners), plain post list → ruled rows instead of
      bordered boxes. `blog/[slug].astro` — minimal touch (radius sharpened only), it was
      already a plain, well-typeset reading page — correctly left mostly alone.
- [x] `kontakty.astro` — master/team cards: dropped circular avatar + white card boxes,
      now a ruled 3-column data strip (name/role/contact), matching the info-card pattern.
      Social links, map, form card radius sharpened.
- [x] `pro-nas.astro` — trust-list icon-circle chips → ruled two-column list. Eyebrows
      added to story/team/equipment sections. TeamCard.astro (circular team photos) left
      alone — real headshots are a different, legitimate genre from decorative icons.
- [x] `404.astro` — left-aligned instead of centered, code numeral uses `--font-heading`.
- [x] `polityka-konfidentsiynosti.astro` — audited, already plain/clean, deliberately
      left untouched (legal document, no decoration warranted).
- [x] `ContactForm.astro` — audited, it's a functional form (labels, validation, error
      spans), correctly has no decorative patterns to remove.

All pages verified via `curl` (200/expected status) and spot-checked visually in the
browser (homepage, a service page, evakuator city page, kontakty, pro-nas) — no console
errors, no regressions to existing JS (mega menu, drawer, gallery/lightbox, filters,
scroll-reveal animations all intact).

## Deliberately left alone (not offenders, different genre from what was flagged)
- `CarCard.astro` / `CarCatalog.astro` — product listing cards (like an e-commerce
  listing), not decorative feature cards.
- `TeamCard.astro` / `ContactCard.astro` — real human headshot photos, not icon avatars.
- `ContactForm.astro` — functional form, no decoration.
- Rounded-pill *chip/tag* navigation lists (e.g. city links, brand filters,
  `border-radius: 999px`) — legitimate filter/tag UI, distinct from the flagged
  hero-badge-with-pulsing-dot pattern.
- Circular icon buttons on the car gallery (prev/next/close/zoom) — functional controls,
  not decoration.
