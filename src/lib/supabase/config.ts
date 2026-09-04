const defaultSupabaseUrl = "https://jifsjcavxsxahafuwjgi.supabase.co";
const defaultSupabasePublishableKey =
  "sb_publishable_8XqD0Ytj-qftsTxd9Gm7Ew_PlSE0hEW";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl;

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  defaultSupabasePublishableKey;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}
