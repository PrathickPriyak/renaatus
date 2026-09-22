# Renaatus security audit

Date: 22 September 2026  
Scope: website application (auth, admin, enquiries, media, APIs, Prisma, env, HTTP, dependencies)  
This is not a claim that the application is impossible to hack.

## Findings

| ID | Severity | Affected area | Explanation | Recommended fix | Status |
| --- | --- | --- | --- | --- | --- |
| SEC-01 | High | JSON-LD / XSS | `JSON.stringify` inside `<script type="application/ld+json">` can close the HTML script tag if a journal title or other field contains `</script>`. A published post could XSS every visitor. | Serialize JSON-LD with `<` escaped to `\u003c`. | **Fixed** |
| SEC-02 | High | Rate limiting / authentication | `readClientIp` trusted the first `X-Forwarded-For` hop, which clients can spoof. That bypassed login and enquiry rate limits. | Prefer `x-vercel-forwarded-for`, `cf-connecting-ip`, and `x-real-ip`. | **Fixed** |
| SEC-03 | High | Authentication | Unknown emails returned immediately without Argon2, enabling user enumeration by timing and cheaper password spraying. | Run a dummy Argon2 verify before rejecting missing users; rate-limit by email as well as IP. | **Fixed** |
| SEC-04 | High | Enquiries / production | Turnstile verification was skipped whenever `TURNSTILE_SECRET_KEY` was unset, including production. | Fail closed in production if Turnstile is not configured. | **Fixed** |
| SEC-05 | High | Rate limiting / production | Login and enquiry limits used in-memory maps when Upstash was missing. On serverless this does not hold across instances. | Fail closed in production without Upstash. | **Fixed** |
| SEC-06 | High | Database / privacy | IP hashes used a hardcoded salt when `AUTH_SECRET` was missing, so hashes could be reversed offline. | Refuse to hash IPs without `AUTH_SECRET`. | **Fixed** |
| SEC-07 | High | Journal XSS | Stored journal JSON was rendered without re-checking `javascript:` / `data:` hrefs. Markdown parsing already stripped them; stored JSON did not. | Re-sanitize hrefs in `asJournalDoc` and at render time. | **Fixed** |
| SEC-08 | Medium | HTTP | Missing CSP and HSTS. `X-Content-Type-Options`, `X-Frame-Options`, Referrer-Policy, and Permissions-Policy were already present. | Add CSP (with Turnstile exceptions) and HSTS. | **Fixed** |
| SEC-09 | Medium | Admin middleware | `/admin/enquiries/export` skipped the cookie-presence check. The route still authenticated in the handler. | Apply the same cookie gate as other `/admin` paths. | **Fixed** |
| SEC-10 | Medium | Sessions | `Secure` cookies were tied only to `NODE_ENV`, not `APP_ENV`. | Set `Secure` when either production flag is set; delete logout cookies with `path=/`. | **Fixed** |
| SEC-11 | Medium | Open redirect | `safeAdminNextPath` accepted any path starting with `/admin`, including `/administrator`. | Allow only `/admin` and `/admin/…`. | **Fixed** |
| SEC-12 | Medium | Dependencies | `npm audit` reports high issues in Prisma transitive deps (`deepmerge-ts`, `mysql2`). This app uses PostgreSQL, not MySQL. | Do not blindly upgrade Prisma. Track upstream; mysql2 is unused at runtime. | **Open** — no upgrade in this change |
| SEC-13 | Low | Sessions | Session tokens are stored in plaintext in PostgreSQL (high-entropy random). A DB dump is enough to hijack sessions until expiry (8 hours). | Hash tokens at rest (sha256) if the session table is ever exposed. | **Open** |
| SEC-14 | Low | Passwords | Admin passwords require 12 characters, hashed with Argon2id. No complexity or rotation policy. | Keep Argon2id; consider a longer minimum and breach checks later. | **Open** |
| SEC-15 | Low | Export CSRF | Enquiry export is a credentialed GET. SameSite=Lax cookies are sent on top-level navigations; the file downloads in the admin’s browser, not to an attacker. | Could move export to POST. Low practical impact. | **Open** |
| SEC-16 | Info | CSP | CSP allows `'unsafe-inline'` and `'unsafe-eval'` because Next.js still emits inline scripts. This is defense-in-depth, not a strict nonce CSP. | Adopt nonces when the Next.js setup supports them cleanly. | **Open** |

## Area notes

### 1. Authentication
Passwords use Argon2id. Sessions are random 32-byte tokens, httpOnly, SameSite=Lax, 8-hour expiry, stored in PostgreSQL. Middleware only checks cookie presence; `getCurrentActor()` validates the token against the database. Login is rate-limited by IP and email.

### 2. Authorization
Roles are `SUPER_ADMIN`, `EDITOR`, `VIEWER`. Server actions call `requireBlogEditor` / `requireEnquiryReader` / `requireExportActor`. Blog featured images must be `PUBLIC` media (cannot attach a private resume). Public blog queries only `PUBLISHED` posts. There is no end-user tenancy; staff share the enquiry inbox by design.

### 3. Input security
Enquiry fields are allowlisted, length-capped, HTML-stripped, and validated with Zod `strictObject`. Server actions catch unexpected fields. Journal links allow only `http(s)` and same-origin paths.

### 4. File upload security
Career resumes: PDF/DOCX only, magic-byte checks, zip inspection for DOCX, dangerous extension stripping, 5 MB cap, randomised `private/careers/…` keys, no public URL. Production refuses local disk writes without R2.

### 5. API security
`/api/contact` is gone (410). `/api/private-files/:token` requires a 15-minute HMAC token bound to media id + key, `PRIVATE` visibility, and `X-Robots-Tag`. JSON errors do not expose stack traces.

### 6. Database
Queries use Prisma parameterized APIs. `$queryRaw` appears only as `SELECT 1`. Credentials live in `DATABASE_URL`, not the schema. Enquiry `ipHash` is stored instead of raw IPs.

### 7. Environment
`.env` / `.env.*` are gitignored (`!.env.example`). Public env is limited to `NEXT_PUBLIC_*`. Logger redacts password/secret/token/email/phone keys.

### 8. HTTP security
Headers now include nosniff, DENY framing, strict-origin-when-cross-origin referrer, permissions policy, CSP, and HSTS. HTTPS is the deployment’s responsibility (Vercel/reverse proxy).

### 9. Dependencies
Four high npm audit issues are Prisma transitives (`deepmerge-ts` stack exhaustion, `mysql2` auth plugin). Not upgraded here because a Prisma bump can break the data layer and mysql2 is not used.

### 10. Admin
Layout redirects unauthenticated users. Export requires `SUPER_ADMIN`. Blog mutations require editor/super-admin. Viewers cannot manage posts or media. Private resume download URLs are signed, not raw keys.

## Production deploy checklist

Set all of these before going live:

- `AUTH_SECRET` (at least 32 characters)
- `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- `R2_*` private bucket for resumes
- `APP_ENV=production`
- `DATABASE_URL` pointing at PostgreSQL, never committed
