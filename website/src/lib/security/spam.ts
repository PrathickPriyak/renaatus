const LINK_PATTERN = /https?:\/\/[^\s]+/gi;

export function isSpamEnquiry(input: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const links = input.message.match(LINK_PATTERN) ?? [];
  if (links.length >= 5) {
    return true;
  }

  if (/https?:\/\//i.test(input.name)) {
    return true;
  }

  const compact = input.message.replace(/\s+/g, "");
  if (compact.length > 40 && /^(.)\1+$/.test(compact)) {
    return true;
  }

  return false;
}
