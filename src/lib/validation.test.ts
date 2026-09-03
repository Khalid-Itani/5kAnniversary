import { describe, expect, it } from "vitest";
import { businessInquirySchema, registrationSchema } from "./validation";

const validRegistration = {
  firstName: "Isaac",
  lastName: "Martinez",
  email: "isaac@example.com",
  ageOnRaceDay: "25",
  city: "Jersey City",
  participationType: "run",
  referralSource: "Former teammate",
  donorName: "Isaac Martinez",
  amountClaimed: "20",
  emailUpdates: true,
  website: "",
};

describe("registrationSchema", () => {
  it("accepts a valid adult registration", () => {
    const result = registrationSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it("rejects participants under 18", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      ageOnRaceDay: "17",
    });
    expect(result.success).toBe(false);
  });

  it("requires the full $20 entry donation", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      amountClaimed: "19.99",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessInquirySchema", () => {
  it("accepts a complete business inquiry", () => {
    const result = businessInquirySchema.safeParse({
      businessName: "Hudson Cafe",
      contactName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "201-555-0100",
      city: "Jersey City",
      interestType: "food_drink",
      message: "We would like to provide water on race day.",
      website: "",
    });
    expect(result.success).toBe(true);
  });
});
