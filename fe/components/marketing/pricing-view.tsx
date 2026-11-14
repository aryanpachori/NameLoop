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
    blurb: "One customer focus, a few channels. Enough to run your first real cycle.",
    monthly: 49,
    annual: 39,
    limits: ["3 channels", "30 posts / mo", "300 outreach sends / mo", "1 seat"],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "Two customer focuses at once, plus ad ideas on two platforms.",
    monthly: 149,
    annual: 119,
    limits: ["6 channels", "120 posts / mo", "1,500 outreach sends / mo", "3 seats"],
    highlight: true,
  },
  {
    id: "scale",
    name: "Scale",
    blurb: "All channels, a few brands or markets, room for the team.",
    monthly: 449,
    annual: 359,
    limits: ["All 11 channels", "400 posts / mo", "6,000 outreach sends / mo", "10 seats"],
    highlight: false,
  },
] as const;

const comparison: { group: string; rows: { label: string; values: [string, string, string] }[] }[] = [
  {
    group: "Limits",
    rows: [
      { label: "Channels connected", values: ["3", "6", "All 11"] },
      { label: "Posts per month", values: ["30", "120", "400"] },
      { label: "Outreach sends per month", values: ["300", "1,500", "6,000"] },
      { label: "Seats", values: ["1", "3", "10"] },
      { label: "Active ICPs per workspace", values: ["1", "2", "5"] },
      { label: "Workspaces (brands)", values: ["1", "1", "3"] },
      { label: "Sending domains", values: ["1", "3", "10"] },
    ],
  },
  {
    group: "The loop",
    rows: [
      { label: "All five business models", values: ["Yes", "Yes", "Yes"] },
      { label: "Live GTM calendar", values: ["Yes", "Yes", "Yes"] },
      { label: "Approval inbox", values: ["Yes", "Yes", "Yes"] },
      { label: "Autopilot per channel", values: ["No", "Yes", "Yes"] },
      { label: "Ad suggestions from best posts", values: ["Yes", "Yes", "Yes"] },
      { label: "Ad platforms you can launch on", values: ["1", "2", "All"] },
      { label: "Next-sprint proposals", values: ["Yes", "Yes", "Yes"] },
    ],
  },
  {
    group: "Support",
    rows: [
      { label: "Support", values: ["Email", "Priority email", "Shared Slack channel"] },
      { label: "Onboarding call", values: ["No", "Yes", "Yes"] },
    ],
  },
];

const faq: FaqItem[] = [
  {
    q: "Is ad spend included?",
    a: "No. Ad spend is billed by the ad platform, directly to you. NameLoop only suggests which posts to boost and proposes a budget range. You approve each one.",
  },
  {
    q: "What counts as an outreach send?",
    a: "One email, DM or partner message sent on your behalf. Follow-ups on the same thread each count as one. Posts are counted separately.",
  },
  {
    q: "What if I hit a limit mid-sprint?",
    a: "The sprint pauses that channel and tells you. You can upgrade or wait for the next billing month. Nothing is dropped silently.",
  },
  {
    q: "Can I change plan or cancel?",
    a: "Yes. Monthly plans change or cancel any time. Annual plans are billed once a year at roughly 20 percent off.",
  },
  {
    q: "Is checkout live?",
    a: "Not yet. We are onboarding in batches. Sign up and we will confirm your spot and the plan that fits.",
  },
];

export function PricingView() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <main id="main" tabIndex={-1} className="flex-1">
      <section className="section-pad pb-10">
        <div className="marketing-shell">
          <p className="section-eyebrow">Pricing</p>
          <h1 className="heading-hero mt-4 max-w-3xl">
            <WordReveal instant text="Simple plans. Pay for what you actually run." accentWords={["run."]} />
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-7 text-muted-foreground text-pretty">
            Channels, posts, outreach sends, seats. Ad spend stays on the ad platforms you already use.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Segmented
              aria-label="Billing period"
              value={billing}
              onChange={setBilling}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "annual", label: "Annual" },
              ]}
            />
            <span className="text-13 text-muted-foreground">Annual is about 20% off.</span>
          </div>
        </div>
      </section>

      <section className="pb-6">
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
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold tracking-tight">{tier.name}</h2>
                  {tier.highlight ? (
                    <span className="rounded-[6px] bg-accent px-2 py-0.5 text-12 font-medium text-accent-foreground">
                      Most teams
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 min-h-10 text-13 leading-5 text-muted-foreground">{tier.blurb}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif-display text-[56px] leading-none tabular-nums">${price}</span>
                  <span className="text-14 text-muted-foreground">/ month</span>
                </p>
                <p aria-live="polite" className="mt-1 h-5 text-13 tabular-nums text-muted-foreground">
                  {billing === "annual" ? `$${tier.annual * 12} billed yearly` : "Billed monthly"}
                </p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5 text-14">
                  {tier.limits.map((limit) => (
                    <li key={limit} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-muted-foreground" />
                      {limit}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href={`/signup?plan=${tier.id}`}
                  size="lg"
                  variant={tier.highlight ? "default" : "outline"}
                  className="mt-6 w-full"
                  aria-label={`Get started with ${tier.name}`}
                >
                  Get started
                </ButtonLink>
              </article>
            );
          })}
        </div>
        <p className="marketing-shell mt-5 text-13 text-muted-foreground">
          Ad spend billed by the ad platform. Not included in any plan.
        </p>
      </section>

      <section className="section-pad">
        <div className="marketing-shell">
          <h2 className="heading-1">Compare plans</h2>
          <div className="mt-8 overflow-x-auto rounded-[12px] border border-border bg-card">
            <table className="w-full min-w-[640px] border-collapse text-left text-14">
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th scope="col" className="sticky left-0 z-10 bg-muted px-4 py-3 text-13 font-medium text-muted-foreground">
                    <span className="sr-only">Feature</span>
                  </th>
                  {tiers.map((tier) => (
                    <th key={tier.id} scope="col" className="px-4 py-3 text-13 font-semibold">
                      {tier.name}
                      <span className="ml-2 font-mono text-12 font-normal text-muted-foreground">
                        ${billing === "monthly" ? tier.monthly : tier.annual}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((group) => (
                  <GroupRows key={group.group} group={group} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-t border-border section-pad">
        <div className="marketing-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <h2 className="heading-1">Pricing questions.</h2>
          <Faq items={faq} />
        </div>
      </section>
    </main>
  );
}

function GroupRows({ group }: { group: (typeof comparison)[number] }) {
  return (
    <>
      <tr className="border-b border-border bg-background">
        <th
          scope="colgroup"
          colSpan={4}
          className="px-4 py-2 font-mono text-12 font-normal uppercase tracking-wide text-muted-foreground"
        >
          {group.group}
        </th>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-b border-border last:border-b-0">
          <th scope="row" className="sticky left-0 bg-card px-4 py-3 text-14 font-normal">
            {row.label}
          </th>
          {row.values.map((value, i) => (
            <td
              key={i}
              className={cn("px-4 py-3 tabular-nums", value === "No" && "text-muted-foreground")}
            >
              {value}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
