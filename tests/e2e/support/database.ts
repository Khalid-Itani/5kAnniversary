import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { BrowserContext } from "@playwright/test";

export function database() {
  let runtime;
  try { runtime = JSON.parse(readFileSync(".test-stack/runtime.json", "utf8")); }
  catch { throw new Error("Run npm run test:stack:start first (Docker required). Full tests never use production."); }
  if (new URL(runtime.API_URL).hostname !== "127.0.0.1") throw new Error("Only the disposable local database is allowed.");
  return {
    runtime,
    admin: createClient(runtime.API_URL, runtime.SERVICE_ROLE_KEY, { auth: { persistSession: false } }),
    anon: createClient(runtime.API_URL, runtime.ANON_KEY, { auth: { persistSession: false } }),
  };
}

export async function signIn(context: BrowserContext, email = "5kyearrun@gmail.com") {
  const { runtime, admin } = database();
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;
  const pending: Array<Parameters<BrowserContext["addCookies"]>[0][number]> = [];
  const client = createServerClient(runtime.API_URL, runtime.ANON_KEY, {
    cookies: {
      getAll: () => [],
      setAll: cookies => {
        for (const { name, value } of cookies) pending.push({ name, value, domain: "127.0.0.1", path: "/" });
      },
    },
  });
  const verified = await client.auth.verifyOtp({ type: "email", token_hash: data.properties.hashed_token });
  if (verified.error) throw verified.error;
  await context.addCookies(pending);
  return client;
}
