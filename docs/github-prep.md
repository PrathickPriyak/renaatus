# GitHub preparation

Audit of the Renaatus repo before a public GitHub push. This does not rewrite history.

## Findings

| Area | Status |
| --- | --- |
| `.gitignore` | Ignores `.env*`, `node_modules`, `.next`, `website/public/assets`, `website/generated`, `.uploads`, unused fonts/icons/loop videos, dumps, PEM/P12/key files |
| Environment files | `website/.env.example` tracked (empty values). `website/.env.local` **gitignored** and never in git history |
| Secrets in HEAD | Hardcoded local Postgres username/password **removed** from `prisma.config.ts`. Prisma CLI reads `DATABASE_URL` / `DIRECT_URL`, or a password-less placeholder for `prisma generate` |
| Secrets in history | The local Postgres fallback remains in older commits (`8b8d3b4`). Optional history rewrite is documented below — **do not run it unless you intend a force-push** |
| Large unused assets | `hero-mobile.mp4` (~18 MB), `about-loop.mp4`, `loading.mp4`, `assets/fonts/`, `assets/icons/` untracked. `hero-desktop.mp4` stays (used on the homepage) |
| Build artifacts | `.next`, `node_modules`, `website/generated` ignored and untracked |
| Private uploads | `website/.uploads/` ignored (local resume objects) |
| Private documents | `assets/documents/` empty except `.gitkeep`; PDFs gitignored |
| Credentials | No PEM/key/P12 files. No live API keys in tracked source |

## Do not commit

- `.env`, `.env.local`
- `DATABASE_URL` / `AUTH_SECRET` / Resend / R2 / Turnstile / Upstash values
- `website/.uploads/` (private resumes)
- `website/public/assets/` (generated copy of `/assets`)
- `website/node_modules/`, `website/.next/`, `website/generated/`
- Unused loop videos, Font Awesome, icon dumps, SharePoint PDFs

## Exact Git commands (safe)

Inspect what would be committed:

```bash
cd /path/to/renaatus
git status
git check-ignore -v website/.env.local website/.uploads website/.next website/node_modules
git ls-files | rg -i '\.env|credential|\.pem|\.uploads|node_modules|\.next'
```

Confirm no secrets in the index:

```bash
git grep -n -I -E 'postgres:postgres|AKIA[0-9A-Z]{16}|BEGIN PRIVATE KEY|sk_live_|re_[A-Za-z0-9]{20,}' HEAD || true
```

Stage hygiene (already applied on `cursor/github-prep-0b8e`):

```bash
git add .gitignore website/.gitignore website/prisma.config.ts website/prisma/datasource-url.ts website/prisma/datasource-url.test.ts website/package.json assets/README.md docs/github-prep.md
git rm --cached -f \
  assets/videos/hero-mobile.mp4 \
  assets/videos/about-loop.mp4 \
  assets/videos/loading.mp4 \
  assets/fonts/candara.ttf \
  assets/fonts/candaral.ttf \
  assets/fonts/fa-brands-400.woff2 \
  assets/fonts/fa-regular-400.woff2 \
  assets/fonts/fa-solid-900.woff2 \
  assets/icons/axis-pattern.png \
  assets/icons/bg-pattern-02.svg \
  assets/icons/bg.svg \
  assets/icons/cursor.png \
  assets/icons/dotted.svg \
  assets/icons/stat-r1.png \
  assets/icons/stat-r2.png \
  assets/icons/stat-r3.png \
  assets/icons/stat-r4.png
git commit -m "Stop tracking secrets fallbacks and unused brand-pack binaries."
git push -u origin cursor/github-prep-0b8e
```

`git rm --cached` untracks files; it does **not** delete them from disk.

## Do not run (destructive)

These rewrite history or discard work. They are listed only so they are not used by accident:

```bash
# DO NOT RUN — discards uncommitted work
git reset --hard
git clean -fdx

# DO NOT RUN — rewrites every commit and requires force-push
git filter-repo --invert-paths --path website/.env.local
git filter-branch
git push --force
```

If you ever need to purge the old local Postgres fallback from history, use `git filter-repo` on a backup clone, then a coordinated force-push — not on the shared production-qa stack.

## Clone checklist

```bash
git clone git@github.com:PrathickPriyak/renaatus.git
cd renaatus/website
cp .env.example .env.local
# Fill DATABASE_URL, AUTH_SECRET, and other values locally. Never commit this file.
npm install
npm run dev
```
