import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

// Public submissions must not inherit an organizer's authenticated cookies.
// This client keeps the existing narrow anonymous INSERT grants and RLS policies.
export function createPublicSubmissionClient() {
  if (!supabaseUrl || !supabasePublishableKey) return null;
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function createUserClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies. Auth actions and the
          // callback route perform the writes when a session changes.
        }
      },
    },
  });
}
