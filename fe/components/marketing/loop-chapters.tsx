import { ChannelMark, channelLabel } from "@/components/channel-mark";
import { Reveal } from "@/components/marketing/reveal";
import type { ChannelId } from "@/lib/types";

const chapters = [
  {
    n: "01",
    title: "Who",
    kicker: "Ideal customer",
    copy: "AI reads your product and drafts ICPs worth chasing — firmographics, pains, and a reason to talk now. Not a generic persona deck.",
    channels: ["linkedin", "email"] as ChannelId[],
    fragment: (
      <div className="space-y-3 border border-border bg-background/70 p-5 backdrop-blur-[2px]">
        <p className="font-mono text-12 text-muted-foreground">ICP · draft</p>
        <p className="text-[15px] font-medium tracking-tight">Finance leads at growing SaaS</p>
        <p className="text-13 text-muted-foreground">Controllers · 40–400 staff · hired this month</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-12 text-brand">82% fit</span>
          <span className="text-12 text-muted-foreground">Waiting on you</span>
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "Where",
    kicker: "Channel stack",
    copy: "Places ranked for that customer and your model. Drafts land in one inbox — nothing posts until you approve.",
    channels: ["email", "linkedin", "reddit", "x"] as ChannelId[],
    fragment: (
      <ul className="space-y-2 border border-border bg-background/70 p-5 backdrop-blur-[2px]">
        {(
          [
            { id: "email" as ChannelId, score: 88 },
            { id: "linkedin" as ChannelId, score: 81 },
            { id: "reddit" as ChannelId, score: 46 },
          ] as const
        ).map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-13">
            <span className="inline-flex items-center gap-2">
              <ChannelMark id={row.id} />
              <span className="font-medium">{channelLabel(row.id)}</span>
            </span>
            <span className="font-mono text-muted-foreground">{row.score}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    n: "03",
    title: "What worked",
    kicker: "Compounding loop",
    copy: "Replies, posts, and learnings feed the next cycle. Put budget behind winners when the signal is real.",
    channels: ["linkedin", "meta_ads", "google_ads"] as ChannelId[],
    fragment: (
      <div className="border border-border bg-background/70 p-5 backdrop-blur-[2px]">
        <p className="font-mono text-12 text-muted-foreground">Amplify · estimate</p>
        <p className="mt-2 text-[15px] font-medium tracking-tight">Month-end close checklist</p>
        <p className="mt-1 text-13 text-muted-foreground">Top organic · LinkedIn</p>
        <p className="mt-4 font-serif-display text-[28px] leading-none tracking-tight text-heading">
          $420–680
        </p>
        <p className="mt-2 text-12 text-muted-foreground">You approve before it runs.</p>
      </div>
    ),
  },
];

export function LoopChapters() {
  return (
    <section className="border-t border-border bg-muted/35">
      <div className="mx-auto w-full max-w-6xl px-4 section-pad">
        <Reveal>
          <p className="font-mono text-12 uppercase tracking-[0.18em] text-muted-foreground">The loop</p>
          <h2 className="heading-1 mt-4 max-w-2xl">
            Three moves. Each cycle feeds the next with real signal.
          </h2>
        </Reveal>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {chapters.map((ch, i) => (
          <article
            key={ch.n}
            className={i % 2 === 1 ? "bg-background/40" : "bg-transparent"}
          >
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-20">
              <Reveal>
                <p className="font-mono text-12 tracking-[0.16em] text-muted-foreground">
                  {ch.n} · {ch.kicker}
                </p>
                <h3 className="font-serif-display mt-4 text-[clamp(2.75rem,8vw,5rem)] leading-[0.92] tracking-[-0.04em] text-heading">
                  {ch.title}
                </h3>
                <p className="mt-5 max-w-md text-[16px] leading-7 text-muted-foreground text-pretty">
                  {ch.copy}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ch.channels.map((id) => (
                    <span
                      key={id}
                      className="inline-flex size-9 items-center justify-center rounded-[8px] border border-border bg-background text-foreground"
                    >
                      <ChannelMark id={id} />
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={2}>{ch.fragment}</Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
