import { z } from "zod";

const trimmedText = (label: string, maximum = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maximum, `${label} is too long.`);

export const registrationSchema = z.object({
  firstName: trimmedText("First name", 80),
  lastName: trimmedText("Last name", 80),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  ageOnRaceDay: z.coerce
    .number<number>()
    .int("Enter your age as a whole number.")
    .min(18, "Registration is currently limited to adults age 18 and older.")
    .max(120, "Enter a valid age."),
  city: trimmedText("City", 120),
  participationType: z.enum(["run", "walk"], {
    error: "Choose run or walk.",
  }),
  referralSource: z.string().trim().max(200, "Please shorten this response."),
  donorName: trimmedText("GoFundMe donor name", 160),
  amountClaimed: z.coerce
    .number<number>()
    .min(20, "A donation of at least $20 is required to enter."),
  emailUpdates: z.boolean(),
  website: z.string().max(0, "Unable to submit this form."),
});

export const businessInquirySchema = z.object({
  businessName: trimmedText("Business name", 160),
  contactName: trimmedText("Contact name", 160),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(40, "Enter a shorter phone number."),
  city: z.string().trim().max(120, "City is too long."),
  interestType: z.enum(
    ["cash_sponsor", "food_drink", "products_merch", "prize_gift_card", "event_table", "other"],
    { error: "Choose how you would like to participate." },
  ),
  message: trimmedText("Message", 1500),
  website: z.string().max(0, "Unable to submit this form."),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type BusinessInquiryInput = z.infer<typeof businessInquirySchema>;

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function firstValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Check the form and try again.";
}
