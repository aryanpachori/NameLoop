import { ButtonLink } from "@/components/button-link";
import { ChannelChip } from "@/components/channel-mark";
import { LOOP_STEPS } from "@/components/marketing/loop-steps";
import { Reveal } from "@/components/marketing/reveal";
import { WordReveal } from "@/components/marketing/word-reveal";
import type { BusinessModel, ChannelId } from "@/lib/types";

const models: { id: BusinessModel; label: string; asks: string; picks: ChannelId[] }[] = [
  { id: "b2b", label: "B2B", asks: "Deal size, sales cycle, who signs", picks: ["email", "linkedin"] },
  { id: "b2c", label: "B2C", asks: "Price, how often they use it", picks: ["tiktok", "instagram"] },
  { id: "d2c", label: "D2C", asks: "Price, repeat rate, where you sell", picks: ["instagram", "tiktok", "meta_ads"] },
  { id: "b2b2c", label: "B2B2C", asks: "Who the partner is, who the end customer is", picks: ["email", "linkedin", "facebook"] },
  { id: "marketplace", label: "Marketplace", asks: "Which side you need to grow first", picks: ["facebook", "whatsapp", "google_ads"] },
];

const phases = [
  {
    label: "Get set",
    title: "Pick ICP and channels",
    copy: "Confirm the customer guess, connect a couple channels. First drafts land in your approval inbox, not out in the wild.",
  },
  {
    label: "Run it",
    title: "Show up where they are",
    copy: "Keep sequences on the same thread. Post on the channels you turned on. Weird replies come back to you.",
  },
  {
    label: "Lean in",
    title: "Double down on winners",
    copy: "See what worked by channel. Boost the good stuff when it feels real. Next cycle starts a bit smarter.",
  },
];

export function HowItWorksView() {
  return (
    <main id="main" tabIndex={-1} className="flex-1">
      {/* Intro */}
      <section className="section-pad">
        <div className="marketing-shell">
          <Reveal instant>
            <p className="section-eyebrow">How it works</p>
          </Reveal>
          <h1 className="heading-hero mt-4 max-w-3xl">
            <WordReveal
              instant
              text="Tell us what you sell. We walk the rest with you."
              accentWords={["sell."]}
            />
          </h1>
          <Reveal instant delay={2}>
            <p className="mt-5 max-w-xl text-[17px] leading-7 text-muted-foreground text-pretty">
              First we ask what kind of business you run. That changes who your customer is and where they hang
              out. Everything else follows from that.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Model first */}
      <section className="border-t border-border bg-muted/40 section-pad">
        <div className="marketing-shell">
          <Reveal>
            <h2 className="heading-1 max-w-2xl">First up: what kind of business is this?</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-6 text-muted-foreground">
              B2B and D2C don't get the same questions, ICP card, or channel ranking. Pick yours and we adapt.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
            {models.map((m, i) => (
              <Reveal key={m.id} delay={(Math.min(i, 4) as 0 | 1 | 2 | 3 | 4)}>
                <div className="surface flex h-full flex-col p-5">
                  <p className="text-[15px] font-semibold tracking-tight">{m.label}</p>
                  <p className="mt-1 text-13 text-muted-foreground">We ask: {m.asks}.</p>
                  <div className="mt-4 flex flex-1 flex-wrap content-end gap-1.5">
                    {m.picks.map((id) => (
                      <ChannelChip key={id} id={id} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Six steps */}
      <section id="steps" className="scroll-mt-28 border-t border-border section-pad">
        <div className="marketing-shell">
          <Reveal>
            <h2 className="heading-1 max-w-2xl">Then six steps, on repeat.</h2>
          </Reveal>
          <ol className="mt-10 divide-y divide-border border-y border-border">
            {LOOP_STEPS.map((step) => (
              <li key={step.n}>
                <Reveal className="grid gap-6 py-8 md:grid-cols-[1fr_320px] md:items-start md:gap-12">
                  <div>
                    <p className="font-mono text-12 text-muted-foreground">Step {step.n}</p>
                    <h3 className="mt-1 font-serif-display text-[28px] leading-8 tracking-tight">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-[16px] leading-6 text-muted-foreground">{step.long}</p>
                  </div>
                  <div>{step.fragment}</div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40 section-pad">
        <div className="marketing-shell">
          <Reveal>
            <h2 className="heading-1 max-w-2xl">Each cycle should feel a bit easier.</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-6 text-muted-foreground">
              Some loops are a week. Some are longer. Either way you leave with a clearer customer, fewer
              channels that matter, and proof of what to push next.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
            {phases.map((w, i) => (
              <Reveal key={w.label} delay={(i + 1) as 1 | 2 | 3}>
                <div className="surface h-full p-5">
                  <p className="font-mono text-12 text-muted-foreground">{w.label}</p>
                  <h3 className="mt-1 text-[16px] font-semibold tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-14 leading-5 text-muted-foreground">{w.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Control + CTA */}
      <section className="border-t border-border section-pad">
        <div className="marketing-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <h2 className="heading-1 max-w-2xl">Nothing goes out unless you say so.</h2>
            <p className="mt-3 max-w-xl text-[16px] leading-6 text-muted-foreground">
              Approvals stay on until you flip a channel to autopilot. Ad spend hits the ad platform directly.
              We never launch spend without you.
            </p>
          </Reveal>
          <Reveal delay={1} className="flex flex-wrap gap-2">
            <ButtonLink href="/signup" size="lg">
              Get started
            </ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="outline">
              See pricing
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
