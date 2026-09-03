export const siteConfig = {
  name: "Coach Arena 5K",
  adminEmail: process.env.ADMIN_EMAIL ?? "5kyearrun@gmail.com",
  contactEmail: "5kyearrun@gmail.com",
  contactPhone: "201-535-1131",
  goFundMeUrl: "https://gofund.me/c089732d7",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
}
