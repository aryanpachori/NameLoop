"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/button-link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/#suite", label: "The suite" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/6 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-[69px] w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-foreground">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 text-[14px] font-medium text-muted-foreground sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 hover:text-foreground ${
                path === link.href ? "text-foreground" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/signup" size="lg" className="max-sm:h-9 max-sm:px-4">
          <span className="sm:hidden">Join</span>
          <span className="hidden sm:inline">Join the waitlist</span>
        </ButtonLink>
      </div>
    </header>
  );
}
