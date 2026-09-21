import { blankToUndefined, publicEnvSchema, type PublicEnv } from "@/lib/env/schema";

// Public env is limited to NEXT_PUBLIC_* keys. Database credentials stay on the server.

function readPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL:
      blankToUndefined(process.env.NEXT_PUBLIC_APP_URL) ?? "http://localhost:3000",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: blankToUndefined(
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    ),
  });

  if (!parsed.success) {
    throw new Error("Invalid public environment configuration.");
  }

  return parsed.data;
}

export const publicEnv = readPublicEnv();
