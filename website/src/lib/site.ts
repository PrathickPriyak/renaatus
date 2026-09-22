import { publicEnv } from "@/lib/env/public";

export const siteConfig = {
  name: "Renaatus",
  legalName: "Renaatus Projects Pvt Ltd",
  description:
    "Renaatus Projects is a premier EPC, luxury realty, and AAC manufacturing group with a 50-year construction legacy across India, Maldives, and Mauritius.",
  url: publicEnv.NEXT_PUBLIC_APP_URL,
} as const;
