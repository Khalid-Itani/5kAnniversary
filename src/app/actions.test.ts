import { beforeEach, describe, expect, it, vi } from "vitest";

const { insert, notify } = vi.hoisted(() => ({ insert: vi.fn(), notify: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createPublicSubmissionClient: () => ({ from: () => ({ insert }) }),
}));
vi.mock("@/lib/email", () => ({ sendBusinessInquiryEmail: notify, sendRegistrationReceivedEmail: vi.fn() }));
import { submitBusinessInquiry } from "./actions";

function inquiryForm() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ businessName: "Test Cafe", contactName: "Jamie",
    email: "jamie@example.com", phone: "", city: "", interestType: "food_drink",
    message: "We can provide water", website: "" })) data.set(key, value);
  return data;
}

describe("business inquiry submission", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    insert.mockReset().mockResolvedValue({ error: null });
    notify.mockReset().mockResolvedValue({ status: "sent" });
  });
  it("saves the inquiry before notifying the team", async () => {
    const result = await submitBusinessInquiry({ status: "idle", message: "" }, inquiryForm());
    expect(result.status).toBe("success");
    expect(insert).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledOnce();
    expect(insert.mock.invocationCallOrder[0]).toBeLessThan(notify.mock.invocationCallOrder[0]);
  });
  it("does not notify when validation or saving fails", async () => {
    const invalid = inquiryForm();
    invalid.set("email", "invalid");
    expect((await submitBusinessInquiry({ status: "idle", message: "" }, invalid)).status).toBe("error");
    expect(insert).not.toHaveBeenCalled();
    vi.spyOn(console, "error").mockImplementation(() => {});
    insert.mockResolvedValue({ error: { code: "42501" } });
    expect((await submitBusinessInquiry({ status: "idle", message: "" }, inquiryForm())).status).toBe("error");
    expect(notify).not.toHaveBeenCalled();
  });
  it("keeps a saved submission successful when notification fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    notify.mockResolvedValue({ status: "failed" });
    expect((await submitBusinessInquiry({ status: "idle", message: "" }, inquiryForm())).status).toBe("success");
    expect(console.error).toHaveBeenCalledWith("Business inquiry notification not sent", "failed");
  });
});
