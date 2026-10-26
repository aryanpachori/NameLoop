import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="heading-1">This page is not here.</h1>
        <p className="mt-4 max-w-md text-[16px] text-muted-foreground">
          Try the homepage, pricing, or the waitlist.
        </p>
        <ButtonLink className="mt-8" href="/">
          Back home
        </ButtonLink>
      </main>
      <SiteFooter />
    </div>
  );
}
