"use client";

import { useEffect } from "react";
import { publicEnv } from "@/lib/env/public";

const SCRIPT_ID = "cf-turnstile-script";

export function TurnstileField() {
  const siteKey = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div className="cf-turnstile mt-2" data-sitekey={siteKey} />;
}
