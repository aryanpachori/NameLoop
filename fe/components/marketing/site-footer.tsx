import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Get started" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-[env(safe-area-inset-bottom)] text-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
        <div>
          <Logo stacked />
          <p className="mt-5 max-w-md text-[15px] leading-6 text-muted-foreground text-pretty">
            AI go-to-market that compounds — not another AI SDR. Find who to sell to, show up where
            they are, double down on what works.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-8 sm:flex-row lg:flex-col lg:items-end">
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] font-medium text-muted-foreground"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="font-mono text-12 tracking-[0.12em] text-muted-foreground">© 2026 NameLoop</p>
        </div>
      </div>
    </footer>
  );
}
