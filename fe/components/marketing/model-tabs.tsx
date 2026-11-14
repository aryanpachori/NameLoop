"use client";

import { useState } from "react";
import { ChannelChip } from "@/components/channel-mark";
import { Segmented } from "@/components/ui/segmented";
import type { BusinessModel, ChannelId } from "@/lib/types";

type ModelView = {
  label: string;
  business: string;
  icpName: string;
  icpKind: string;
  icpWho: string;
  pains: string[];
  hangouts: string;
  channels: { id: ChannelId; note: string }[];
  outreach: string;
  ads: string;
};

const MODELS: Record<BusinessModel, ModelView> = {
  b2b: {
    label: "B2B",
    business: "Ledgerline · close software for finance teams",
    icpName: "Finance leads at growing SaaS",
    icpKind: "Firmographic card",
    icpWho: "Controllers and VPs Finance at SaaS companies with 40 to 400 staff.",
    pains: ["Month-end close takes 9 days", "Spreadsheets nobody trusts"],
    hangouts: "LinkedIn, finance Slack groups, r/accounting",
    channels: [
      { id: "email", note: "Sequences to named accounts" },
      { id: "linkedin", note: "Founder posts and comments" },
      { id: "reddit", note: "Answer, don’t pitch" },
    ],
    outreach: "Prospect list, 3-step sequence, daily send cap.",
    ads: "LinkedIn or Google, audience from the ICP card.",
  },
  b2c: {
    label: "B2C",
    business: "Tidewell · habit tracking app",
    icpName: "People rebuilding a morning routine",
    icpKind: "Persona card",
    icpWho: "Adults 25 to 40 who started and dropped three habit apps already.",
    pains: ["Streaks feel like homework", "Forget by day four"],
    hangouts: "TikTok, Instagram Reels, r/getdisciplined",
    channels: [
      { id: "tiktok", note: "Short demos, 4 a week" },
      { id: "instagram", note: "Reels and stories" },
      { id: "reddit", note: "Join threads, share one tip" },
    ],
    outreach: "Light touch: creator DMs and community replies, no cold sequences.",
    ads: "Meta or TikTok, lookalike from best-performing post.",
  },
  d2c: {
    label: "D2C",
    business: "Oat & Ember · small-batch skincare",
    icpName: "Sensitive-skin ingredient readers",
    icpKind: "Persona card",
    icpWho: "Women 28 to 45 who read the INCI list before they buy.",
    pains: ["Burned by ‘gentle’ products", "No trust in influencer picks"],
    hangouts: "Instagram, TikTok, skincare subreddits",
    channels: [
      { id: "instagram", note: "Before and after, ingredient posts" },
      { id: "tiktok", note: "Routine videos with creators" },
      { id: "meta_ads", note: "Boost the posts that saved best" },
    ],
    outreach: "Creator and partner outreach, with product-seeding drafts.",
    ads: "Meta first. Spend when organic posts prove the angle.",
  },
  b2b2c: {
    label: "B2B2C",
    business: "Pocketcover · pet insurance sold via vet clinics",
    icpName: "Independent vet clinic managers",
    icpKind: "Partner card + end customer",
    icpWho: "Managers of clinics with 2 to 6 vets, plus the pet owners they serve.",
    pains: ["Clients decline care on cost", "No time to explain plans"],
    hangouts: "LinkedIn, vet practice groups, Facebook",
    channels: [
      { id: "email", note: "Partner outreach to clinics" },
      { id: "linkedin", note: "Practice manager content" },
      { id: "facebook", note: "Pet owner groups" },
    ],
    outreach: "Partner pipeline for clinics. Consumer content runs separately.",
    ads: "Meta for owners near partner clinics.",
  },
  marketplace: {
    label: "Marketplace",
    business: "Plankhouse · hire local carpenters",
    icpName: "Supply first: independent carpenters",
    icpKind: "Side-of-market card",
    icpWho: "Carpenters with 3+ years and a gap in their weekly calendar.",
    pains: ["Lead sites charge per lead", "Quiet weeks in winter"],
    hangouts: "Facebook groups, YouTube, WhatsApp communities",
    channels: [
      { id: "facebook", note: "Trade groups, weekly posts" },
      { id: "youtube", note: "Job walkthroughs" },
      { id: "whatsapp", note: "Direct invites with a link" },
    ],
    outreach: "Invite supply by hand. Demand-side comes from the ads step.",
    ads: "Google Ads on “hire carpenter near me” once supply is live.",
  },
};

const ORDER: BusinessModel[] = ["b2b", "b2c", "d2c", "b2b2c", "marketplace"];

export function ModelTabs() {
  const [model, setModel] = useState<BusinessModel>("b2b");
  const view = MODELS[model];

  return (
    <div>
      <div className="-mx-4 -my-1 overflow-x-auto px-4 py-1">
        <Segmented
          aria-label="Business model"
          value={model}
          onChange={setModel}
          options={ORDER.map((m) => ({ value: m, label: MODELS[m].label }))}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-[12px] border border-border bg-card" key={model}>
        <div className="border-b border-border px-5 py-3.5 md:px-6">
          <p className="text-13 text-muted-foreground">Example · {view.business}</p>
        </div>
        <div className="grid gap-px bg-border md:grid-cols-2">
          <div className="row-in bg-card p-5 md:p-6">
            <p className="text-12 font-medium uppercase tracking-wide text-muted-foreground">ICP · {view.icpKind}</p>
            <h3 className="mt-2 text-[17px] font-semibold tracking-tight">{view.icpName}</h3>
            <p className="mt-1.5 text-14 text-muted-foreground">{view.icpWho}</p>
            <ul className="mt-4 space-y-2 text-13">
              {view.pains.map((pain) => (
                <li key={pain} className="flex gap-2">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground" />
                  {pain}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-13 text-muted-foreground">Hangouts: {view.hangouts}</p>
          </div>
          <div className="row-in bg-card p-5 md:p-6">
            <p className="text-12 font-medium uppercase tracking-wide text-muted-foreground">Channels it picks</p>
            <ul className="mt-4 space-y-3.5">
              {view.channels.map((ch) => (
                <li key={ch.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <ChannelChip id={ch.id} />
                  <span className="text-13 text-muted-foreground">{ch.note}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-13">
              <div>
                <dt className="font-medium">Outreach</dt>
                <dd className="text-muted-foreground">{view.outreach}</dd>
              </div>
              <div>
                <dt className="font-medium">Ads, after proof</dt>
                <dd className="text-muted-foreground">{view.ads}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
