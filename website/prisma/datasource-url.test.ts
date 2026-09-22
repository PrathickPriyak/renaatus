import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { resolve } from "node:path";
import {
  PRISMA_CLI_PLACEHOLDER_URL,
  resolvePrismaDatasourceUrl,
} from "./datasource-url";

describe("prisma datasource url", () => {
  it("prefers DIRECT_URL then DATABASE_URL and never falls back to a password", () => {
    assert.equal(
      resolvePrismaDatasourceUrl({ DATABASE_URL: "postgresql://local/app" }),
      "postgresql://local/app",
    );
    assert.equal(
      resolvePrismaDatasourceUrl({
        DIRECT_URL: "postgresql://direct/app",
        DATABASE_URL: "postgresql://pooled/app",
      }),
      "postgresql://direct/app",
    );
    assert.equal(resolvePrismaDatasourceUrl({}), PRISMA_CLI_PLACEHOLDER_URL);
    assert.equal(
      resolvePrismaDatasourceUrl({ DATABASE_URL: "   " }),
      PRISMA_CLI_PLACEHOLDER_URL,
    );
    assert.equal(PRISMA_CLI_PLACEHOLDER_URL.includes("postgres:postgres"), false);
    assert.equal(/postgresql:\/\/[^:\s]+:[^@\s]+@/.test(PRISMA_CLI_PLACEHOLDER_URL), false);
  });

  it("does not embed a postgres password in prisma.config.ts", () => {
    const source = readFileSync(resolve(process.cwd(), "prisma.config.ts"), "utf8");
    assert.equal(source.includes("postgres:postgres"), false);
    assert.equal(/postgresql:\/\/[^:\s]+:[^@\s]+@/.test(source), false);
  });
});
