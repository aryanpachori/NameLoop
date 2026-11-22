"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Faq } from "@/components/marketing/faq";
import { pricingFaq } from "@/lib/pricing-copy";
import { WordReveal } from "@/components/marketing/word-reveal";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "annual";

type Tier = {
  id: string;
  name: string;
  blurb: string;
  monthly: number | null;
  annual: number | null;
  limits: string[];
  highlight: boolean;
  cta: string;
  href: string;
};

const tiers: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "One product. Email + posts to prove the loop.",
    monthly: 10,
    annual: 8,
    limits: [
      "3 channels",
      "500 emails / mo",
      "30 posts / mo",
      "1 seat",
    ],
    highlight: false,
    cta: "Get started",
    href: "/signup?plan=starter",
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "More sends, more posts, room for a small team.",
    monthly: 50,
    annual: 40,
    limits: [
      "6 channels",
      "2,500 emails / mo",
      "120 posts / mo",
      "3 seats · ad ideas",
    ],
    highlight: true,
    cta: "Get started",
    href: "/signup?plan=growth",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    blurb: "Custom limits, seats, and a dedicated setup.",
    monthly: null,
    annual: null,
    limits: [
      "Custom channels & volume",
      "SSO / security review",
      "Priority support",
      "Onboarding with us",
    ],
    highlight: false,
    cta: "Talk to us",
    href: "mailto:aryanpachori03@gmail.com?subject=NameLoop%20Enterprise",
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
          <p className="mt-5 text-16 font-medium text-muted-foreground text-pretty">
            The growth loop founders run — without a GTM team. Pay for channels, emails, posts, and seats. Ads stay on Meta and Google.
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
            const isCustom = tier.monthly === null;
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
                  <h2 className="text-16 font-semibold tracking-tight">{tier.name}</h2>
                  {tier.highlight ? (
                    <span className="rounded-[6px] bg-accent px-2 py-0.5 text-12 font-medium text-accent-foreground">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 min-h-10 text-14 text-muted-foreground text-pretty">
                  {tier.blurb}
                </p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  {isCustom ? (
                    <span className="font-serif-display text-40 tracking-tight">Custom</span>
                  ) : (
                    <>
                      <span className="font-serif-display text-48 tabular-nums">${price}</span>
                      <span className="text-14 text-muted-foreground">/ mo</span>
                    </>
                  )}
                </p>
                <p className="mt-1 text-13 text-muted-foreground">
                  {isCustom
                    ? "Scoped to your volume and team"
                    : billing === "annual" && tier.annual
                      ? `$${tier.annual * 12} / year`
                      : "Billed monthly"}
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-14">
                  {tier.limits.map((limit) => (
                    <li key={limit} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-muted-foreground" strokeWidth={2.25} />
                      {limit}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={tier.href}
                  size="lg"
                  variant={tier.highlight ? "default" : "outline"}
                  className="mt-8 h-11 w-full"
                  aria-label={`${tier.cta} — ${tier.name}`}
                >
                  {tier.cta}
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
          <Faq items={pricingFaq} />
        </div>
      </section>
    </main>
  );
}
