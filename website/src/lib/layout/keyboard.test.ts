import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = path.resolve(import.meta.dirname, "../../..");

function readSrc(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

describe("keyboard access on public chrome", () => {
  it("exposes a skip link that stays on screen when focused", () => {
    const header = readSrc("src/design-system/components/site-header.tsx");
    assert.match(header, /Skip to content/);
    assert.match(header, /focus:fixed/);
  });

  it("returns keyboard focus to the menu button when the overlay closes", () => {
    const menu = readSrc("src/design-system/components/mobile-menu.tsx");
    assert.match(menu, /buttonRef/);
    assert.match(menu, /buttonRef\?\.current\?\.focus/);
  });

  it("treats project country filters as toggle buttons, not unimplemented tabs", () => {
    const infra = readSrc("src/components/marketing/InfrastructureGrid.tsx");
    assert.equal(infra.includes('role="tablist"'), false);
    assert.match(infra, /aria-pressed/);
  });
});
