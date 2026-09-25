"use server";

import { sendBusinessInquiryEmail, sendRegistrationReceivedEmail } from "@/lib/email";
import { createPublicSubmissionClient } from "@/lib/supabase/server";
import {
  businessInquirySchema,
  firstValidationError,
  formDataToObject,
  registrationSchema,
} from "@/lib/validation";
import type { FormState } from "@/lib/form-state";

export async function registerParticipant(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registrationSchema.safeParse({
    ...formDataToObject(formData),
    emailUpdates: formData.get("emailUpdates") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: firstValidationError(parsed.error) };
  }

  const supabase = createPublicSubmissionClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Registration setup is not complete yet. Please try again soon.",
    };
  }

  const input = parsed.data;
  const { error } = await supabase.from("registrations").insert({
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email.toLowerCase(),
    age_on_race_day: input.ageOnRaceDay,
    city: input.city,
    participation_type: input.participationType,
    referral_source: input.referralSource || null,
    donor_name: input.donorName,
    amount_claimed: input.amountClaimed,
    email_updates: input.emailUpdates,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "That email is already registered. Contact us if you need to change your entry.",
      };
    }
    console.error("Registration insert failed", error.code);
    return { status: "error", message: "We could not save your registration. Please try again." };
  }

  const emailResult = await sendRegistrationReceivedEmail({
    email: input.email,
    firstName: input.firstName,
  });

  if (emailResult.status === "failed") {
    console.error("Registration confirmation email failed");
  }

  return {
    status: "success",
    message: "Registration received. We’ll verify your GoFundMe donation and email you with updates.",
  };
}

export async function submitBusinessInquiry(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = businessInquirySchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return { status: "error", message: firstValidationError(parsed.error) };
  }

  const supabase = createPublicSubmissionClient();
  if (!supabase) {
    return {
      status: "error",
      message: "The interest form is not connected yet. Please email 5kyearrun@gmail.com.",
    };
  }

  const input = parsed.data;
  const { error } = await supabase.from("business_inquiries").insert({
    business_name: input.businessName,
    contact_name: input.contactName,
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    city: input.city || null,
    interest_type: input.interestType,
    message: input.message,
  });

  if (error) {
    console.error("Business inquiry insert failed", error.code);
    return { status: "error", message: "We could not save your message. Please try again." };
  }

  const emailResult = await sendBusinessInquiryEmail(input);
  if (emailResult.status !== "sent") {
    console.error("Business inquiry notification not sent", emailResult.status);
  }

  return {
    status: "success",
    message: "Thanks for reaching out. Isaac’s team will follow up with you directly.",
  };
}
