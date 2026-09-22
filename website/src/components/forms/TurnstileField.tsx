"use client";

import Script from "next/script";
import { publicEnv } from "@/lib/env/public";

const SCRIPT_ID = "cf-turnstile-script";

export function TurnstileField() {
  const siteKey = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return null;
  }

  return (
    <>
      <Script
        id={SCRIPT_ID}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="cf-turnstile mt-2" data-sitekey={siteKey} />
    </>
  );
}
