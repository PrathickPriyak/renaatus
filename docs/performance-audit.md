# Production performance audit

**Branch:** `cursor/production-performance-0b8e`  
**Scope:** Marketing payload, App Router rendering, fonts, queries, and caching. Design, copy, and visual quality are unchanged.

## Findings

| Area | Before | After |
| --- | --- | --- |
| Hero video | Autoplayed `hero-mobile.mp4` (~18 MB) and `hero-desktop.mp4` (~12 MB) on every viewport, including phones | Desktop: attach and autoplay only when the hero is in view and motion is allowed. Mobile / reduced motion: Next-optimized poster only. Mobile loop is no longer published. |
| Posters | Dual `priority` Images; mobile poster was a 4.9 MB PNG used as a raw `poster` attribute | Art-directed `<picture>` via `getImageProps` so one breakpoint downloads. Quality 85 for LCP stills. |
| 5 GB package | `sync-assets` copied the entire `assets/` tree into `public/assets` | Sync copies **referenced** files only and denies fonts, icons, documents, and unused loop videos. Extra brand-pack dumps never reach the deploy. |
| Images | Default Next quality; no AVIF/WebP config; no asset cache headers | `formats: avif, webp`; qualities 75/85; 30-day optimizer TTL; `/assets/*` `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (not `immutable` — filenames are not hashed). |
| JS / client | Root `MotionProvider` pulled Framer Motion onto every route. Honeypot was an unnecessary client module. `lucide-react` shipped for one icon. | Motion config is local to Reveal/Parallax/Hero. Honeypot is a server component. Modal uses an inline SVG. `@types/exceljs` and `lucide-react` removed. |
| Fonts | Outfit + Candara with `display: swap` | Same files and look; both preload with fallback metrics (`adjustFontFallback`) to cut layout shift. Outfit remains self-hosted by `next/font`. |
| Third-party | Turnstile injected with `document.createElement` | `next/script` `lazyOnload` — still loads only on enquiry forms. |
| Database | Homepage called the full journal listing (50 posts + tags + OG + category post ids). Sitemap `force-dynamic`. Blog slug queried twice. Admin list selected JSON bodies. | `listHomeJournalPosts(take)` + card includes. Category counts via `_count`. Sitemap revalidates hourly. Blog detail uses `cache()`. Admin list omits `body`. Marketing pages `revalidate = 300`. |
| Animations | Permanent `will-change-transform` on parallax | Transform still runs; the hint is gone so the layer does not stay promoted. |
| Loading | Only admin had a loading UI | Public `(site)/loading.tsx` uses existing skeleton tokens so route transitions keep the dark layout. |

## Constraints honoured

- No visual redesign. Desktop cinematic hero still loops when it is on-screen.
- No aggressive re-encode of brand photography (Next Image serves AVIF/WebP at request time).
- Large media is not requested until needed; phones do not autoplay the 12–18 MB loops.
- Unused npm dependencies removed without adding new ones.

## Follow-ups (not in this change)

- Host remaining hero desktop video on R2/CDN once the public bucket is wired for marketing media.
- Subset Candara to woff2 when a lossless conversion pipeline is available.
- Split `Button` off `@radix-ui/react-slot` if a later pass wants it as a true server component.
