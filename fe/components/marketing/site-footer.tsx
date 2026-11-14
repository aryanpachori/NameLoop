import Link from "next/link";
import { Logo } from "@/components/logo";
import { homeFooter } from "@/lib/home-copy";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Get started" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border pb-[env(safe-area-inset-bottom)] text-foreground">
      <div className="marketing-shell section-pad">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-start sm:gap-16">
          <div>
            <Logo stacked />
            <p className="mt-5 max-w-md text-[15px] leading-6 text-muted-foreground text-pretty">
              {homeFooter.blurb}
            </p>
          </div>
          <div className="sm:justify-self-end sm:text-right">
            <nav
              aria-label="Footer"
              className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-medium text-muted-foreground sm:justify-end"
            >
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mt-8 font-mono text-12 tracking-[0.12em] text-muted-foreground">
              © 2026 NameLoop
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
