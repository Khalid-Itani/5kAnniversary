import { hasSupabaseConfig } from "@/lib/supabase/config";

const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const siteConfig = {
  name: "Coach Arena 5K",
  adminEmail: process.env.ADMIN_EMAIL ?? "5kyearrun@gmail.com",
  contactEmail: "5kyearrun@gmail.com",
  contactPhone: "201-535-1131",
  goFundMeUrl: "https://gofund.me/c089732d7",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelHost ? `https://${vercelHost}` : "http://localhost:3000"),
} as const;

export { hasSupabaseConfig };
