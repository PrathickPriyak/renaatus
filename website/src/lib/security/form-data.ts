import { ValidationError } from "@/lib/errors";

const MAX_FIELD_CHARS = 8_000;

function isInternalFormKey(key: string): boolean {
  return key.startsWith("$ACTION") || key.startsWith("next-action") || key.startsWith("__");
}

export function readAllowedFormFields(
  formData: FormData,
  allowedKeys: readonly string[],
): Record<string, string> {
  const allowed = new Set(allowedKeys);
  const fields: Record<string, string> = {};
  const seen = new Set<string>();

  for (const key of formData.keys()) {
    if (isInternalFormKey(key)) {
      continue;
    }
    if (!allowed.has(key)) {
      throw new ValidationError("Invalid request.");
    }
    seen.add(key);
  }

  for (const key of seen) {
    const value = formData.get(key);
    if (value instanceof File) {
      continue;
    }
    if (typeof value !== "string") {
      throw new ValidationError("Invalid request.");
    }
    if (value.length > MAX_FIELD_CHARS) {
      throw new ValidationError("Invalid request.");
    }
    fields[key] = value;
  }

  return fields;
}

export function readOptionalFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (!value || typeof value === "string") {
    return null;
  }
  if (value.size === 0 && value.name === "") {
    return null;
  }
  return value;
}
