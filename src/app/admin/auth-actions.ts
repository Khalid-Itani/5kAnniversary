"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUserClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";
import type { FormState } from "@/lib/form-state";

export async function sendAdminMagicLink(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (email !== siteConfig.adminEmail.toLowerCase()) {
    return { status: "error", message: "This email is not authorized for the admin area." };
  }

  const supabase = await createUserClient();
  if (!supabase) {
    return { status: "error", message: "Admin authentication is not configured yet." };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteConfig.siteUrl}/auth/callback?next=/admin`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("Admin magic link failed", error.message);
    return { status: "error", message: "The sign-in link could not be sent. Please try again." };
  }

  return { status: "success", message: `A secure sign-in link was sent to ${email}.` };
}

async function requireAdmin() {
  const userClient = await createUserClient();
  if (!userClient) throw new Error("Supabase is not configured.");

  const { data } = await userClient.auth.getUser();
  if (data.user?.email?.toLowerCase() !== siteConfig.adminEmail.toLowerCase()) {
    throw new Error("Unauthorized");
  }
  return userClient;
}

export async function updateDonationStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["pending", "verified", "not_found", "refunded"].includes(status)) {
    throw new Error("Invalid update.");
  }

  const { error } = await supabase
    .from("registrations")
    .update({
      donation_status: status,
      donation_verified_at: status === "verified" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error("Unable to update this registration.");
  revalidatePath("/admin");
}

export async function updateBusinessStatus(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "confirmed", "declined"].includes(status)) {
    throw new Error("Invalid update.");
  }

  const { error } = await supabase.from("business_inquiries").update({ status }).eq("id", id);
  if (error) throw new Error("Unable to update this inquiry.");
  revalidatePath("/admin");
}

export async function signOutAdmin() {
  const supabase = await createUserClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
