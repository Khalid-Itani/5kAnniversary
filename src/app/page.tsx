import Image from "next/image";
import Link from "next/link";

const goFundMeUrl = "https://gofund.me/c089732d7";

const prizes = [
  { place: "1st", amount: "$200" },
  { place: "2nd", amount: "$150" },
  { place: "3rd", amount: "$100" },
  { place: "4th", amount: "$75" },
  { place: "5th", amount: "$50" },
  { place: "6th", amount: "$25" },
];

const faqs = [
  {
    question: "Do I have to run?",
    answer:
      "No. Runners and walkers are equally welcome. The same overall prizes apply to everyone who completes the course.",
  },
  {
    question: "How does the $20 entry work?",
    answer:
      "Donate at least $20 through the official GoFundMe, then enter the donor name on your registration. Our team will verify it manually before marking your entry confirmed.",
  },
  {
    question: "Can I donate without participating?",
    answer:
      "Absolutely. You can give any amount directly through GoFundMe without completing the race registration form.",
  },
  {
    question: "Who can register?",
    answer:
      "Registration is currently for adults age 18 and older. Event-day logistics will be emailed to registered participants as the race approaches.",
  },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="overflow-hidden bg-[#090909] text-white">
        <div className="shell grid min-h-[calc(100svh-5rem)] items-stretch lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative z-10 flex flex-col justify-center py-16 lg:py-24 lg:pr-16">
            <p className="mb-7 flex items-center gap-3 font-[family-name:var(--font-display)] text-sm font-extrabold uppercase tracking-[0.16em] text-[#ff5a12]">
              <span className="h-1 w-8 bg-[#ff5a12]" />
              October 18, 2026 · Jersey City
            </p>
            <h1 className="display-type max-w-4xl text-[clamp(4.8rem,18vw,10rem)] leading-[0.77]">
              Five years.
              <span className="block text-[#ff5a12]">One legacy.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/72 md:text-xl">
              Run or walk through Lincoln Park in honor of Coach Robert Arena—and
              help create scholarship opportunities for Hudson County students.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href="/register">
                Register for $20
              </Link>
              <a
                className="button-light"
                href={goFundMeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Donate only
              </a>
            </div>
            <p className="mt-5 text-xs leading-5 text-white/45">
              Registration is for participants age 18+. Donations are processed by
              GoFundMe and verified manually.
            </p>
          </div>

          <div className="relative min-h-[34rem] border-x border-white/15 lg:min-h-full lg:border-r lg:border-l">
            <Image
              src="/images/coach-arena.jpg"
              alt="Coach Robert Arena wearing his orange Snyder Track jacket"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between p-6 md:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff5a12]">
                  In memory of
                </p>
                <p className="display-type mt-1 text-4xl">Coach Robert Arena</p>
              </div>
              <p className="display-type text-5xl text-white/25">5K</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Event summary" className="bg-[#ff5a12] text-black">
        <div className="shell grid divide-y divide-black/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["When", "Sunday · 10:00 AM"],
            ["Where", "Lincoln Park · Jersey City"],
            ["Entry", "$20 minimum donation"],
          ].map(([label, value]) => (
            <div className="py-5 sm:px-6 first:pl-0 last:pr-0" key={label}>
              <p className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-black">
                {label}
              </p>
              <p className="display-type mt-1 text-xl md:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="reveal py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="eyebrow">Why we run</p>
            <p className="display-type mt-7 text-5xl leading-[0.92] md:text-7xl">
              More than a sport.
              <span className="block text-[#a93400]">More than a race.</span>
            </p>
          </div>
          <div className="max-w-2xl text-lg leading-8 text-[#4f4b45]">
            <p>
              Coach Robert Arena was a coach, mentor, and friend to the Snyder High
              School track community. When he passed away on October 18, 2021, his
              athletes felt the weight of that loss together.
            </p>
            <p className="mt-6">
              Exactly five years later, former athletes, families, neighbors, and
              new friends will gather to keep his memory moving forward. The race
              celebrates the bonds track created while raising money for the Robert
              Arena Scholarship.
            </p>
            <blockquote className="mt-10 border-l-4 border-[#ff5a12] pl-6 font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight text-black">
              “While we’re still here, let’s honor those we have lost and help
              those who come after us.”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-[#171717] py-20 text-white md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow !text-[#ff7a3f]">The scholarship</p>
            <h2 className="display-type mt-6 max-w-xl text-5xl leading-[0.9] md:text-7xl">
              Every step helps a student take theirs.
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-lg leading-8 text-white/68">
              After the $600 race prize pool, the remaining proceeds support high
              school students in Hudson County who plan to continue their academic
              and athletic careers in college. More participation means more help
              for the students who come next.
            </p>
            <div className="mt-9 grid grid-cols-2 gap-px bg-white/20">
              <div className="bg-[#171717] py-6 pr-5">
                <p className="display-type text-5xl text-[#ff5a12]">$5K</p>
                <p className="mt-2 text-sm text-white/55">Initial fundraising goal</p>
              </div>
              <div className="bg-[#171717] py-6 pl-5">
                <p className="display-type text-5xl text-[#ff5a12]">250</p>
                <p className="mt-2 text-sm text-white/55">Participants to reach it</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="course" className="reveal py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="eyebrow">The course</p>
              <h2 className="display-type mt-5 text-5xl md:text-7xl">Lincoln Park 5K</h2>
              <p className="mt-5 max-w-2xl leading-7 text-[#5d5952]">
                One measured 5K loop through Lincoln Park in Jersey City. A detailed
                event-day map with check-in, start, finish, and parking will replace
                this preview before race day.
              </p>
            </div>
            <a
              className="button-secondary"
              href="https://www.google.com/maps/search/?api=1&query=Lincoln+Park+1+County+Road+605+Jersey+City+NJ+07304"
              target="_blank"
              rel="noreferrer"
            >
              Open directions
            </a>
          </div>

          <figure className="mt-10 overflow-hidden border border-black/20 bg-white p-2 shadow-[8px_8px_0_#090909] md:p-3">
            <Image
              src="/images/course-map.jpg"
              alt="Preview map of the 5K loop through Lincoln Park"
              width={960}
              height={632}
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="h-auto w-full"
            />
            <figcaption className="flex flex-col gap-1 px-2 py-3 text-xs text-[#6b6862] sm:flex-row sm:justify-between">
              <span>Lincoln Park, 1 County Road 605, Jersey City, NJ 07304</span>
              <span>Course preview · final logistics forthcoming</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="prizes" className="reveal section-rule py-20 md:py-28">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Top six overall</p>
            <h2 className="display-type mt-5 text-5xl md:text-7xl">$600 in race prizes</h2>
            <p className="mt-4 leading-7 text-[#5d5952]">
              Runners and walkers compete in one overall field. All registered
              participants must complete the measured course to be eligible.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6">
            {prizes.map((prize, index) => (
              <div
                className={`border-2 border-black p-5 ${
                  index === 0 ? "bg-[#ff5a12]" : "bg-[#fffdf8]"
                }`}
                key={prize.place}
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4a4742] first:text-black">
                  {prize.place}
                </p>
                <p className="display-type mt-8 text-4xl">{prize.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal bg-[#ff5a12] py-16 md:py-20">
        <div className="shell grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-black">
              Local businesses
            </p>
            <h2 className="display-type mt-3 max-w-3xl text-5xl leading-[0.9] md:text-6xl">
              Bring something to the starting line.
            </h2>
            <p className="mt-5 max-w-2xl leading-7">
              Sponsor the event, offer food or products, provide a prize, or host a
              table. Tell us what you have in mind and we’ll follow up directly.
            </p>
          </div>
          <Link className="button-secondary" href="/businesses">
            Business interest form
          </Link>
        </div>
      </section>

      <section className="reveal py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2 className="display-type mt-5 text-5xl md:text-6xl">Race questions</h2>
          </div>
          <div className="divide-y divide-black/20 border-y border-black/20">
            {faqs.map((faq) => (
              <details className="group py-5" key={faq.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-[family-name:var(--font-display)] text-xl font-bold uppercase [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-2xl text-[#a93400] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-4 leading-7 text-[#5d5952]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090909] py-20 text-center text-white md:py-24">
        <div className="shell">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff5a12]">
            Run · Walk · Remember · Inspire
          </p>
          <h2 className="display-type mx-auto mt-5 max-w-4xl text-5xl leading-[0.88] md:text-8xl">
            Let’s honor. Let’s run. Let’s make an impact.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="button-primary" href="/register">
              Start registration
            </Link>
            <a
              className="button-light"
              href="mailto:5kyearrun@gmail.com"
            >
              Ask a question
            </a>
          </div>
        </div>
      </section>

      <div className="fixed right-0 bottom-0 left-0 z-40 grid grid-cols-2 border-t border-white/20 bg-[#090909] p-2 md:hidden">
        <Link className="button-primary !min-h-12" href="/register">
          Register · $20
        </Link>
        <a
          className="button-light !min-h-12"
          href={goFundMeUrl}
          target="_blank"
          rel="noreferrer"
        >
          Donate
        </a>
      </div>
    </main>
  );
}
