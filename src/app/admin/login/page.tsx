import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Admin sign in" };

export default function AdminLoginPage() {
  return (
    <main id="main-content" className="py-16 md:py-24">
      <div className="shell max-w-lg border-2 border-black bg-[#fffdf8] p-7 shadow-[8px_8px_0_#ff5a12] md:p-10">
        <p className="eyebrow">Private access</p>
        <h1 className="display-type mt-4 text-5xl">Organizer sign in</h1>
        <p className="mt-4 text-sm leading-6 text-[#5d5952]">
          No password is stored for this site. A one-time sign-in link will be sent
          to the authorized organizer email.
        </p>
        <AdminLoginForm defaultEmail={siteConfig.adminEmail} />
      </div>
    </main>
  );
}
