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
  /** Question-style H3 for SEO / featured snippets */
  heading: string;
  short: string;
  long: string;
  fragment: React.ReactNode;
};

export const LOOP_STEPS: LoopStep[] = [
  {
    n: "01",
    title: "Read your site",
    heading: "How does NameLoop read your site?",
    short: "Paste a URL. We figure out what you sell.",
    long: "We pull pricing, customer stories, and claims you can actually stand behind. You edit the summary, then tell us what kind of business this is — that changes who we look for.",
    fragment: <UnderstandFragment />,
  },
  {
    n: "02",
    title: "Pick who to sell to",
    heading: "How do you pick who to sell to?",
    short: "A couple customer cards. Then we find leads.",
    long: "You get two or three guesses: who they are, what hurts, where they hang out. Pick one or two. We pull companies that fit, skip ones you've already hit, and park rows with no usable email.",
    fragment: <IcpFragment />,
  },
  {
    n: "03",
    title: "Connect email (and channels)",
    heading: "How do you connect email and channels?",
    short: "Gmail, Resend, LinkedIn — whatever you'll actually use.",
    long: "Each sender has its own daily limit and bounce view. You can pause one without killing everything. Content channels get ranked for the customer you picked — email is for outreach.",
    fragment: <ChannelsFragment />,
  },
  {
    n: "04",
    title: "Send and post",
    heading: "How does NameLoop send outreach and schedule posts?",
    short: "Daytime email slots. Posts on a calendar. You approve.",
    long: "Outreach is a first note plus follow-ups, sent in slots so you don't dump everything at once. Posts land on a shared calendar. Nothing goes live until you approve. If someone replies, we stop — we don't answer for you.",
    fragment: <SprintFragment />,
  },
  {
    n: "05",
    title: "See what worked",
    heading: "How do you see what worked in NameLoop?",
    short: "Replies, saves, meetings. By channel.",
    long: "One report for email health and post performance. If we're guessing, we say so. You can tell which follow-up or post actually did something.",
    fragment: <MeasureFragment />,
  },
  {
    n: "06",
    title: "Plan next week from that",
    heading: "How does NameLoop plan your next week?",
    short: "Keep the winners. Drop the rest. Ads if you want.",
    long: "We suggest what to keep, kill, or try next — including angles that are moving in your niche. You accept or edit. Optional: boost a post that already proved itself. Spend stays on Meta or Google.",
    fragment: <BoostFragment />,
  },
];
