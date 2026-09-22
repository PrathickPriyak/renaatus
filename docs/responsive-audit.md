# Responsive audit

**Branch:** `cursor/responsive-audit-0b8e`  
**Scope:** Every public marketing route at 320, 375, 390, 430, 768, 820, 1024, 1280, 1440, and 1920. Header, navigation, hero, images, type, buttons, cards, forms, blog, footer, and keyboard access. Public pages have no data tables.

## Method

- Code contracts in `website/src/lib/layout/*.test.ts`.
- Chrome (puppeteer-core) overflow scan: 21 routes × 10 widths = 210 viewports. Overflow is `documentElement.scrollWidth > innerWidth`.
- Keyboard: skip link, mobile menu focus trap + Escape restore, contact form tab order.

## Findings

| Area | Before | After |
| --- | --- | --- |
| Display type | `clamp(2.75rem, 6vw, 5.25rem)` overflowed the 320px hero | Floor is `2.35rem`; desktop max stays `5.25rem` |
| Heroes | `overflow-hidden` on the min-height section cropped copy | Clip stays on the media layer; copy can grow |
| Touch | `h-9` chips and compact buttons were 36px | Buttons, chips, nav, footer, share, and file input are at least 44px |
| Long strings | Emails and project titles could blow a grid column | `overflow-wrap: anywhere`, `min-w-0`, `break-words` / `break-all` |
| Skip link | `focus:absolute` sat under the header; `#main-content` was not focusable | `focus:fixed`; `main` has `tabIndex={-1}` |
| Mobile menu | Focus did not return to the hamburger | Restore on close; Escape; focus trap; primary labels wrap |
| Country filters | `role="tablist"` without tabs | `role="group"` + `aria-pressed` |
| Brand lockup | Footer home link collapsed to ~20px before images painted | Lockup and home links are `min-h-11` |

## Scan (puppeteer, Chromium)

| Check | Result |
| --- | --- |
| Horizontal overflow | **0 / 210** viewports (`scrollWidth` matched `innerWidth`) |
| Hero copy clipped | **None** (media clipped; type visible) |
| Logo tap target | **44×157** header and footer after the lockup fix |
| Skip link | Focused, `position: fixed` at 12,12; Enter moves focus to `#main-content` |
| Mobile menu | Opens to “About”, lists all destinations, Escape returns to “Open menu” |
| Contact form | 13 focusable controls in `main`; Tab walks name → email → phone → office → subject → message → submit |
| Public tables | None |

Routes scanned: `/`, `/about`, `/why-renaatus`, `/projects`, `/projects?type=realty`, `/projects?type=infrastructure`, `/projects/renaatus-irumathi`, `/projects/the-skyside-by-renaatus`, `/projects/rajahmundry-domestic-airport`, `/projects/rob-and-pedestrian-subway-pollachi-podanur`, `/products`, `/products/renacon-aac-blocks`, `/services`, `/industries`, `/blog`, `/blog/renaatus-goes-live-with-sap`, `/contact`, `/careers`, `/privacy`, `/terms`, `/cookies`.

## Constraints honoured

- Desktop 1440/1920 hero and display size are unchanged.
- Content is not `display: none` / `overflow-x: hidden` as the only mobile fix.
- Luxury spacing (`--section-y`, brass type, dark field) is intact.

## Follow-ups (not in this change)

- Hosted production should be re-checked without the Next.js dev indicator overlay.
- Admin tables already wrap in `overflow-x-auto`; they were out of this public-page pass.
