This is a [Next.js](https://nextjs.org) App Router project for the Renaatus corporate site.

## Stack

Next.js, TypeScript (strict), Tailwind CSS, ESLint, Prettier, Prisma, PostgreSQL, Zod, Framer Motion, and shadcn/ui primitives.

## Getting started

```bash
cp .env.example .env.local
# Fill local values only. Never use production credentials.

npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). `npm run sync-assets` copies `/assets` into `public/assets` for local development. Do not copy private documents into `public/` in production.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | Lint + typecheck |
| `npm run format` | Prettier write |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:validate` | Validate `prisma/schema.prisma` |
| `npm run db:migrate` | Create/apply development migrations (needs `DATABASE_URL`) |
| `npm run db:deploy` | Apply pending migrations without reset (use this in production) |
| `npm run db:status` | Show migration status |
| `npm run db:check` | Ping PostgreSQL through Prisma |
| `npm run db:seed` | Development-only seed (refuses production) |
| `npm run db:studio` | Prisma Studio |
| `npm test` | Enquiry validation, security, and database tests |

Do not run `prisma migrate reset` or `prisma db push --force-reset` against a shared or production database.

## Environment

See `.env.example`. Database credentials (`DATABASE_URL`, `DIRECT_URL`) are server-side only — never `NEXT_PUBLIC_*`, never committed. Neon: pooled URL in `DATABASE_URL`, direct URL in `DIRECT_URL` for migrations. Other services are optional until those features are wired.

Development seed inserts the approved journal stories (CMRL Central Tower and SAP go-live), a News category, tags, an editor user without a password, and the Renacon product. It will not run when `APP_ENV` or `NODE_ENV` is `production`.

## Conventions

- `APP_ENV=development|preview|production` plus `NODE_ENV`
- Database access through `getDb()` in `src/lib/db.ts`
- Structured JSON logs via `src/lib/logger.ts` (PII redacted)
- Public errors from `src/lib/errors.ts` — no internal details to clients
- Enquiry forms use Server Actions (`src/server/actions/enquiries.ts`). The browser never writes to PostgreSQL.
- Zod schemas in `src/lib/validations/`
- Shared domain types in `src/types/`
- `npm test` runs Node’s test runner against validation, security, and enquiry persistence
