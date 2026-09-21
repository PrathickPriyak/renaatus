export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code: string; fieldErrors?: Record<string, string> };

export type Pagination = {
  cursor: string | null;
  limit: number;
};

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialEnquiryFormState: EnquiryFormState = { status: "idle" };
