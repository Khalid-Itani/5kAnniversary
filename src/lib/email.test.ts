import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("resend", () => ({
  Resend: class { emails = { send }; },
}));
vi.mock("@/lib/site", () => ({
  siteConfig: { contactEmail: "5kyearrun@gmail.com", siteUrl: "https://coacharena5k.com" },
}));
import { sendBusinessInquiryEmail } from "./email";

const inquiry = {
  businessName: "Hudson Cafe",
  contactName: "Jamie Rivera",
  email: "jamie@example.com",
  phone: "201-555-0100",
  city: "Jersey City",
  interestType: "food_drink" as const,
  message: "We can provide water.\nPlease contact us.",
  website: "",
};

describe("business inquiry notification", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("EMAIL_FROM", "Coach Arena <notifications@coacharena5k.com>");
    send.mockReset().mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("sends all business details to the fixed team mailbox with contact reply-to", async () => {
    expect(await sendBusinessInquiryEmail(inquiry)).toEqual({ status: "sent" });
    const message = send.mock.calls[0][0];
    expect(message.to).toBe("5kyearrun@gmail.com");
    expect(message.replyTo).toBe(inquiry.email);
    for (const value of [inquiry.businessName, inquiry.contactName, inquiry.email,
      inquiry.phone, inquiry.city, "food drink", inquiry.message, "https://coacharena5k.com/admin"]) {
      expect(message.text).toContain(value);
    }
  });

  it("does not try to send without provider configuration", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await sendBusinessInquiryEmail(inquiry)).toEqual({ status: "skipped" });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports provider rejection and network failure without throwing", async () => {
    send.mockResolvedValueOnce({ error: { message: "Unavailable" } });
    expect(await sendBusinessInquiryEmail(inquiry)).toEqual({ status: "failed" });
    send.mockRejectedValueOnce(new Error("Network unavailable"));
    expect(await sendBusinessInquiryEmail(inquiry)).toEqual({ status: "failed" });
  });
});
