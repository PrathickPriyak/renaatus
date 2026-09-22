import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = path.resolve(import.meta.dirname, "../../..");

function readSrc(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

describe("responsive layout contracts", () => {
  it("shrinks display type on 320px screens without lowering the desktop max", () => {
    const css = readSrc("src/app/globals.css");
    assert.match(css, /--text-display:\s*clamp\(2\.75rem,\s*6\.5vw,\s*5\.75rem\)/);
    assert.match(css, /overflow-wrap:\s*anywhere/);
  });

  it("does not clip homepage hero copy when the viewport is shorter than the type", () => {
    const hero = readSrc("src/components/home/hero.tsx");
    assert.equal(/min-h-\[100dvh\] overflow-hidden/.test(hero), false);
    assert.match(hero, /overflow-hidden/);
  });

  it("does not clip inner page hero copy", () => {
    const pageHero = readSrc("src/components/marketing/PageHero.tsx");
    assert.equal(/min-h-\[min\(36rem,72dvh\)\] overflow-hidden/.test(pageHero), false);
  });

  it("keeps compact buttons at a 44px touch target", () => {
    const button = readSrc("src/design-system/components/button.tsx");
    assert.match(button, /sm: "min-h-11 h-11 /);
    assert.match(button, /md: "min-h-11 h-11 /);
  });

  it("keeps filter chips tall enough to tap", () => {
    const chips = readSrc("src/lib/layout/chips.ts");
    assert.match(chips, /min-h-11/);
    const projects = readSrc("src/app/(site)/projects/page.tsx");
    const infra = readSrc("src/components/marketing/InfrastructureGrid.tsx");
    const blog = readSrc("src/app/(site)/blog/page.tsx");
    assert.match(projects, /filterChipClass/);
    assert.match(infra, /filterChipClass/);
    assert.match(blog, /filterChipClass/);
  });

  it("keeps the brand lockup tall enough to tap", () => {
    const logo = readSrc("src/design-system/components/logo.tsx");
    assert.match(logo, /inline-flex min-h-11 items-center gap-3/);
  });
});
