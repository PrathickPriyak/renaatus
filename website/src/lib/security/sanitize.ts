const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

function stripMarkup(value: string): string {
  let current = value;
  let previous = "";
  while (current !== previous) {
    previous = current;
    current = current.replace(/<script\b[\s\S]*?<\/script>/gi, "");
    current = current.replace(/<style\b[\s\S]*?<\/style>/gi, "");
    current = current.replace(/<[^>]+>/g, " ");
  }
  return current.replace(/[<>]/g, "");
}

export function sanitizePlainText(
  value: string,
  options: { multiline?: boolean } = {},
): string {
  let next = value.replace(/\0/g, "");
  next = decodeBasicEntities(next);
  next = stripMarkup(next);
  next = next.replace(CONTROL_CHARS, "");

  if (options.multiline) {
    next = next.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    next = next.replace(/[ \t]+\n/g, "\n");
    next = next.replace(/\n{3,}/g, "\n\n");
    next = next.replace(/[^\S\n]{2,}/g, " ");
    return next.trim();
  }

  return next.replace(/\s+/g, " ").trim();
}

export function sanitizeEnquiryFields(
  fields: Record<string, string>,
): Record<string, string> {
  const multiline = new Set(["message", "body"]);
  const untouched = new Set(["website", "turnstileToken", "cf-turnstile-response"]);
  const next: Record<string, string> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (untouched.has(key)) {
      next[key] = value;
      continue;
    }
    next[key] = sanitizePlainText(value, { multiline: multiline.has(key) });
  }

  return next;
}
