import type { Metadata } from "next";
import Link from "next/link";
import { ChannelMarquee } from "@/components/marketing/channel-marquee";
import { CloseBand } from "@/components/marketing/close-band";
import { Faq, type FaqItem } from "@/components/marketing/faq";
import { HeroField } from "@/components/marketing/hero-field";
import { HeroUrlForm } from "@/components/marketing/hero-url-form";
import { LoopChapters } from "@/components/marketing/loop-chapters";
import { Reveal } from "@/components/marketing/reveal";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { VsStrip } from "@/components/marketing/vs-strip";
import { WordReveal } from "@/components/marketing/word-reveal";

export const metadata: Metadata = {
  title: "NameLoop. AI go-to-market that compounds",
  description:
    "AI that finds who to sell to and where they are — then drafts the work for you to approve. Not another AI SDR that sends without you.",
};

const faq: FaqItem[] = [
  {
    q: "How is this different from an AI SDR?",
    a: "AI SDRs optimize for autonomous send volume. NameLoop starts earlier: who is worth selling to, which channels fit your model, and drafts you approve. Autopilot is optional — after you trust a channel.",
  },
  {
    q: "What does the AI actually do?",
    a: "It reads your site, proposes ICPs, ranks channels, and drafts posts and outreach. Nothing sends until you say so.",
  },
  {
    q: "Do I need a finished GTM plan first?",
    a: "No. Paste a URL and get started. We ask business model and the rest inside the product.",
  },
  {
    q: "Is this only for B2B?",
    a: "No. B2B, B2C, D2C, marketplace — the AI adapts ICP and channels to the model you pick.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="relative min-h-[min(78dvh,820px)] overflow-hidden px-4 pb-20 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
          <HeroField className="z-0" />
          <div className="paper-grain-overlay" aria-hidden="true" />
          <div className="relative z-[1] mx-auto flex w-full max-w-3xl flex-col items-start">
            <Reveal instant>
              <p className="font-mono text-12 uppercase tracking-[0.18em] text-muted-foreground">
                AI go-to-market · not another AI SDR
              </p>
            </Reveal>
            <h1 className="heading-hero mt-5">
              <WordReveal
                instant
                className="block"
                text="Know who to sell to."
                accentWords={["who", "to", "sell", "to."]}
                stagger={0.05}
              />
              <WordReveal
                instant
                className="mt-2 block text-[0.72em] leading-[1.1] tracking-[-0.03em] text-muted-foreground"
                text="AI finds them. You approve every send."
                baseDelay={0.28}
                stagger={0.045}
              />
            </h1>
            <Reveal instant delay={2}>
              <p className="font-marketing mt-6 max-w-lg text-[17px] leading-7 text-muted-foreground text-pretty">
                Paste your product URL. NameLoop’s AI drafts the ICP, ranks channels, and writes the outreach —
                then waits. We ask the rest once you’re inside.
              </p>
              <HeroUrlForm className="mt-8" />
              <p className="mt-3 text-13 text-muted-foreground">
                Early access · about a minute.{" "}
                <Link href="/pricing" className="text-foreground underline underline-offset-4">
                  Pricing
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        <ChannelMarquee />
        <VsStrip />
        <LoopChapters />

        <section className="border-t border-border px-4 section-pad">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal>
              <p className="font-mono text-12 uppercase tracking-[0.18em] text-muted-foreground">FAQ</p>
              <h2 className="heading-1 mt-4">
                Straight answers.{" "}
                <span className="text-muted-foreground">No pitch deck.</span>
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-6 text-muted-foreground">
                Still deciding? Start with a URL — the product asks what it needs after you’re in.
              </p>
            </Reveal>
            <Reveal delay={1}>
              <Faq items={faq} />
            </Reveal>
          </div>
        </section>

        <CloseBand />
      </main>
      <SiteFooter />
    </div>
  );
}
