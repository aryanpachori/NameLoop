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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-foreground">
          <Logo />
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 text-[14px] font-medium text-muted-foreground md:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
              className={cn(
                "rounded-[8px] px-3 py-1.5 transition-colors duration-150 hover:bg-muted hover:text-foreground",
                path === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="rounded-[8px] px-3 py-1.5 text-[14px] font-medium text-muted-foreground hover:text-foreground md:hidden"
          >
            Log in
          </Link>
          <ButtonLink href="/signup" size="lg" className="max-md:h-9 max-md:px-3">
            Get started
          </ButtonLink>
        </div>
      </div>
      <nav
        aria-label="Sections"
        className="flex gap-1 overflow-x-auto border-t border-border px-4 py-1.5 text-[13px] font-medium text-muted-foreground md:hidden"
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-[8px] px-3 py-1 hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
