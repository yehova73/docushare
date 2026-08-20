import { Logo } from "@/components/logo";

const groups = [
  {
    title: "Product",
    links: ["Features", "Templates", "Pricing", "Google Drive", "Changelog"],
  },
  {
    title: "Use cases",
    links: [
      "Agencies",
      "Accountants",
      "Bookkeepers",
      "Consultants",
      "Mortgage brokers",
    ],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Status"],
  },
  {
    title: "Legal",
    links: [
      "Privacy policy",
      "Terms of service",
      "Data processing",
      "Security",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 pb-24 pt-16 sm:px-8 md:pb-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The client intake workspace. Collect everything you need before
              work begins.
            </p>
          </div>
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {g.title}
              </p>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DocFetch. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#top" className="transition-colors hover:text-foreground">
              LinkedIn
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              X
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
