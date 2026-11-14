"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/login", label: "Log in" },
];

export function SiteHeader() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <div className="marketing-shell flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-foreground">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            aria-label="Primary"
            className="flex items-center gap-0.5 text-14 font-medium text-muted-foreground"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={path === link.href ? "page" : undefined}
                className={cn(
                  "rounded-[8px] px-2.5 py-1.5 transition-colors duration-150 hover:bg-muted hover:text-foreground sm:px-3",
                  path === link.href && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ButtonLink href="/signup" size="lg" className="h-10 px-4">
            Get started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
