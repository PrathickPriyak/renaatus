# Renaatus asset & project inspection

**Status:** Inspection only. No pages were built or deleted in this phase.  
**Generated:** 2026-09-18  
**SKYI reference:** https://skyi.com/ (visual/UX only; not a content or IA clone)

---

## Critical finding

**The ~5 GB Renaatus asset package is not in this workspace.**

What is present:

| Location | Size | What it is |
| --- | --- | --- |
| `/workspace/assets` | **~62 MB, 99 files** | Public files previously copied from renaatus.com, already renamed |
| SharePoint URL from prior chat | Inaccessible (Microsoft login) | Likely the real 5 GB library |

Until the 5 GB package is uploaded (zip/drive) or SharePoint is shared as “anyone with the link” / synced here, this report describes **only the 62 MB seed library**. Re-run inspection when the full package arrives. Do not merge a 5 GB dump into Git.

Machine files were **not executed**. SVGs were scanned for script tags only. Images/videos were not bulk-decoded.

---

## 1. Asset folder analysis

Current tree (source of truth for media today):

```
assets/
├── documents/          empty (.gitkeep only)
├── fonts/              Candara TTFs + Font Awesome woff2
├── icons/              patterns, cursor, oversized “stat” PNGs
├── images/
│   ├── aac/            product stills
│   ├── about/          story grids + still
│   ├── banners/        page heroes
│   ├── infrastructure/ EPC stills + galleries by country
│   ├── news/           CMRL / SAP
│   ├── people/         leadership portraits
│   ├── realty/         Maldives + India
│   └── verticals/      home cards
├── logos/              R mark + two wordmarks
└── videos/             hero desktop/mobile, loading, about-loop
```

**Totals (assets/ only):** 99 files, **64.7 MB**.  
**Largest class:** videos 29.5 MB (46% of the library).

`website/public/assets` is a **full copy** of this tree, created by `scripts/sync-assets.sh` on `dev`/`build`. That is unsafe once confidential documents exist.

---

## 2. Existing project analysis

Nothing was deleted.

| Area | Finding |
| --- | --- |
| Git | Branch `cursor/website-asset-structure-0b8e`. `main` is still the empty initial README. |
| Framework | **Next.js 16.3.5** (App Router) + **React 19** + **TypeScript** + **Tailwind CSS v4** |
| Package | `website/package.json` — Next, React, ESLint, Tailwind. No CMS, no image CDN SDK, no Convex. |
| Routes | `/` `/about` `/realty` `/infrastructure` `/careers` `/contact` + `not-found` |
| API | `POST /api/contact` — validates fields, returns a `mailto:` URL. No persistence, no SMTP, no auth. |
| Components | Header, Footer, PageHero, ProjectCard, ContactForm, InfrastructureGrid |
| Content | Hardcoded in `website/src/lib/content.ts` |
| Styles | `website/src/app/globals.css` — dark luxury tokens (`#004cb8`, cream, gold) |
| Fonts | Outfit (Google) + local Candara in `website/src/fonts/` (duplicate of `assets/fonts`) |
| Public | Next boilerplate SVGs (`next.svg`, `vercel.svg`, …) plus synced `/assets` |
| Env files | **None** (`.env*` gitignored). No secrets in repo. |
| Database | **None** (no Convex, Prisma, Supabase, Postgres) |
| Auth | **None** |
| Media pipeline | Copy script only. No WebP/AVIF, no CDN, no CMS. |

This is a marketing-site prototype, not yet the SKYI-grade production architecture (project-first IA, media CDN, CMS, form backend).

---

## 3. Recommended folder structure

Keep Git lean. Separate **public web media** from **private originals**.

```
media/                          # NOT the 5 GB original dump
  public/                       # only files allowed on the CDN
    logos/
    brand/
    homepage/                   # hero stills (not 4K video masters)
    products/renacon/
    projects/
      realty/{maldives,india}/
      infrastructure/{india,maldives,mauritius}/
    about/{team,studio}/
    services/
    journal/                    # blog/news
    icons/
  private/                      # never copied to website/public
    documents/
    raw/                        # masters, PSDs, unreleased shoots
    fonts-licensed/
```

**Original 5 GB package** should live in object storage (Cloudflare R2 / S3 / Cloudinary) or a DAM, **outside Git**.

Map SKYI UX → Renaatus IA (content is Renaatus, motion/layout is SKYI-like):

| SKYI pattern | Renaatus equivalent |
| --- | --- |
| Cinematic home + stats | Home hero video + group stats |
| Current developments | Realty “current / featured” |
| Brand portfolio (Five, Iris, …) | Verticals: Realty, Infrastructure, Renacon |
| Gallery | Project + lifestyle galleries |
| Recognition | Awards / certifications (missing today) |
| Experience living | Realty amenities / interiors (mostly missing) |

---

## 4. Asset categorization (current 62 MB set)

| Category | Files | Size | Notes |
| --- | --- | --- | --- |
| Project images | 42 | 5.0 MB | Infrastructure stills + inner galleries |
| Architecture / buildings | 7 | 5.6 MB | Realty; Irumathi PNG is 4.7 MB |
| Brand assets | 6 | 2.3 MB | About grids |
| Hero / banners | 6 | 3.9 MB | Page heroes; some are generic stock-like |
| Team | 6 | 1.1 MB | 2 used in UI; 3 unnamed roles |
| Videos | 4 | 29.5 MB | Hero files too large for Git long-term |
| Icons | 5 | 4.0 MB | `stat-r*.png` unused and huge |
| Backgrounds | 4 | 0.09 MB | SVG/PNG patterns from old template |
| Product (AAC) | 4 | 3.1 MB | Factory/block photos, not SKUs |
| Blog / news | 3 | 1.4 MB | CMRL + SAP |
| Fonts | 5 | 0.43 MB | Candara + FA |
| Logos | 3 | 0.04 MB | Wordmarks have **black boxes**, not transparent |
| Documents | 0 | 0 | Empty — 5 GB package likely has these |
| Miscellaneous | 1 | — | `assets/README.md` |

Full row-level inventory: `docs/asset-inspection/asset-manifest.csv` and `.json`.

---

## 5. Duplicate / suspicious report

### Exact duplicates (same hash)

- `assets/images/infrastructure/galleries/nit-karaikal/01.jpg`
- `assets/images/infrastructure/india/nit-karaikal.jpg`

Keep one. Do not delete until you confirm.

### Alternate versions (not byte-identical)

- Chairman: `selvasundaram.png` vs `selvasundaram-portrait.png`
- India realty: `vilankurichi-coimbatore.jpg` and `-2.jpg`
- “Infrastructure” / “Realty” exist as both **banner** and **vertical** crops
- Wordmarks: `renaatus-logo-light.png` (black rectangle) vs `renaatus-logo-li.png` (tiny)

### Suspicious / do-not-execute

- **No** `.exe`, `.html`, `.js`, `.php` inside `assets/`.
- **No** `<script>` in the three SVGs.
- Font Awesome `.woff2` files are leftover from the old HTML template — not Renaatus brand.
- `cursor.png` is a 172-byte custom cursor from the old site; not needed.

### Unclear purpose

- `icons/stat-r1`–`r4.png` (0.67–1.28 MB each) — unused decorative rasters
- `videos/loading.mp4`, `videos/about-loop.mp4` — not referenced by current pages
- `banners/coming-soon.jpg` (+ mobile) — placeholder-era
- Leadership: Kirubakaran, Padmini Sundaram, Saravanan — **no titles/bios** in content
- `documents/` empty — cannot classify brochures, contracts, or price lists from the 5 GB set

---

## 6. Large-file report (current library)

| File | Size | Recommendation |
| --- | --- | --- |
| `videos/hero-mobile.mp4` | 17.4 MB | External storage + compressed poster; not Git |
| `videos/hero-desktop.mp4` | 11.7 MB | Same |
| `realty/maldives/irumathi-exterior.png` | 4.7 MB | Convert to WebP/AVIF, max ~1920px |
| `verticals/*.jpg` | 1.5–1.9 MB | Optimize |
| `icons/stat-r2.png`, `stat-r3.png` | ~1.3 MB each | Exclude from production |
| `aac/block-03.jpg` | 1.0 MB | Optimize |

**Git already contains ~62 MB of binaries.** A 5 GB import would be unacceptable (GitHub soft warning 50 MB/file, hard limit 100 MB/file, repo clone pain).

Previously discarded (not in Git, for history): a corrupt ~14 MB `architect.jpg` (invalid JPEG dimensions) from the live site. Do not restore it.

---

## 7. Recommended optimization strategy

When the 5 GB package arrives, process **copies**, never the masters.

1. **Raster:** max edge 1920 (heroes 2560), convert to **AVIF + WebP**, keep one JPEG fallback. Target &lt; 200 KB for cards, &lt; 400 KB for heroes.
2. **PNG logos:** recut on **transparent** background; ship SVG if design has it.
3. **Video:** 1080p hero ≤ 6–8 MB, H.264 + poster frame; mobile portrait ≤ 4 MB. Host on Cloudflare Stream / Mux / R2, not `/public`.
4. **Do not** commit PSD/TIFF/RAW/4K masters.
5. **next/image** (or Cloudinary/imgix URLs) for runtime resizing.
6. Generate a new manifest after ingest (path, hash, width, height, category).

---

## 8. Recommended media storage strategy

| Class | Where | Why |
| --- | --- | --- |
| Logo SVG/PNG, favicon, critical CSS-sized icons | Git + `public/` | Tiny, needed at build |
| Optimized stills used on pages | **R2 / S3 / Cloudinary** | Will grow; keep Git &lt; tens of MB |
| Hero / project video | Stream/R2 with signed or public CDN URLs | 5 GB lives here |
| Brochures, contracts, rate cards | **Private bucket**, auth or sales-only links | Never `public/` |
| Fonts | `next/font/local` after **license check**; not a public directory listing | Candara is a Microsoft face |
| 5 GB originals | DAM or cold bucket `renaatus-assets-originals/` | Source of truth |

**Do not** keep using `sync-assets.sh` as a blanket copy of the whole library into `website/public/assets`.

---

## 9. Assets required for homepage (SKYI-like)

Need (from current set, plus gaps):

| Need | Current candidate | Gap |
| --- | --- | --- |
| Logo | `logos/renaatus-mark.png` | Transparent wordmark |
| Cinematic hero | `videos/hero-desktop.mp4` / `hero-mobile.mp4` | Shorter, lighter, licensed master from 5 GB |
| Hero poster | `banners/infrastructure.jpg` (weak match) | Dedicated still from hero film |
| Featured projects | Realty stills (Irumathi, Javaahiru, Ithaa Muiy, Skyside) | Interiors, amenities, maps like SKYI cards |
| Brand verticals | `verticals/*.jpg` | Tighter crops |
| Product teaser | `aac/block-*.jpg` | Packaged product beauty shots |
| Recognition | — | Award / IGBC / BIS / CREDAI logos |
| Lifestyle gallery | — | Resident / interior / landscape set |

---

## 10. Assets likely required for Products (Renacon)

| Need | Now | Gap |
| --- | --- | --- |
| Hero | AAC stills | Studio-quality product range |
| SKUs | — | Blocks, adhesive, plaster, boards, panels |
| Spec sheets | `documents/` empty | PDFs — **private or gated**, not crawlable internals |
| Plant photos | Partial in about/aac | Arcot / Perundurai / Tirunelveli |
| Certifications | — | GreenPro, BIS, IGBC marks |

---

## 11. Assets likely required for Projects

**Realty (SKYI “developments”):** Irumathi, Javaahiru, Ithaa Muiy, Skyside, Vilankurichi. Have exteriors only. Need: galleries, plans, amenities, location, status.

**Infrastructure:** India / Maldives / Mauritius stills + some inner galleries. Need: consistent cover crops, captions, year, client (AAI, CMRL, etc.).

Gallery folders exist but are **not rendered** on current pages (data only in `content.ts`).

---

## 12. Assets likely required for About

| Need | Now | Gap |
| --- | --- | --- |
| Leadership | Selvasundaram, Manoj | Bios for other three portraits |
| Story grids | `about/grid-1..4.png` | Higher-res or video stills from 5 GB |
| Offices | — | Chennai / Hulhumalé / Port Louis photos |
| Timeline | Copy only | Archival photos per year |

---

## 13. Assets likely required for Services

Renaatus services ≈ EPC + design-build + manufacturing (not SKYI home-features).

Current `verticals/` covers three cards. Missing: process diagrams, safety, SAP/operations, CMRL-quality CGI that is licensed for web.

---

## 14. Assets likely required for Blog / Journal

| File | Topic |
| --- | --- |
| `news/cmrl-tower.png` | Chennai Central Tower |
| `news/sap-live.jpg` | SAP go-live |
| `news/news-cover.jpg` | Generic; purpose unclear |

Need: article crops, author-safe images, no confidential decks.

---

## 15. Assets requiring clarification

Please confirm before Phase 2 (build):

1. **Where is the 5 GB package?** Upload a zip, connect a bucket, or share SharePoint as a downloadable link.
2. **Transparent official logo / SVG?** Current wordmarks sit on black.
3. **Candara license** for web embedding?
4. Roles for **Kirubakaran, Padmini Sundaram, Saravanan**.
5. Which documents are **public brochures vs internal**.
6. Which realty projects are **live / sold out / upcoming** (SKYI-style status).
7. Whether **Renacon** is a site section or a separate domain (renacon.in).
8. Whether to **keep or freeze** the existing Next.js prototype as the base.

---

## Security (this phase)

| Rule | Status |
| --- | --- |
| Do not execute asset-package files | Observed |
| Do not import unknown scripts | No asset JS imported |
| No `.env` / credentials in repo | None found |
| Do not expose private documents in `public/` | `documents/` empty; **script would copy them if added** |
| Treat uploads as untrusted | Manifest only; no binary execution |

**Fix in a later phase (not done now):** stop blanket-syncing `assets/` → `website/public/assets`; add an allowlist.

---

## What should stay / go (current 62 MB)

| Stay in Git (small, public) | Optimize then CDN | Exclude from production app |
| --- | --- | --- |
| `logos/renaatus-mark.png` | Heroes, verticals, AAC, realty PNG | `stat-r*.png` |
| Clean SVG icons (after review) | Infrastructure galleries | Font Awesome woff2 |
| | Compressed hero video | `coming-soon*` unless used |
| | | Duplicate NIT image |
| | | `cursor.png`, unused loops until needed |

---

## Next phase (waiting)

Do not build SKYI-level pages until:

1. The 5 GB package (or a curated export) is available in the environment, **or** you explicitly approve proceeding with this 62 MB seed.
2. You answer the clarification list above.
3. We re-run the manifest on the real dump (structure, dupes, large files, private vs public).
