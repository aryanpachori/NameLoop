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
    label: "Week one",
    title: "Set it up",
    copy: "Pick who you're selling to, connect email, set a daily send limit. Drafts wait for you — nothing sneaks out.",
  },
  {
    label: "Ongoing",
    title: "Let it run",
    copy: "We pull leads, skip bad emails, send in daytime slots. If someone replies, we stop and you take it.",
  },
  {
    label: "Each week",
    title: "Keep what worked",
    copy: "If bounce climbs, pause. If a post or email angle worked, do more of that next week.",
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
              text="The growth loop founders run — without a GTM team."
              accentWords={["founders"]}
            />
          </h1>
          <Reveal instant delay={2}>
            <p className="mt-5 max-w-xl text-17 leading-7 text-muted-foreground text-pretty">
              Grow your product. Outbound that books. Inbound that compounds. Paste a URL, pick who
              you&apos;re selling to, email carefully, post where they hang out, then keep what worked.
              You approve drafts and answer humans — we don&apos;t.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Model first */}
      <section className="border-t border-border bg-muted/40 section-pad">
        <div className="marketing-shell">
          <Reveal>
            <h2 className="heading-1 max-w-2xl">First up: what kind of business is this?</h2>
            <p className="mt-3 max-w-2xl text-16 text-muted-foreground">
              B2B and D2C don't get the same questions, ICP card, or channel ranking. Pick yours and we adapt.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
            {models.map((m, i) => (
              <Reveal key={m.id} delay={(Math.min(i, 4) as 0 | 1 | 2 | 3 | 4)}>
                <div className="surface flex h-full flex-col p-5">
                  <p className="text-15 font-semibold tracking-tight">{m.label}</p>
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
                    <h3 className="mt-1 font-serif-display text-28 leading-8 tracking-tight">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-16 text-muted-foreground">{step.long}</p>
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
            <h2 className="heading-1 max-w-2xl">Next week should be easier than this one.</h2>
            <p className="mt-3 max-w-2xl text-16 text-muted-foreground">
              Clearer who you're selling to. Email that stops when people reply. Posts that start from what
              worked — not a blank calendar every Monday.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
            {phases.map((w, i) => (
              <Reveal key={w.label} delay={(i + 1) as 1 | 2 | 3}>
                <div className="surface h-full p-5">
                  <p className="font-mono text-12 text-muted-foreground">{w.label}</p>
                  <h3 className="mt-1 text-16 font-semibold tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-14 text-muted-foreground">{w.copy}</p>
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
            <p className="mt-3 max-w-xl text-16 text-muted-foreground">
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
