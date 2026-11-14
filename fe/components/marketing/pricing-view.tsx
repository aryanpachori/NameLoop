"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Faq, type FaqItem } from "@/components/marketing/faq";
import { WordReveal } from "@/components/marketing/word-reveal";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

const tiers = [
  {
    id: "starter",
    name: "Starter",
    blurb: "One customer. A few channels. First real inbound cycle.",
    monthly: 49,
    annual: 39,
    limits: ["3 channels", "30 posts / mo", "1 seat", "Email support"],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "Two customers. More posts. Autopilot when you trust a channel.",
    monthly: 149,
    annual: 119,
    limits: ["6 channels", "120 posts / mo", "3 seats", "Ad ideas on 2 platforms"],
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "Every channel. A few brands. Room for the team.",
    monthly: 449,
    annual: 359,
    limits: ["All 11 channels", "400 posts / mo", "10 seats", "Shared Slack"],
    highlight: false,
  },
] as const;

const faq: FaqItem[] = [
  {
    q: "Is ad spend included?",
    a: "Nope. Ads bill on Meta, Google, etc. We only suggest what to boost and a budget range. You approve each one.",
  },
  {
    q: "Is this mostly cold outbound?",
    a: "Nope. Plans are built around inbound: organic posts and social that pull meetings in. Outreach limits exist if you need them. They aren't the main event.",
  },
  {
    q: "Can I change plan or cancel?",
    a: "Yes. Monthly anytime. Annual is about 20% off, billed once a year.",
  },
  {
    q: "Is checkout live?",
    a: "Not yet. We're onboarding in batches. Sign up and we'll confirm your spot.",
  },
];

export function PricingView() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <main id="main" tabIndex={-1} className="flex-1">
      <section className="section-pad pb-10">
        <div className="marketing-shell max-w-2xl">
          <p className="section-eyebrow">Pricing</p>
          <h1 className="heading-hero mt-4">
            <WordReveal instant text="Simple plans. Start small." accentWords={["small."]} />
          </h1>
          <p className="mt-5 text-[16px] font-medium leading-7 text-muted-foreground text-pretty">
            Pay for channels, posts, and seats. Grow inbound. Ad spend stays on the platforms you already use.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Segmented
              aria-label="Billing period"
              value={billing}
              onChange={setBilling}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "annual", label: "Annual · ~20% off" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-24">
        <div className="marketing-shell grid gap-5 md:grid-cols-3 md:gap-6">
          {tiers.map((tier) => {
            const price = billing === "monthly" ? tier.monthly : tier.annual;
            return (
              <article
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-[12px] border bg-card p-6",
                  tier.highlight ? "border-foreground" : "border-border"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[16px] font-semibold tracking-tight">{tier.name}</h2>
                  {tier.highlight ? (
                    <span className="rounded-[6px] bg-accent px-2 py-0.5 text-12 font-medium text-accent-foreground">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 min-h-10 text-[14px] leading-5 text-muted-foreground text-pretty">
                  {tier.blurb}
                </p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-serif-display text-[48px] leading-none tracking-tight tabular-nums">
                    ${price}
                  </span>
                  <span className="text-14 text-muted-foreground">/ mo</span>
                </p>
                <p className="mt-1 text-13 text-muted-foreground">
                  {billing === "annual" ? `$${tier.annual * 12} / year` : "Billed monthly"}
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-[14px]">
                  {tier.limits.map((limit) => (
                    <li key={limit} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.25} />
                      {limit}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/signup?plan=${tier.id}`}
                  size="lg"
                  variant={tier.highlight ? "default" : "outline"}
                  className="mt-8 h-11 w-full"
                  aria-label={`Get started with ${tier.name}`}
                >
                  Get started
                </ButtonLink>
              </article>
            );
          })}
        </div>
        <p className="marketing-shell mt-6 text-13 text-muted-foreground">
          Ad spend is separate. Nothing boosts until you approve it.
        </p>
      </section>

      <section className="border-t border-border section-pad">
        <div className="marketing-shell grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <p className="section-eyebrow">FAQ</p>
            <h2 className="heading-1 mt-3">Quick answers.</h2>
          </div>
          <Faq items={faq} />
        </div>
      </section>
    </main>
  );
}
