"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { updateEnquiryStatus } from "@/lib/admin/enquiries";
import { getCurrentActor } from "@/lib/auth/current-actor";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { getDb } from "@/lib/db";
import { readClientIp } from "@/lib/security/ip";
import { runAction } from "@/server/safe-action";
import type { AdminFormState } from "@/types";
import type { EnquiryStatus } from "@/types/domain";

function isEnquiryStatus(value: string): value is EnquiryStatus {
  return ENQUIRY_STATUSES.includes(value as EnquiryStatus);
}

export async function changeEnquiryStatusAction(
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const enquiryId = String(formData.get("enquiryId") ?? "").trim();
  const statusValue = String(formData.get("status") ?? "").trim();
  if (!enquiryId || !isEnquiryStatus(statusValue)) {
    return {
      status: "error",
      message: "Choose a valid status.",
    };
  }

  const actor = await getCurrentActor();
  const headerList = await headers();
  const result = await runAction("enquiry_status_change", async () => {
    return updateEnquiryStatus(getDb(), actor, {
      enquiryId,
      status: statusValue,
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

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${enquiryId}`);
  return { status: "success", message: "Status updated." };
}
