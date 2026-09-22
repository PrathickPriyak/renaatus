# Final launch audit

**Date:** 22 September 2026  
**Branch:** `cursor/launch-audit-0b8e`  
**Verdict:** **NOT READY**

This audit covers architecture, security, functionality, SEO, performance, responsive layout, deployment, and backup. It does **not** claim the application is unhackable. It does **not** authorize a production DNS cutover.

---

## Verdict

# NOT READY

### Why (blocking)

| # | Severity | Area | Reason |
| --- | --- | --- | --- |
| 1 | High | Deployment | No evidence of a completed Vercel **Production** deployment with filled secrets. Checklist in `docs/vercel-production.md` is still pre-deploy. |
| 2 | High | Deployment | Custom domain / Cloudflare DNS / public HTTPS hostname **not** cut over (intentionally deferred). `NEXT_PUBLIC_APP_URL` / `AUTH_URL` cannot be production-correct until then. |
| 3 | High | Security (ops) | Production env not verified live: `APP_ENV=production`, `AUTH_SECRET` (≥32), Turnstile, Upstash, full `R2_*`, Resend, Neon `DATABASE_URL`/`DIRECT_URL`. Missing pieces fail closed (503) when runtime detection is correct — forms/login/uploads would not work. |
| 4 | High | Functionality / content | Public pages still show the literal token **`CONTENT_REQUIRED`**: `/services`, `/products`, and **15** infrastructure project narratives. Unacceptable for a brand launch crawl. |
| 5 | High | Ops / backup | No written database backup/PITR procedure, media (R2) backup/versioning strategy, or recovery drill — only a one-word “backups” mention in architecture docs. |
| 6 | Medium→High | Legal | `/privacy`, `/terms`, `/cookies` remain “pending legal review” stubs — launch risk for a live corporate site. |

### Fixed during this audit

| ID | Issue | Fix |
| --- | --- | --- |
| LAUNCH-01 | Private resume storage only fail-closed when `APP_ENV === "production"`, so Vercel’s default (`NODE_ENV=production`, `APP_ENV` unset) could write to ephemeral `.uploads/` | Use `isProductionRuntime()` (same as Turnstile / rate limits). Test added. |

### What is in good shape (code)

- Production `npm run build`, `tsc --noEmit`, ESLint, **156** unit tests (after LAUNCH-01) — pass on this branch.
- Auth (Argon2id, DB sessions), role checks, Zod server actions, resume magic-byte checks, security headers (CSP/HSTS/XFO), `/api/contact` → 410.
- SEO plumbing: metadata, canonicals, sitemap, robots, JSON-LD.
- Performance audit items largely closed (hero mobile denied, AVIF/WebP, asset sync, caching headers).
- Responsive audit: prior High issues fixed (0/210 overflow in that pass).
- Vercel wiring present: `website/vercel.json`, `build:vercel` (sync → generate → migrate deploy → next build).
- Git hygiene: `.env.local` ignored; no passwords in current `prisma.config.ts`.

---

## Architecture

| Check | Result | Notes |
| --- | --- | --- |
| Production build | PASS | `next build` succeeds |
| TypeScript | PASS | `tsc --noEmit` |
| Lint | PASS | `eslint .` |
| Unit tests | PASS | 156 / 156 after LAUNCH-01 |
| Dependencies | WARNING | `npm audit --omit=dev`: 4 high (Prisma transitive `deepmerge-ts`, `mysql2`). App uses PostgreSQL; track upgrades — not a runtime MySQL path |
| Database | PASS (code) | Prisma 7 + `pg` adapter; migrations present; runtime requires env URL |
| Prisma on Vercel | PASS (config) | generate on install/build; migrate on `build:vercel` |

---

## Security

| Check | Result | Notes |
| --- | --- | --- |
| Authentication | PASS (code) | Argon2id, httpOnly cookie, open-redirect hardened |
| Authorization | PASS (code) | Role gates in admin layout + actions; export = SUPER_ADMIN |
| Rate limiting | PASS (code) | Fail-closed in production runtime without Upstash |
| Input validation | PASS | Zod strict schemas + sanitize/spam/honeypot |
| File uploads | PASS (after LAUNCH-01) | MIME/magic, size cap, private keys, path traversal blocked; prod requires R2 |
| Headers | PASS | CSP, HSTS, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy |
| Secrets | PASS (repo HEAD) | `.env*` ignored; examples empty; history still has old local Postgres fallback (`8b8d3b4`) — treat as Medium if repo is public |
| API protection | PASS | Legacy contact API 410; private downloads HMAC-bound |

**Do not go live** without `APP_ENV=production` (never leave Production on `preview`), strong `AUTH_SECRET`, Turnstile, Upstash, and R2.

---

## Functionality

| Check | Result | Notes |
| --- | --- | --- |
| Pages / navigation | PASS (local QA) | Prior production QA: 95 crawl pass |
| Forms | PASS (code + local QA) | Contact / product / career; needs live Turnstile + mail + R2 |
| Database | PASS (local) | Needs Neon Production |
| Excel export | PASS (code) | SUPER_ADMIN only |
| Admin | PASS (code) | Middleware cookie gate + layout session |
| Blogs | PASS (code + QA) | CMS + revalidation |
| Career applications | PASS (code) | Needs R2 in production |
| Public copy | **FAIL** | `CONTENT_REQUIRED` on services, products, 15 infra projects |

---

## SEO

| Check | Result | Notes |
| --- | --- | --- |
| Metadata | PASS | Catalog + OG/Twitter |
| Sitemap | PASS | Static + projects + products + published posts |
| Robots | PASS | Blocks admin/login/api/private/design-system |
| Canonicals | PASS (code) | Must match final public origin after DNS |
| Structured data | PASS | Org, WebSite, Article, Product, Service |

Residual: legal stubs; placeholder copy if indexed.

---

## Performance

| Check | Result | Notes |
| --- | --- | --- |
| Images | PASS | AVIF/WebP; referenced-only sync |
| Videos | PASS | Desktop hero in-view; mobile poster-only; unused loops gitignored |
| JS / fonts / caching | PASS / residual | Framer scoped; Candara still TTF (subset to woff2 later); asset cache headers + ISR |

---

## Responsive

| Check | Result | Notes |
| --- | --- | --- |
| Mobile / tablet / desktop | PASS (prior audit) | Prior High overflows/targets fixed; re-verify on hosted Production |

---

## Deployment

| Check | Result | Notes |
| --- | --- | --- |
| Vercel config | PASS (repo) | Root `website`, `build:vercel`, region `bom1` |
| Vercel Production live | **FAIL** | Not deployed / not verified in this audit |
| PostgreSQL (Neon) | **FAIL** (ops) | Not confirmed provisioned for Production |
| Cloudflare (R2 / Turnstile) | **FAIL** (ops) | Required keys not verified live |
| Domain / HTTPS | **FAIL** | DNS deliberately unchanged |
| Environment variables | **FAIL** (ops) | Matrix documented; Production values not confirmed set |

---

## Backup

| Check | Result | Notes |
| --- | --- | --- |
| Database backup strategy | **FAIL** | No PITR/snapshot/retention/restore runbook |
| Media backup strategy | **FAIL** | No R2 versioning / cross-region / restore procedure |
| Git repository | PASS | Remote GitHub; hygiene on `github-prep` |
| Recovery procedure | PARTIAL | Vercel Instant Rollback documented; DB/media restore missing |

---

## Remaining actions (before READY)

1. **Content:** Remove or replace every public `CONTENT_REQUIRED` string (services, products, 15 infrastructure project bodies). Prefer real approved copy or omit sections.
2. **Legal:** Replace privacy/terms/cookies stubs after legal review.
3. **Neon:** Create Production DB; set `DATABASE_URL` (pooled) + `DIRECT_URL` (direct) on Vercel Production.
4. **Vercel:** Fill entire Production env matrix (`docs/vercel-production.md` §2), set `APP_ENV=production`, Node 20.x, root `website`.
5. **Secrets:** `AUTH_SECRET` ≥ 32 chars; Turnstile site+secret; Upstash REST; Resend; full R2 public+private.
6. **Deploy once** to Production (or Preview with Production-like secrets) and confirm build logs: sync → generate → migrate deploy → next build.
7. **Bootstrap:** One-shot `admin:create`; remove `ADMIN_PASSWORD` afterward.
8. **Smoke:** Contact + career resume + login rate limit + enquiry email + admin export on the deployed host.
9. **Backup runbook:** Neon PITR/schedule + restore drill; R2 versioning/replication; document RTO/RPO.
10. **DNS cutover (separate window):** Cloudflare → Vercel; update `NEXT_PUBLIC_APP_URL` / `AUTH_URL`; re-deploy; verify HTTPS.
11. **Optional:** Upgrade Prisma to clear transitive `npm audit` highs; consider history purge of old local Postgres URL if the repo is public.

---

## Evidence commands (this audit)

```text
npm run typecheck   → exit 0
npm run lint        → exit 0
npm test            → 156 pass (after LAUNCH-01)
npm run build       → exit 0
npm audit --omit=dev → 4 high (Prisma transitive), 0 critical
```

Local production QA report (`docs/production-qa.md`) remains valid for **local** `next start` behaviour; it does not close Vercel, DNS, backups, or public `CONTENT_REQUIRED` content.
