import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/marketing/reveal";
import { homeClose, homeTrust } from "@/lib/home-copy";

export function CloseBand() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      {/* Atmospheric grain + gradient depth */}
      <div className="paper-grain-overlay" aria-hidden="true" />
      <div className="cta-atmosphere" aria-hidden="true" />

      <div className="marketing-shell relative z-[1] py-20 lg:py-28">
        <Reveal>
          {/* Eyebrow */}
          <p className="section-eyebrow">{homeClose.eyebrow}</p>

          {/* Large cinematic headline */}
          <h2 className="heading-hero mt-4 max-w-2xl">{homeClose.headline}</h2>

          {/* Support copy */}
          <p className="mt-5 max-w-md text-16 text-muted-foreground text-pretty">
            {homeClose.support}
          </p>

          {/* Trust signals — inline checkmark list */}
          <ul className="mt-5 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-1.5">
            {homeTrust.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 text-13 font-medium text-muted-foreground"
              >
                <svg
                  aria-hidden="true"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="shrink-0 text-brand"
                >
                  <path
                    d="M2.5 6.5L5 9L10.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/signup" size="lg" className="h-11 px-6">
              {homeClose.primaryCta}
            </ButtonLink>
            <Link
              href="/pricing"
              className="inline-flex h-11 items-center px-2 text-14 font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {homeClose.secondaryCta}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
