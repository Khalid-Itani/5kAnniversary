import { afterEach, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it("does not silently connect an unconfigured preview to the production database", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", undefined);
  vi.resetModules();
  const config = await import("./config");
  expect(config.hasSupabaseConfig()).toBe(false);
  expect(config.supabaseUrl).toBe("");
});

it("uses the database explicitly configured for this environment", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "test-key");
  vi.resetModules();
  const config = await import("./config");
  expect(config.hasSupabaseConfig()).toBe(true);
  expect(config.supabaseUrl).toBe("http://127.0.0.1:54321");
});
