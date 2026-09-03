import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main id="main-content" className="py-16 md:py-24">
      <article className="shell max-w-3xl">
        <p className="eyebrow">Privacy</p>
        <h1 className="display-type mt-5 text-6xl md:text-7xl">How we use your information</h1>
        <div className="mt-10 space-y-7 text-base leading-8 text-[#4f4b45]">
          <p>
            The Coach Arena 5K team collects the information you submit to manage
            event registration, manually verify the required GoFundMe donation,
            coordinate business participation, and send event-related messages.
          </p>
          <section>
            <h2 className="display-type text-2xl text-black">What we collect</h2>
            <p className="mt-2">
              Participant details may include your name, email, age on race day,
              city, run/walk choice, referral source, donor name, claimed donation
              amount, and email preference. Business inquiries include the contact
              and proposal details submitted in the form.
            </p>
          </section>
          <section>
            <h2 className="display-type text-2xl text-black">How it is handled</h2>
            <p className="mt-2">
              Authorized event organizers can view this information. We do not sell
              it. GoFundMe processes donations on its own platform under its own
              privacy terms; this website does not collect payment-card details.
            </p>
          </section>
          <section>
            <h2 className="display-type text-2xl text-black">Your choices</h2>
            <p className="mt-2">
              Event logistics and registration messages may still be sent when
              needed to operate the race. Optional scholarship or future-event
              updates are sent only when you select that preference. To update or
              remove your information, email{" "}
              <a className="font-semibold underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </section>
          <p className="text-sm">Last updated September 3, 2026.</p>
        </div>
      </article>
    </main>
  );
}
