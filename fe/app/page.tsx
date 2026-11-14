import type { Metadata } from "next";
import Link from "next/link";
import { ChannelMarquee } from "@/components/marketing/channel-marquee";
import { CloseBand } from "@/components/marketing/close-band";
import { Faq } from "@/components/marketing/faq";
import { HeroField } from "@/components/marketing/hero-field";
import { HeroUrlForm } from "@/components/marketing/hero-url-form";
import { LoopChapters } from "@/components/marketing/loop-chapters";
import { Reveal } from "@/components/marketing/reveal";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { VsStrip } from "@/components/marketing/vs-strip";
import { WordReveal } from "@/components/marketing/word-reveal";
import { homeFaq, homeHero, homeMeta } from "@/lib/home-copy";

export const metadata: Metadata = {
  title: homeMeta.title,
  description: homeMeta.description,
};

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="relative overflow-hidden">
          <div className="paper-grain-overlay" aria-hidden="true" />
          <div className="marketing-shell relative z-[1] grid lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center py-20 lg:py-24 lg:pr-10">
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
                <WordReveal
                  instant
                  className="mt-2 block text-[0.7em] leading-[1.12] tracking-[-0.03em] text-muted-foreground"
                  text={homeHero.line2}
                  baseDelay={0.28}
                  stagger={0.045}
                />
              </h1>
              <Reveal instant delay={2}>
                <p className="mt-6 max-w-md text-[16px] leading-7 text-muted-foreground text-pretty">
                  {homeHero.body}
                </p>
                <HeroUrlForm className="mt-8" />
                <p className="mt-3 text-13 text-muted-foreground">
                  {homeHero.micro}{" "}
                  <Link href="/pricing" className="text-foreground underline underline-offset-4">
                    {homeHero.pricingLink}
                  </Link>
                </p>
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
        <VsStrip />
        <LoopChapters />

        <section className="section-pad border-t border-border">
          <div className="marketing-shell grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <Reveal>
              <p className="section-eyebrow">{homeFaq.eyebrow}</p>
              <h2 className="heading-1 mt-3">{homeFaq.headline}</h2>
              <p className="mt-4 max-w-sm text-[15px] leading-6 text-muted-foreground text-pretty">
                {homeFaq.support}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <Faq items={homeFaq.items} />
            </Reveal>
          </div>
        </section>

        <CloseBand />
      </main>
      <SiteFooter />
    </div>
  );
}
