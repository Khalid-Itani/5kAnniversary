import { createAdminClient } from "@/lib/supabase/admin";
import { createUserClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

function csvCell(value: unknown) {
  const normalized = String(value ?? "").replaceAll('"', '""');
  return `"${normalized}"`;
}

export async function GET() {
  const userClient = await createUserClient();
  const { data } = (await userClient?.auth.getUser()) ?? { data: { user: null } };
  if (data.user?.email?.toLowerCase() !== siteConfig.adminEmail.toLowerCase()) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) return new Response("Not configured", { status: 503 });
  const { data: rows, error } = await supabase
    .from("registrations")
    .select("first_name,last_name,email,age_on_race_day,city,participation_type,referral_source,donor_name,amount_claimed,donation_status,email_updates,email_status,created_at")
    .order("created_at", { ascending: false });

  if (error) return new Response("Unable to export", { status: 500 });
  const headers = ["First name", "Last name", "Email", "Age", "City", "Run/Walk", "Referral", "Donor name", "Amount claimed", "Donation status", "Email updates", "Email status", "Registered at"];
  const keys = ["first_name", "last_name", "email", "age_on_race_day", "city", "participation_type", "referral_source", "donor_name", "amount_claimed", "donation_status", "email_updates", "email_status", "created_at"];
  const csv = [headers.map(csvCell).join(","), ...(rows ?? []).map((row) => keys.map((key) => csvCell(row[key as keyof typeof row])).join(","))].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="coach-arena-5k-registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
