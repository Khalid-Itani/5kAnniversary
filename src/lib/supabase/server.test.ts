import { describe, expect, it, vi } from "vitest";

const { cookies, createClient, createServerClient } = vi.hoisted(() => ({
  cookies: vi.fn(() => { throw new Error("Organizer session must not be read"); }),
  createClient: vi.fn(() => ({ kind: "public" })),
  createServerClient: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));
vi.mock("@supabase/ssr", () => ({ createServerClient }));
vi.mock("@/lib/supabase/config", () => ({
  supabaseUrl: "https://example.supabase.co", supabasePublishableKey: "test-publishable-key",
}));
import { createPublicSubmissionClient } from "./server";

describe("public form database connection", () => {
  it("never inherits an admin session and disables session persistence", () => {
    expect(createPublicSubmissionClient()).toEqual({ kind: "public" });
    expect(cookies).not.toHaveBeenCalled();
    expect(createServerClient).not.toHaveBeenCalled();
    expect(createClient).toHaveBeenCalledWith("https://example.supabase.co", "test-publishable-key", {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  });
});
