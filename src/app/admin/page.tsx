import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  signOutAdmin,
  updateBusinessStatus,
  updateDonationStatus,
} from "@/app/admin/auth-actions";
import { createUserClient } from "@/lib/supabase/server";
import { hasSupabaseConfig, siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age_on_race_day: number;
  city: string;
  participation_type: string;
  donor_name: string;
  amount_claimed: number;
  donation_status: string;
  email_status: string;
  created_at: string;
};

type BusinessInquiry = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  interest_type: string;
  message: string;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  if (!hasSupabaseConfig()) {
    return (
      <main id="main-content" className="py-16 md:py-24">
        <div className="shell max-w-2xl border-2 border-black bg-[#fffdf8] p-8 shadow-[8px_8px_0_#ff5a12]">
          <p className="eyebrow">Setup required</p>
          <h1 className="display-type mt-4 text-5xl">Admin data is not connected</h1>
          <p className="mt-5 leading-7 text-[#5d5952]">
            Add the Supabase variables documented in <code>.env.example</code>, then
            restart the development server. No secret values belong in source control.
          </p>
        </div>
      </main>
    );
  }

  const userClient = await createUserClient();
  if (!userClient) throw new Error("Supabase is not configured.");
  const { data: userData } = await userClient.auth.getUser();
  if (userData.user?.email?.toLowerCase() !== siteConfig.adminEmail.toLowerCase()) {
    redirect("/admin/login");
  }

  const [registrationResult, inquiryResult] = await Promise.all([
    userClient.from("registrations").select("*").order("created_at", { ascending: false }),
    userClient.from("business_inquiries").select("*").order("created_at", { ascending: false }),
  ]);

  const registrations = (registrationResult.data ?? []) as Registration[];
  const inquiries = (inquiryResult.data ?? []) as BusinessInquiry[];
  const verified = registrations.filter((item) => item.donation_status === "verified").length;
  const pending = registrations.filter((item) => item.donation_status === "pending").length;
  const claimed = registrations.reduce((total, item) => total + Number(item.amount_claimed), 0);

  return (
    <main id="main-content" className="min-h-screen bg-[#ece7dd] py-12">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Organizer dashboard</p>
            <h1 className="display-type mt-3 text-5xl md:text-6xl">Race operations</h1>
          </div>
          <div className="flex gap-3">
            <a className="button-secondary !min-h-11" href="/admin/export">Export CSV</a>
            <form action={signOutAdmin}>
              <button className="button-secondary !min-h-11" type="submit">Sign out</button>
            </form>
          </div>
        </div>

        <section className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Registration totals">
          {[
            ["Registrations", registrations.length],
            ["Verified", verified],
            ["Pending", pending],
            ["Claimed giving", `$${claimed.toFixed(2)}`],
          ].map(([label, value]) => (
            <div className="border-2 border-black bg-[#fffdf8] p-5" key={label}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5d5952]">{label}</p>
              <p className="display-type mt-3 text-4xl">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display-type text-4xl">Participants</h2>
            <p className="text-sm text-[#5d5952]">{registrations.length} total</p>
          </div>
          <div className="mt-4 overflow-x-auto border-2 border-black bg-white">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-black text-white">
                <tr>{["Participant", "Race", "Donor", "Claimed", "Email", "Received", "Verification"].map((heading) => <th className="p-3" key={heading}>{heading}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-black/15">
                {registrations.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3"><strong>{item.first_name} {item.last_name}</strong><br /><span className="text-[#5d5952]">{item.email} · {item.city} · age {item.age_on_race_day}</span></td>
                    <td className="p-3 capitalize">{item.participation_type}</td>
                    <td className="p-3">{item.donor_name}</td>
                    <td className="p-3 font-semibold">${Number(item.amount_claimed).toFixed(2)}</td>
                    <td className="p-3 capitalize">{item.email_status}</td>
                    <td className="p-3">{new Date(item.created_at).toLocaleDateString("en-US")}</td>
                    <td className="p-3">
                      <form action={updateDonationStatus} className="flex gap-2">
                        <input type="hidden" name="id" value={item.id} />
                        <select className="min-h-10 border border-black px-2" name="status" defaultValue={item.donation_status} aria-label={`Donation status for ${item.first_name} ${item.last_name}`}>
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="not_found">Not found</option>
                          <option value="refunded">Refunded</option>
                        </select>
                        <button className="min-h-10 bg-black px-3 font-bold text-white" type="submit">Save</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 ? <tr><td className="p-6 text-[#5d5952]" colSpan={7}>No registrations yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display-type text-4xl">Business inquiries</h2>
            <p className="text-sm text-[#5d5952]">{inquiries.length} total</p>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {inquiries.map((item) => (
              <article className="border-2 border-black bg-[#fffdf8] p-5" key={item.id}>
                <div className="flex justify-between gap-4">
                  <div><h3 className="display-type text-2xl">{item.business_name}</h3><p className="text-sm text-[#5d5952]">{item.contact_name} · {item.email}</p></div>
                  <span className="h-fit bg-[#ff5a12] px-2 py-1 text-xs font-black uppercase">{item.interest_type.replaceAll("_", " ")}</span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6">{item.message}</p>
                <form action={updateBusinessStatus} className="mt-5 flex gap-2 border-t border-black/15 pt-4">
                  <input type="hidden" name="id" value={item.id} />
                  <select className="min-h-10 flex-1 border border-black px-2" name="status" defaultValue={item.status} aria-label={`Status for ${item.business_name}`}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button className="min-h-10 bg-black px-3 font-bold text-white" type="submit">Save</button>
                </form>
              </article>
            ))}
            {inquiries.length === 0 ? <p className="text-[#5d5952]">No business inquiries yet.</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
