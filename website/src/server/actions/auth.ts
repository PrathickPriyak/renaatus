"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { authenticateStaff, safeAdminNextPath, staffLoginSchema } from "@/lib/auth/login";
import {
  destroyUserSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { readClientIp } from "@/lib/security/ip";
import { runAction } from "@/server/safe-action";
import type { LoginFormState } from "@/types";

export async function signInStaff(
  _previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = staffLoginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    next: String(formData.get("next") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && fieldErrors[key] === undefined) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const result = await runAction("staff_sign_in", async () => {
    const headerList = await headers();
    return authenticateStaff(getDb(), {
      email: parsed.data.email,
      password: parsed.data.password,
      ip: readClientIp(headerList),
    });
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    result.data.token,
    sessionCookieOptions(result.data.expires),
  );
  redirect(safeAdminNextPath(parsed.data.next));
}

export async function signOutStaff(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await destroyUserSession(getDb(), token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
