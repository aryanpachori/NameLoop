import { Check } from "lucide-react";
import { ChannelMark } from "@/components/channel-mark";
import type { ChannelId } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ---------- tiny UI fragments, one per loop step ---------- */

function Frag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-border bg-background p-4 text-12 text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

function UnderstandFragment() {
  const rows = [
    { label: "Read pricing page", done: true },
    { label: "Read 6 customer stories", done: true },
    { label: "Pulled 4 claims you can make", done: true },
    { label: "Business model: asking you", done: false },
  ];
  return (
    <Frag>
      <p className="truncate font-mono text-12 text-muted-foreground">ledgerline.dev</p>
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border",
                row.done ? "border-transparent bg-success text-success-foreground" : "border-border"
              )}
            >
              {row.done ? <Check className="size-2.5" strokeWidth={3} /> : null}
            </span>
            <span className={row.done ? "" : "text-muted-foreground"}>{row.label}</span>
          </li>
        ))}
      </ul>
    </Frag>
  );
}

function IcpFragment() {
  return (
    <Frag>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">Finance leads at SaaS, 40 to 400 staff</p>
        <span className="shrink-0 font-mono text-12 text-muted-foreground">82%</span>
      </div>
      <p className="mt-1 text-muted-foreground">Still closing the month in Sheets. Just hired a controller.</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["LinkedIn", "Finance Slack groups"].map((tag) => (
          <span key={tag} className="rounded-[6px] bg-muted px-1.5 py-0.5 text-12 text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
    </Frag>
  );
}

function ChannelsFragment() {
  const rows: { id: ChannelId; label: string; fit: number }[] = [
    { id: "email", label: "Email", fit: 88 },
    { id: "linkedin", label: "LinkedIn", fit: 81 },
    { id: "reddit", label: "Reddit", fit: 46 },
  ];
  return (
    <Frag className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <ChannelMark id={row.id} className="text-muted-foreground" />
          <span className="w-14 shrink-0">{row.label}</span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-foreground" style={{ width: `${row.fit}%` }} />
          </span>
          <span className="w-6 text-right font-mono text-muted-foreground">{row.fit}</span>
        </div>
      ))}
    </Frag>
  );
}

function SprintFragment() {
  // sample cycle: 1 = post, 2 = outreach batch, 0 = rest
  const grid = [
    [1, 0, 2, 1, 0, 2, 0],
    [1, 2, 0, 1, 2, 0, 0],
    [1, 0, 2, 1, 0, 0, 0],
  ];
  return (
    <Frag>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>In flight</span>
        <span className="font-mono">This cycle</span>
      </div>
      <div className="mt-2 space-y-1">
        {grid.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((cell, di) => {
              const highlight = wi === 1 && di === 2;
              return (
                <span
                  key={di}
                  className={cn(
                    "h-4 rounded-[4px]",
                    cell === 1 && "bg-foreground",
                    cell === 2 && "bg-brand",
                    cell === 0 && "bg-muted",
                    highlight && "ring-2 ring-offset-1 ring-offset-background ring-foreground"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-[2px] bg-foreground" /> Post
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-[2px] bg-brand" /> Outreach
        </span>
      </div>
    </Frag>
  );
}

function MeasureFragment() {
  const pts = [4, 6, 5, 8, 7, 11, 10, 14];
  const max = Math.max(...pts);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * 100},${28 - (p / max) * 24}`)
    .join(" ");
  return (
    <Frag>
      <p className="text-muted-foreground">Replies, last 7 days</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="font-serif-display text-32 leading-none">14</p>
        <svg viewBox="0 0 100 30" className="h-8 w-20 text-brand" aria-hidden>
          <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <p className="mt-1 text-muted-foreground">
        <span className="font-mono text-success-foreground">+6</span> vs prior week
      </p>
    </Frag>
  );
}

function BoostFragment() {
  return (
    <Frag>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <ChannelMark id="linkedin" className="text-muted-foreground" />
        <span>Top organic post</span>
      </div>
      <p className="mt-1 line-clamp-2">The month-end close checklist we wish we had in 2023.</p>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-[6px] bg-muted px-2.5 py-2">
        <span className="text-muted-foreground">Suggested boost</span>
        <span className="font-mono">$20/day · 7d</span>
      </div>
      <p className="mt-2 text-12 text-muted-foreground">Estimate. You approve before it runs.</p>
    </Frag>
  );
}

export type LoopStep = {
  n: string;
  title: string;
  short: string;
  long: string;
  fragment: React.ReactNode;
};

export const LOOP_STEPS: LoopStep[] = [
  {
    n: "01",
    title: "Understand the business",
    short: "Paste a URL. We read the site and sketch what you sell.",
    long: "We pull pricing, customer stories, and what you can honestly claim. You get a summary you can edit, then confirm what kind of business this is. That choice drives everything after.",
    fragment: <UnderstandFragment />,
  },
  {
    n: "02",
    title: "Who to sell to",
    short: "A couple customer sketches with pains and a reason to talk now.",
    long: "You get two or three customer cards: who they are, what hurts, where they hang out, why now. B2B looks like company traits. D2C and B2C look like people. Pick one or two to chase.",
    fragment: <IcpFragment />,
  },
  {
    n: "03",
    title: "Where to show up",
    short: "Channels ranked for that crowd, with a rough weekly effort.",
    long: "Channels are switches, not a funnel stage. We rank where your customer actually pays attention, show the effort and the why, and you turn on the ones you want.",
    fragment: <ChannelsFragment />,
  },
  {
    n: "04",
    title: "Run the plan",
    short: "Posts and outreach on one calendar. You approve before anything goes out.",
    long: "A plan lands on a calendar. Drag to reschedule. Approvals stay on until you trust a channel enough for autopilot. The loop doesn't stop when the week fills up.",
    fragment: <SprintFragment />,
  },
  {
    n: "05",
    title: "See what worked",
    short: "Replies, signups, and best posts by channel. Guesses stay labeled as guesses.",
    long: "Reach, replies, and signups roll up by channel. Top posts get a plain reason. If we can't measure something, we call it an estimate instead of dressing it up.",
    fragment: <MeasureFragment />,
  },
  {
    n: "06",
    title: "Push the winners",
    short: "What earned attention seeds the next cycle, ads optional.",
    long: "Good posts become the next plan. When you're ready, we suggest ads with an audience and a cost range. You approve each one. Spend bills on the ad platform. You don't start from zero next time.",
    fragment: <BoostFragment />,
  },
];
