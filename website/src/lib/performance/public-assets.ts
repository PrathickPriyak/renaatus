const DENY_PREFIXES = ["fonts/", "icons/", "documents/"] as const;

const DENY_FILES = [
  "videos/about-loop.mp4",
  "videos/loading.mp4",
] as const;

const ASSET_PATH_PATTERN = /(?:^|["'(=\s])(\/assets\/[A-Za-z0-9._\-/]+)/g;
const LOCAL_PUBLIC_MEDIA_KEY_PATTERN =
  /["']((?:images|videos)\/[A-Za-z0-9._\-/]+\.(?:avif|gif|jpe?g|mp4|png|svg|webm|webp))["']/gi;

export function normalizeAssetKey(value: string): string {
  return value
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+/, "")
    .replace(/^assets\//, "");
}

export function extractAssetKeysFromSource(source: string): string[] {
  const keys = new Set<string>();
  for (const match of source.matchAll(ASSET_PATH_PATTERN)) {
    const raw = match[1];
    if (!raw) {
      continue;
    }
    keys.add(normalizeAssetKey(raw));
  }
  for (const match of source.matchAll(LOCAL_PUBLIC_MEDIA_KEY_PATTERN)) {
    const raw = match[1];
    if (!raw) {
      continue;
    }
    keys.add(normalizeAssetKey(raw));
  }
  return [...keys].sort();
}

export function isDeniedPublicAsset(relativePath: string): boolean {
  const key = normalizeAssetKey(relativePath);
  if ((DENY_FILES as readonly string[]).includes(key)) {
    return true;
  }
  return DENY_PREFIXES.some((prefix) => key === prefix.slice(0, -1) || key.startsWith(prefix));
}

export function shouldPublishAsset(
  relativePath: string,
  referenced: Iterable<string>,
): boolean {
  const key = normalizeAssetKey(relativePath);
  if (isDeniedPublicAsset(key)) {
    return false;
  }
  const set = new Set([...referenced].map(normalizeAssetKey));
  return set.has(key);
}
