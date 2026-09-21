export type Result<T, E = string> = { ok: true; data: T } | { ok: false; error: E };

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

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialLoginFormState: LoginFormState = { status: "idle" };

export type AdminFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialAdminFormState: AdminFormState = { status: "idle" };
