import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { resolve } from "node:path";

describe("vercel production build wiring", () => {
  it("runs asset sync, prisma generate, migrate deploy, then next build", () => {
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as {
      scripts: Record<string, string>;
      dependencies: Record<string, string>;
      engines: { node: string };
    };

    assert.match(pkg.scripts["build:vercel"] ?? "", /sync-assets/);
    assert.match(pkg.scripts["build:vercel"] ?? "", /prisma generate/);
    assert.match(pkg.scripts["build:vercel"] ?? "", /prisma migrate deploy/);
    assert.match(pkg.scripts["build:vercel"] ?? "", /next build/);
    assert.ok(pkg.dependencies.prisma, "prisma must be a runtime dependency for Vercel builds");
    assert.ok(pkg.dependencies.tsx, "tsx must be a runtime dependency for sync-assets on Vercel");
    assert.match(pkg.engines.node, /20/);
  });

  it("configures Vercel to use the website root build command", () => {
    const vercel = JSON.parse(
      readFileSync(resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as {
      framework: string;
      buildCommand: string;
      installCommand: string;
      regions: string[];
    };

    assert.equal(vercel.framework, "nextjs");
    assert.equal(vercel.buildCommand, "npm run build:vercel");
    assert.equal(vercel.installCommand, "npm ci");
    assert.deepEqual(vercel.regions, ["bom1"]);
  });

  it("does not embed secrets in vercel.json or .env.example", () => {
    const vercel = readFileSync(resolve(process.cwd(), "vercel.json"), "utf8");
    const example = readFileSync(resolve(process.cwd(), ".env.example"), "utf8");
    const secretPattern =
      /postgres:postgres|sk_live_|re_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|BEGIN PRIVATE KEY/;
    assert.equal(secretPattern.test(vercel), false);
    assert.equal(secretPattern.test(example), false);
    assert.match(example, /^DATABASE_URL=\s*$/m);
    assert.match(example, /^AUTH_SECRET=\s*$/m);
    assert.match(example, /^RESEND_API_KEY=\s*$/m);
    assert.match(example, /^R2_SECRET_ACCESS_KEY=\s*$/m);
  });
});
