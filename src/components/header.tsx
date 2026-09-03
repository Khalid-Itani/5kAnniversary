import Link from "next/link";

const navItems = [
  { href: "/#about", label: "About" },
  { href: "/#course", label: "Course" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/businesses", label: "Businesses" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[#090909]/95 text-white backdrop-blur">
      <div className="shell flex min-h-20 items-center justify-between gap-5">
        <Link
          className="group flex items-center gap-3"
          href="/"
          aria-label="Coach Arena 5K home"
        >
          <span className="display-type flex h-11 w-11 items-center justify-center bg-[#ff5a12] text-2xl text-black transition-transform group-hover:-rotate-2">
            5K
          </span>
          <span className="leading-none">
            <span className="display-type block text-lg">Coach Arena 5K</span>
            <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/60">
              Five-Year Anniversary
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              className="text-sm font-semibold text-white/75 transition-colors hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link className="button-primary !min-h-11 !px-5" href="/register">
            Register
          </Link>
        </nav>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none border border-white/30 px-3 py-2 text-sm font-bold uppercase tracking-wider [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav
            className="absolute right-0 top-[calc(100%+0.75rem)] grid w-56 gap-1 border border-white/15 bg-[#111] p-3 shadow-2xl"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link className="px-3 py-3 font-semibold" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button-primary mt-1" href="/register">
              Register
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
