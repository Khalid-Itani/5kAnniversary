import Link from "next/link";

const goFundMeUrl = "https://gofund.me/c089732d7";

export function Footer() {
  return (
    <footer className="bg-[#090909] pb-24 pt-14 text-white md:pb-10">
      <div className="shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display-type text-4xl text-[#ff5a12]">Once a Tiger,</p>
          <p className="display-type text-4xl">always a Tiger.</p>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
            A community-organized 5K honoring Coach Robert Arena and supporting
            the next generation of Hudson County students.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            Get involved
          </p>
          <div className="grid gap-3 text-sm font-semibold">
            <Link href="/register">Register to run or walk</Link>
            <a href={goFundMeUrl} target="_blank" rel="noreferrer">
              Donate on GoFundMe
            </a>
            <Link href="/businesses">Business participation</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            Contact
          </p>
          <div className="grid gap-3 text-sm font-semibold">
            <a href="mailto:5kyearrun@gmail.com">5kyearrun@gmail.com</a>
            <a href="tel:+12015351131">201-535-1131</a>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="shell mt-12 border-t border-white/15 pt-5 text-xs text-white/60">
        © 2026 Coach Arena 5K. Jersey City, New Jersey.
      </div>
    </footer>
  );
}
