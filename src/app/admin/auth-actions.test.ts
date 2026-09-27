import { beforeEach, describe, expect, it, vi } from "vitest";

const { signInWithOtp } = vi.hoisted(() => ({ signInWithOtp: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createUserClient: async () => ({ auth: { signInWithOtp } }),
}));
vi.mock("@/lib/site", () => ({
  siteConfig: { adminEmail: "5kyearrun@gmail.com", siteUrl: "https://coacharena5k.com" },
}));
import { sendAdminMagicLink } from "./auth-actions";

describe("admin magic links", () => {
  beforeEach(() => signInWithOtp.mockReset().mockResolvedValue({ error: null }));
  it("only sends to the authorized organizer and uses the configured callback", async () => {
    const form = new FormData();
    form.set("email", " 5KYearRun@gmail.com ");
    expect((await sendAdminMagicLink({ status: "idle", message: "" }, form)).status).toBe("success");
    expect(signInWithOtp).toHaveBeenCalledWith({ email: "5kyearrun@gmail.com", options: {
      emailRedirectTo: "https://coacharena5k.com/auth/callback?next=/admin", shouldCreateUser: true,
    } });
  });
  it("rejects other addresses before calling the email provider", async () => {
    const form = new FormData();
    form.set("email", "someone@example.com");
    expect((await sendAdminMagicLink({ status: "idle", message: "" }, form)).status).toBe("error");
    expect(signInWithOtp).not.toHaveBeenCalled();
  });
});
