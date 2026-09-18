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
| `npm run db:migrate` | Create/apply migrations (needs `DATABASE_URL`) |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:studio` | Prisma Studio |

## Environment

See `.env.example`. Required for database work: `DATABASE_URL` (and `DIRECT_URL` for Neon migrations). Other services are optional until those features are wired.

## Conventions

- `APP_ENV=development|preview|production` plus `NODE_ENV`
- Database access through `getDb()` in `src/lib/db.ts`
- Structured JSON logs via `src/lib/logger.ts` (PII redacted)
- Public errors from `src/lib/errors.ts` — no internal details to clients
- Zod schemas in `src/lib/validations/`
- Shared domain types in `src/types/`
