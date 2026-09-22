# Renaatus production QA

**Date:** 22 September 2026  
**Branch:** `cursor/production-qa-0b8e`  
**App:** Next.js 16 production build (`next start`) against local PostgreSQL  
**Unit tests:** 149 pass  
**Live public crawl:** 95 pass, 0 fail  
**Forms / admin / CMS live script:** 24 pass, 0 fail, 2 warnings

This report is the result of exercising public routes, navigation, CTAs, media, forms, PostgreSQL, admin, blog CMS, security, responsive viewports, production runtime, and SEO. It is not a claim that the application is unhackable.

## Fixes in this pass

| ID | Severity | What failed | Fix |
| --- | --- | --- | --- |
| QA-01 | High | `/assets/images/news/sap-live.jpg` 404 and Next optimizer 400 on `/blog` and `/blog/renaatus-goes-live-with-sap`. Seed/CMS keys are `images/news/…` without an `/assets/` prefix, so `sync-public-assets` never copied the still. | Extract quoted `images/` and `videos/` media keys as well as `/assets/…` paths. Unused loops and the 5 GB dump stay denied. After sync: 68 published files, `sap-live.jpg` HTTP 200, optimizer HTTP 200. |
| QA-02 | Medium | Deleting a journal post via the admin action called `revalidatePath` without the slug, so `/blog/{slug}` could stay ISR-cached for up to 300s. | `deleteJournalPost` now returns `{ slug }`; the delete action revalidates `/blog/{slug}`. |

## PASS

### Public pages

- Every sitemap URL and the static public set (`/`, `/about`, `/why-renaatus`, `/projects`, `/projects?type=realty`, `/projects?type=infrastructure`, `/products`, `/products/renacon-aac-blocks`, `/services`, `/industries`, `/blog`, published journal slugs, `/contact`, `/careers`, `/privacy`, `/terms`, `/cookies`, project slugs) returned HTTP 200.
- Legacy aliases `/realty`, `/infrastructure`, `/journal` redirect to the canonical routes.
- Unknown paths return 404.
- Header/footer/main links include `/about`, `/projects`, `/products`, `/services`, `/careers`, `/contact`, `/blog`.
- Sampled pages have an `h1` and a document title.
- Contact, careers, and Renacon product pages each render an enquiry form.
- Desktop home attaches `hero-desktop.mp4`. Mobile/reduced-motion remain poster-only (by design).
- After QA-01, sampled public images including the SAP journal still have non-zero intrinsic width. No remaining 4xx document/asset requests on sampled pages.
- No `pageerror` runtime events in the Chromium crawl.

### Forms

- Valid contact, product, and career submissions persist to PostgreSQL and return no PII to the client.
- Career resumes store as `PRIVATE` under `private/careers/…` with magic-byte checks; malicious “PDF” executables do not write an enquiry or media row.
- Empty required fields are rejected (`Please enter your name.`).
- Invalid email/phone are rejected.
- Honeypot (`website` filled) returns `ignored` and does not write.
- Link-packed spam is rejected without a write.
- Sixth contact from the same IP is rate-limited.

### Database

- Enquiry create + read after valid submit.
- Enquiry status update (`NEW` → `IN_PROGRESS`).
- Missing enquiry `findUnique` returns `null`.
- Update of an unknown id is rejected by Prisma.
- IP is stored as `ipHash`, never a dotted address.

### Admin

- Unauthenticated `/admin` and `/admin/enquiries/export` redirect to `/login?next=…`.
- Valid administrator password creates a database session; dashboard HTML includes the staff name.
- Enquiry list shows stored contacts; Excel export returns an `xlsx` (`PK` zip) with `spreadsheet` content-type.
- Viewer sessions receive HTTP 403 on export.
- `/admin/blog/new` renders the editor form for a super-admin.
- Logout deletes the session row; a subsequent `/admin` request with the old cookie redirects to login.
- Unknown email and wrong password share the same error; login is rate-limited.

### Blog CMS

- Create draft: public lookup returns `null`.
- Publish: public lookup returns SEO title/description; `/blog/{slug}` is HTTP 200.
- Unpublish: public lookup returns `null`.
- Duplicate slugs are rejected.
- Drafts never appear in the public listing or homepage cards.
- Canonical defaults to the public journal path; custom canonicals are honoured.

### Security

- Legacy `/api/contact` is 410 for GET and POST.
- CSP (`default-src 'self'`), `X-Frame-Options: DENY`, HSTS, no `X-Powered-By`.
- `/login`, `/admin`, `/api/*`, `/design-system` send `X-Robots-Tag: noindex, nofollow`.
- Private resume keys are not serialised to the admin UI.
- Turnstile and Upstash fail closed when `APP_ENV=production` and secrets are missing.
- File uploads: type, size, magic bytes, zip inspection, randomised keys.

### Responsive / performance / SEO

- No horizontal overflow at 375 and 768 on sampled pages.
- `npm run build` exit 0 (48 static routes, marketing ISR 300s, sitemap 3600s).
- `sitemap.xml` is a urlset, includes home, excludes `/admin` `/login` `/api`.
- `robots.txt` disallows `/admin`, `/login`, `/api/`, `/design-system` and points at the sitemap.
- Home has Organization JSON-LD and a canonical link. Published posts include Article JSON-LD.
- Public pages in the SEO catalog have unique titles, descriptions, Open Graph, and Twitter cards.

## FAIL

None remaining after QA-01 and QA-02.

Previously failed, now fixed:

- `IMG-BROKEN` / `NET-FAILED` on `sap-live.jpg` (QA-01).
- Delete action did not revalidate the public slug (QA-02).

## WARNING

| ID | Detail |
| --- | --- |
| FORM-DUPLICATE | Repeat legitimate contact payloads from the same person are stored as separate rows. Abuse controls are honeypot, spam heuristics, Turnstile, and IP/email rate limits — not uniqueness. |
| BLOG-UNPUBLISH-HTTP | Direct library unpublish (bypassing the admin server action) leaves the ISR HTML for up to 300s. The admin update/delete actions call `revalidatePath`. Do not write `Post` rows outside those actions in production. |
| AUTH_SECRET length | Local `.env.local` uses a short development secret. Production must set ≥32 characters (see security audit). |
| npm audit | Prisma transitive highs (`deepmerge-ts`, `mysql2`) remain open; this app uses PostgreSQL. Tracked in `docs/security-audit.md`. |
| Next middleware | `next build` warns that `middleware` should migrate to `proxy`. Behaviour is correct; rename is a follow-up. |
| Session tokens | Stored in plaintext in PostgreSQL (high-entropy). A database dump can hijack sessions until 8-hour expiry. |
| CSP | Allows `'unsafe-inline'` / `'unsafe-eval'` because Next.js still emits inline scripts. |

## REQUIRES_MANUAL_TEST

| ID | Why it cannot be closed here |
| --- | --- |
| FORMS-BROWSER-TURNSTILE | Cloudflare Turnstile needs a live site key and a human/widget token. Headless Chrome cannot complete the challenge. |
| EMAIL-DELIVERY | Outbound enquiry mail needs `RESEND_API_KEY` and `ENQUIRY_NOTIFY_EMAIL` in the production environment. |
| R2-PRIVATE-RESUME | Private resume storage on R2 is unit-tested with a mocked client; live R2 was not configured in this environment. |
| ADMIN-UI-CLICK | Login, enquiry status, Excel download, and journal publish were verified over HTTP + Prisma. Pixel-level click-through of every admin control still wants a staff browser on the deployed host. |
| PRODUCTION-SECRETS | Confirm `AUTH_SECRET`, Turnstile, Upstash, R2, and `APP_ENV=production` on Vercel before go-live. Missing any of these fail closed by design. |

## How this was tested

1. Unit/integration: `npm test` (149) covering enquiry pipeline, spam, rate limits, login, permissions, export, blog draft/publish/unpublish/slug/SEO, sitemap, JSON-LD, Turnstile fail-closed, private files.
2. Production build: `npm run build` then `npm start`.
3. Chromium crawl of sitemap + chrome links, images, video, console, overflow at 375/768, security headers.
4. Node script against the live server + Prisma for form cases, CRUD, admin cookie session, export bytes, blog lifecycle, logout.

## Follow-ups (not blocking this QA)

- Host remaining desktop hero video on R2/CDN.
- Hash session tokens at rest.
- Move enquiry export from credentialed GET to POST (low CSRF impact with SameSite=Lax).
- Rename Next `middleware` to `proxy` when convenient.
