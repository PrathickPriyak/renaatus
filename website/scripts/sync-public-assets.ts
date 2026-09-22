import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import {
  extractAssetKeysFromSource,
  shouldPublishAsset,
} from "../src/lib/performance/public-assets";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SOURCE = path.join(ROOT, "assets");
const DEST = path.join(ROOT, "website/public/assets");
const SCAN_DIRS = [path.join(ROOT, "website/src"), path.join(ROOT, "website/prisma")];

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

async function collectReferencedAssetKeys(scanDirs: string[]): Promise<Set<string>> {
  const keys = new Set<string>();
  for (const dir of scanDirs) {
    let files: string[] = [];
    try {
      files = await walkFiles(dir);
    } catch {
      continue;
    }
    for (const file of files) {
      if (!/\.(ts|tsx|js|jsx|json|md)$/.test(file)) {
        continue;
      }
      const source = await readFile(file, "utf8");
      for (const key of extractAssetKeysFromSource(source)) {
        keys.add(key);
      }
    }
  }
  return keys;
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const referenced = await collectReferencedAssetKeys(SCAN_DIRS);
  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });

  let copied = 0;
  let missing = 0;
  let skipped = 0;

  for (const key of [...referenced].sort()) {
    if (!shouldPublishAsset(key, referenced)) {
      skipped += 1;
      continue;
    }
    const from = path.join(SOURCE, key);
    if (!(await pathExists(from))) {
      missing += 1;
      console.warn(`Skipping missing referenced asset: ${key}`);
      continue;
    }
    const to = path.join(DEST, key);
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: false });
    copied += 1;
  }

  console.log(
    `Synced ${copied} referenced public assets -> website/public/assets (${skipped} denied, ${missing} missing)`,
  );
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
