import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/6 pb-[env(safe-area-inset-bottom)] text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Logo stacked />
          <p className="max-w-md text-[14px] text-muted-foreground text-pretty">
            Discovery, outreach, and content. You pick where it runs.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-[14px] text-muted-foreground">
          <Link href="/#suite" className="hover:text-foreground">The suite</Link>
          <Link href="/how-it-works" className="hover:text-foreground">How it works</Link>
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/signup" className="hover:text-foreground">Join the waitlist</Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 text-[13px] text-muted-foreground">
        © 2026 NameLoop
      </div>
    </footer>
  );
}
