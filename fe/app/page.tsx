import type { Metadata } from "next";
import Link from "next/link";
import { ChannelMarquee } from "@/components/marketing/channel-marquee";
import { CloseBand } from "@/components/marketing/close-band";
import { EntityFactsBand } from "@/components/marketing/entity-facts-band";
import { EnginesStrip } from "@/components/marketing/engines-strip";
import { Faq } from "@/components/marketing/faq";
import { HeroField } from "@/components/marketing/hero-field";
import { HeroUrlForm } from "@/components/marketing/hero-url-form";
import { LoopChapters } from "@/components/marketing/loop-chapters";
import { Reveal } from "@/components/marketing/reveal";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { VsStrip } from "@/components/marketing/vs-strip";
import { WordReveal } from "@/components/marketing/word-reveal";
import { PageFaqJsonLd } from "@/components/marketing/page-faq-json-ld";
import { homeFaq, homeHero, homeMeta, homeTrust } from "@/lib/home-copy";
import { marketingPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = marketingPageMetadata({
  path: "/",
  title: { absolute: homeMeta.absoluteTitle },
  description: homeMeta.description,
  openGraphTitle: homeMeta.absoluteTitle,
  twitterTitle: homeMeta.absoluteTitle,
});

export default function HomePage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <PageFaqJsonLd items={homeFaq.items} path="/" />
      {/* Page-level ambient glow — consistent across all sections */}
      <div className="hero-atmosphere pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative z-[1] flex-1">
        <section className="relative overflow-hidden">
          {/* Grain behind both columns so left/right share the same surface */}
          <div className="paper-grain-overlay !z-0" aria-hidden="true" />
          <div className="marketing-shell relative z-[1] grid lg:grid-cols-2 lg:items-stretch">
            <div className="relative z-[1] flex flex-col justify-center bg-transparent py-12 sm:py-16 lg:py-24 lg:pr-10">
              <Reveal instant>
                <p className="section-eyebrow">{homeHero.eyebrow}</p>
              </Reveal>
              <h1 className="heading-hero mt-4">
                <WordReveal
                  instant
                  className="block"
                  text={homeHero.line1}
                  accentWords={homeHero.accentWords}
                  stagger={0.05}
                />
                <span className="mt-3 block max-w-md font-sans text-20 font-medium tracking-tight text-muted-foreground sm:text-22">
                  {homeHero.line2}
                </span>
              </h1>
              <Reveal instant delay={2}>
                <p className="mt-6 max-w-md text-16 font-medium text-muted-foreground text-pretty">
                  {homeHero.body}
                </p>
                <HeroUrlForm className="mt-8" />
                <p className="mt-3 text-13 text-muted-foreground">
                  {homeHero.micro}{" "}
                  <Link href="/pricing" className="text-foreground underline underline-offset-4">
                    {homeHero.pricingLink}
                  </Link>
                </p>

                <div className="mt-8 stat-strip" aria-label="Why NameLoop">
                  {homeTrust.map((item) => (
                    <span key={item} className="stat-strip__item">
                      <svg
                        aria-hidden="true"
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        className="shrink-0 text-brand self-center"
                      >
                        <path
                          d="M2.5 6.5L5 9L10.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="stat-strip__label">{item}</span>
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
            <div
              className="relative hidden min-h-[min(70dvh,640px)] overflow-hidden lg:block"
              aria-hidden="true"
            >
              <HeroField />
            </div>
          </div>
        </section>

        <ChannelMarquee />
        <EnginesStrip />
        <VsStrip />
        <LoopChapters />

        <EntityFactsBand />

        <section className="section-pad border-t border-border">
          <div className="marketing-shell grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <Reveal>
              <p className="section-eyebrow">{homeFaq.eyebrow}</p>
              <h2 className="heading-1 mt-3">{homeFaq.headline}</h2>
              <p className="mt-4 max-w-sm text-15 text-muted-foreground text-pretty">
                {homeFaq.support}
              </p>
            </Reveal>
            <Faq items={homeFaq.items} />
          </div>
        </section>

        <CloseBand />
      </main>
      <SiteFooter />
    </div>
  );
}
