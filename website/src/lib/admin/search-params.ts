export function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function toURLSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    const next = firstSearchParam(value)?.trim();
    if (next) {
      params.set(key, next);
    }
  }
  return params;
}

export function enquiryListHref(filters: {
  q?: string;
  kind?: string;
  status?: string;
  sort?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.kind) {
    params.set("kind", filters.kind);
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.sort && filters.sort !== "-createdAt") {
    params.set("sort", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }
  const query = params.toString();
  return query ? `/admin/enquiries?${query}` : "/admin/enquiries";
}
