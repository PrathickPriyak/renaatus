# Vercel production deployment

Checklist and required configuration for deploying the Renaatus Next.js app.

**Do not deploy until every Production row below is filled in the Vercel dashboard.**  
**Do not change Cloudflare DNS in this phase.**  
**Never paste secret values into Git, PR descriptions, or this file.**

Architecture:

```text
GitHub → Vercel → Next.js → PostgreSQL (Neon)
                          → Media (Cloudflare R2)
                          → Email (Resend)
                          → Rate limit (Upstash)
                          → Turnstile (Cloudflare)
Cloudflare DNS → (later) orange-cloud proxy to Vercel
```

---

## 1. Required Vercel project settings (show before first deploy)

Configure these in the Vercel project UI (or CLI) **before** promoting Production:

| Setting | Required value |
| --- | --- |
| Git repository | `PrathickPriyak/renaatus` |
| Root Directory | `website` |
| Framework Preset | Next.js |
| Node.js Version | **20.x** (LTS) |
| Install Command | `npm ci` (from `website/vercel.json`) |
| Build Command | `npm run build:vercel` |
| Output Directory | leave default (Next.js) |
| Region | `bom1` (Mumbai) unless you choose another primary region |
| Production Branch | `main` (only after the PR stack is merged) |
| Preview | enabled for PRs |

`website/vercel.json` already pins install/build/region for the `website` root.

### Build pipeline (`npm run build:vercel`)

1. `npm run sync-assets` — copies **referenced** files from repo `/assets` into `website/public/assets`
2. `prisma generate` — writes `website/generated/prisma` (gitignored; required at build)
3. `prisma migrate deploy` — applies pending migrations (needs `DATABASE_URL` / `DIRECT_URL`)
4. `next build` — production Next.js build

Local `npm run build` does **not** run `migrate deploy` (safer for day-to-day work). Use `npm run db:deploy` explicitly when you intend to migrate.

`postinstall` also runs `prisma generate`. Generate uses a **password-less placeholder URL** when env is unset so install can succeed; migrations and the running app still require a real database URL.

---

## 2. Environment variable matrix

Set variables in **Vercel → Project → Settings → Environment Variables**.  
Mark each for Production / Preview / Development as shown. Values stay in Vercel only.

### Public (safe to expose to the browser)

| Name | Production | Preview | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Required | Required | Canonical site origin, e.g. `https://www.example.com` (no trailing slash). Preview may use the Vercel URL. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Required | Recommended | Cloudflare Turnstile site key |

### Server-only (never `NEXT_PUBLIC_`)

| Name | Production | Preview | Notes |
| --- | --- | --- | --- |
| `APP_ENV` | `production` | `preview` | Drives fail-closed Turnstile, rate limits, private storage |
| `NODE_ENV` | set by Vercel (`production`) | set by Vercel | Do not override |
| `DATABASE_URL` | Required | Required | Neon **pooled** URL (`sslmode=require`). Runtime Prisma Client + `pg` adapter |
| `DIRECT_URL` | Required | Required | Neon **direct** (non-pooled) URL for `prisma migrate deploy` |
| `AUTH_SECRET` | Required | Required | `openssl rand -base64 32` — min 32 characters. Signs sessions / resume tokens / IP hashes |
| `AUTH_URL` | Required | Required | Same origin as the deployment (match `NEXT_PUBLIC_APP_URL` in production) |
| `RESEND_API_KEY` | Required | Optional | Enquiry notification email |
| `ENQUIRY_NOTIFY_EMAIL` | Required | Optional | Inbox for new enquiries |
| `R2_ACCOUNT_ID` | Required | Optional* | Cloudflare account id |
| `R2_ACCESS_KEY_ID` | Required | Optional* | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | Required | Optional* | R2 API token secret |
| `R2_BUCKET_PUBLIC` | Required | Optional* | Public media bucket name |
| `R2_BUCKET_PRIVATE` | Required | Optional* | Private resumes bucket name |
| `R2_PUBLIC_BASE_URL` | Required | Optional* | Public object base URL (HTTPS), no trailing slash |
| `TURNSTILE_SECRET_KEY` | Required | Recommended | Production **fails closed** without this |
| `UPSTASH_REDIS_REST_URL` | Required | Recommended | Production login/enquiry limits **fail closed** without Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Required | Recommended | Pair with the REST URL |
| `LOG_LEVEL` | Optional (`info`) | Optional (`debug`) | Structured JSON logs |

\*Preview without R2 falls back to local disk under `website/.uploads`, which is **ephemeral on Vercel** — do not rely on it for resume QA on Preview. Prefer configuring R2 for Preview too, or test uploads only in Production after go-live.

### Do not set permanently on Vercel

| Name | Why |
| --- | --- |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | One-shot bootstrap via `npm run admin:create` with env injected locally or a one-off Vercel CLI run. Remove after the first `SUPER_ADMIN` exists. |
| Any production secret in Git / `.env.example` | Examples stay empty |

### Public vs private rule

- Browser-visible: only `NEXT_PUBLIC_*`
- Database passwords, `AUTH_SECRET`, Resend, R2 secrets, Turnstile secret, Upstash token: **server only**

---

## 3. PostgreSQL (Neon) + Prisma on Vercel

1. Create a Neon project (region close to `bom1` if possible).
2. Copy the **pooled** connection string → `DATABASE_URL`.
3. Copy the **direct** connection string → `DIRECT_URL`.
4. Confirm both include TLS (`sslmode=require` or Neon’s equivalent).
5. Optional: Neon ↔ Vercel integration for Preview database branches.
6. First Production build runs `prisma migrate deploy` and applies migrations under `website/prisma/migrations/` (currently `20260918123000_init`, `20260921115400_indexes_timestamps_media_author`, `20260922040600_blog_cms_fields`).

Runtime: `src/lib/db.ts` uses `@prisma/adapter-pg` + `DATABASE_URL` (no credentials in `schema.prisma`).

**Never** run on production:

```bash
prisma migrate reset
prisma db push --force-reset
npm run db:seed   # seed refuses production APP_ENV/NODE_ENV
```

---

## 4. Authentication

1. Generate `AUTH_SECRET` offline (`openssl rand -base64 32`).
2. Set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the production origin.
3. After the first successful Production deploy + migrate, create the first admin **once**:

```bash
cd website
# Inject ADMIN_* and DATABASE_URL via your shell / Vercel env pull — do not commit them
npm run admin:create
```

4. Unset `ADMIN_PASSWORD` everywhere after success.
5. Sign in at `/login` and confirm `/admin` redirects when logged out.

---

## 5. Email (Resend)

1. Create a Resend API key; set `RESEND_API_KEY`.
2. Set `ENQUIRY_NOTIFY_EMAIL` to the staff inbox.
3. Verify the sending domain in Resend (separate from Cloudflare DNS cutover — can use Resend’s DNS records on a subdomain before apex cutover).
4. Submit a contact enquiry on Preview/Production and confirm delivery.

---

## 6. Media storage (Cloudflare R2)

1. Create buckets (suggested names from architecture): public web assets + private resumes.
2. Create an R2 API token with object read/write on those buckets only.
3. Set all `R2_*` variables (server-only except the public base URL hostname used by `next/image`).
4. Ensure `R2_PUBLIC_BASE_URL` matches a hostname allowed by `next.config.ts` (`*.r2.dev` / `*.cloudflarestorage.com` or add your custom media host).
5. Confirm career resume upload stores under the private bucket and admin download uses signed tokens.

---

## 7. Turnstile + Upstash (production fail-closed)

Without these in Production, forms and login return safe 503 / rate-limit errors instead of silently skipping checks.

1. Cloudflare Turnstile widget → site key (`NEXT_PUBLIC_…`) + secret.
2. Upstash Redis REST URL + token.
3. Smoke-test contact + login after deploy.

---

## 8. Cloudflare DNS (later — do not modify yet)

When ready for cutover (separate change window):

1. Keep Vercel deployment on `*.vercel.app` until validated.
2. In Cloudflare DNS, point apex/`www` to Vercel per Vercel’s docs (A/CNAME or CNAME flattening).
3. Enable orange-cloud proxy only after TLS and Vercel domain verification succeed.
4. Update `NEXT_PUBLIC_APP_URL` / `AUTH_URL` to the public hostname and redeploy.

**This checklist does not change DNS.**

---

## 9. Pre-deploy verification (no production push required)

```bash
cd website
cp .env.example .env.local   # fill local non-production values only
npm ci
npm test
npm run build                # local production build (no migrate deploy)
npm run db:deploy            # only against a disposable or intended database
```

Confirm:

- [ ] Root Directory = `website`
- [ ] Build Command = `npm run build:vercel`
- [ ] All Production env names from §2 are set in Vercel (values never committed)
- [ ] `prisma generate` works with no password embedded in repo source
- [ ] `website/.env.local` is gitignored
- [ ] No secrets in `git grep` of tracked files
- [ ] First admin plan exists (one-shot `admin:create`)
- [ ] DNS left unchanged until explicit cutover

---

## 10. First Production deploy sequence (manual)

Only after §1–§2 are complete in the Vercel UI:

1. Merge the approved GitHub PR stack to the branch Vercel uses for Production (`main`).
2. Trigger **one** Production deployment from the Vercel dashboard (or GitHub merge).
3. Watch build logs for: sync-assets → prisma generate → migrate deploy → next build.
4. Open `https://<deployment>/` and `/robots.txt`, `/sitemap.xml`.
5. Confirm `/login` → `/admin` gate.
6. Run `admin:create` once if no staff user exists.
7. Submit a test enquiry; confirm DB row + Resend email.
8. Only then schedule Cloudflare DNS cutover (§8).

---

## 11. Rollback notes

- Vercel Instant Rollback to the previous Production deployment.
- Database: migrations are forward-only; prepare a compensating migration for bad schema changes — do not `migrate reset` production.
- Secrets: rotate any credential that was ever pasted into chat, tickets, or Git.

---

## Related docs

- `docs/github-prep.md` — ignore rules and secret hygiene
- `docs/architecture/PRODUCTION.md` — target architecture
- `website/.env.example` — empty templates for local copies
- `website/README.md` — local commands
