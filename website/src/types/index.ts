export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: string };

export type Pagination = {
  cursor: string | null;
  limit: number;
};
