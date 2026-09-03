import type { Metadata } from "next";
import { BusinessForm } from "@/components/business-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Businesses",
  description: "Support or participate in the Coach Arena 5K as a local business.",
};

const opportunities = [
  "Make a cash contribution",
  "Offer food or drinks",
  "Donate products or merchandise",
  "Provide a prize or gift card",
  "Host an event-day table",
];

export default function BusinessesPage() {
  return (
    <main id="main-content">
      <section className="bg-[#ff5a12] py-16 md:py-24">
        <div className="shell grid gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em]">Community partners</p>
            <h1 className="display-type mt-4 max-w-4xl text-6xl leading-[0.85] md:text-8xl">
              Local support. Lasting impact.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8">
            Help us create a welcoming race day and expand the Robert Arena
            Scholarship. There are no fixed sponsor packages—we’ll shape the right
            fit with you directly.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <aside>
            <p className="eyebrow">Ways to take part</p>
            <ul className="mt-7 divide-y divide-black/20 border-y border-black/20">
              {opportunities.map((item, index) => (
                <li className="flex gap-4 py-4" key={item}>
                  <span className="display-type text-[#a93400]">0{index + 1}</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 text-sm leading-6 text-[#5d5952]">
              Prefer to talk first? Contact us at{" "}
              <a className="font-semibold underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>{" "}
              or <a className="font-semibold underline" href="tel:+12015351131">{siteConfig.contactPhone}</a>.
            </p>
          </aside>

          <div className="border-2 border-black bg-[#fffdf8] p-6 shadow-[8px_8px_0_#090909] md:p-10">
            <p className="eyebrow">Tell us your idea</p>
            <h2 className="display-type mt-4 text-4xl md:text-5xl">Business interest form</h2>
            <p className="mt-3 mb-9 text-sm leading-6 text-[#5d5952]">
              This is an expression of interest, not a binding sponsorship agreement.
            </p>
            <BusinessForm />
          </div>
        </div>
      </section>
    </main>
  );
}
