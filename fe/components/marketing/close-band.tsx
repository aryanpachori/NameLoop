import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/marketing/reveal";
import { homeClose, homeTrust } from "@/lib/home-copy";

export function CloseBand() {
  return (
    <section className="section-pad relative overflow-hidden border-t border-border">
      <div className="paper-grain-overlay" aria-hidden="true" />
      <div className="marketing-shell relative z-[1]">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
            <div>
              <p className="section-eyebrow">{homeClose.eyebrow}</p>
              <h2 className="heading-1 mt-3 max-w-lg">{homeClose.headline}</h2>
              <p className="mt-4 max-w-md text-15 text-muted-foreground text-pretty">
                {homeClose.support}
              </p>
              <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {homeTrust.map((item) => (
                  <li
                    key={item}
                    className="text-13 font-medium tracking-tight text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <ButtonLink href="/signup" size="lg" className="h-11 px-5">
                {homeClose.primaryCta}
              </ButtonLink>
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center px-2 text-14 font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                {homeClose.secondaryCta}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
