import type { Metadata } from "next";
import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Register",
  description: "Register to run or walk in the Coach Arena 5K on October 18, 2026.",
};

export default function RegisterPage() {
  return (
    <main id="main-content">
      <section className="bg-[#090909] py-14 text-white md:py-20">
        <div className="shell">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a12]">
            Sunday · October 18 · 10:00 AM
          </p>
          <h1 className="display-type mt-4 max-w-4xl text-6xl leading-[0.86] md:text-8xl">
            Join the starting line.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Registration is a simple two-step process: donate the required $20
            through GoFundMe, then send us your participant details.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Before you register</p>
            <ol className="mt-7 grid gap-7">
              <li className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="display-type flex h-10 w-10 items-center justify-center bg-[#ff5a12] text-xl">1</span>
                <div>
                  <p className="display-type text-2xl">Donate $20 or more</p>
                  <p className="mt-2 text-sm leading-6 text-[#5d5952]">
                    Use the official GoFundMe. Remember the donor name exactly as
                    it appears there.
                  </p>
                  <a
                    className="mt-4 inline-block border-b-2 border-black pb-1 font-bold"
                    href={siteConfig.goFundMeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open GoFundMe ↗
                  </a>
                </div>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="display-type flex h-10 w-10 items-center justify-center bg-black text-xl text-white">2</span>
                <div>
                  <p className="display-type text-2xl">Complete this form</p>
                  <p className="mt-2 text-sm leading-6 text-[#5d5952]">
                    We’ll match your donor name and email you when your entry is
                    confirmed.
                  </p>
                </div>
              </li>
            </ol>
            <div className="mt-9 border border-black/20 bg-[#fffdf8] p-5 text-sm leading-6">
              <p className="font-bold">Adults only for this registration.</p>
              <p className="mt-2 text-[#5d5952]">
                Have a question or need to change an entry? Email{" "}
                <a className="font-semibold underline" href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>
                .
              </p>
            </div>
          </aside>

          <div className="border-2 border-black bg-[#fffdf8] p-6 shadow-[8px_8px_0_#ff5a12] md:p-10">
            <div className="mb-9 border-b border-black/20 pb-7">
              <p className="eyebrow">Participant details</p>
              <h2 className="display-type mt-4 text-4xl md:text-5xl">Race registration</h2>
              <p className="mt-3 text-sm text-[#5d5952]">All fields are required unless marked optional.</p>
            </div>
            <RegistrationForm />
          </div>
        </div>
      </section>

      <section className="bg-[#ff5a12] py-10 text-center">
        <p className="font-semibold">
          Donating without racing?{" "}
          <a className="border-b-2 border-black font-black" href={siteConfig.goFundMeUrl} target="_blank" rel="noreferrer">
            Go straight to the fundraiser.
          </a>
        </p>
        <Link className="sr-only" href="/">Return home</Link>
      </section>
    </main>
  );
}
