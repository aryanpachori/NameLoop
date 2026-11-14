import { ChannelMark, channelLabel } from "@/components/channel-mark";
import { Reveal } from "@/components/marketing/reveal";
import { homeLoop } from "@/lib/home-copy";
import type { ChannelId } from "@/lib/types";

function ChapterCard({
  card,
}: {
  card: (typeof homeLoop.chapters)[number]["card"];
}) {
  if (card.scores) {
    return (
      <ul className="flex h-full flex-col justify-between rounded-[12px] border border-border bg-card p-5">
        {card.scores.map((row, idx) => (
          <li
            key={row.id}
            className={
              idx === 0
                ? "flex items-center justify-between gap-3 pb-3 text-14"
                : "flex items-center justify-between gap-3 border-t border-border py-3 text-14 last:pb-0"
            }
          >
            <span className="inline-flex items-center gap-2.5">
              <ChannelMark id={row.id} />
              <span className="font-medium">{channelLabel(row.id)}</span>
            </span>
            <span className="font-mono text-muted-foreground">{row.score}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-[12px] border border-border bg-card p-5">
      <div>
        <p className="section-eyebrow">{card.eyebrow}</p>
        {card.title ? (
          <p className="mt-4 text-[15px] font-medium tracking-tight">{card.title}</p>
        ) : null}
        {card.detail ? (
          <p className="mt-2 text-13 leading-5 text-muted-foreground">{card.detail}</p>
        ) : null}
      </div>
      <div className="mt-6 border-t border-border pt-4">
        {card.bigNumber ? (
          <>
            <p className="font-serif-display text-[28px] leading-none tracking-tight text-heading">
              {card.bigNumber}
            </p>
            {card.footerRight ? (
              <p className="mt-2 text-12 text-muted-foreground">{card.footerRight}</p>
            ) : null}
          </>
        ) : (
          <div className="flex items-center justify-between">
            {card.footerLeft ? (
              <span className="font-mono text-12 text-brand">{card.footerLeft}</span>
            ) : null}
            {card.footerRight ? (
              <span className="text-12 text-muted-foreground">{card.footerRight}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function LoopChapters() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="marketing-shell section-pad">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-eyebrow">{homeLoop.eyebrow}</p>
            <h2 className="heading-1 mt-3">{homeLoop.headline}</h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-8">
          {homeLoop.chapters.map((ch, i) => (
            <Reveal key={ch.n} delay={(i === 0 ? 1 : i === 1 ? 2 : 3) as 1 | 2 | 3}>
              <article className="flex h-full flex-col">
                <p className="section-eyebrow">
                  {ch.n} · {ch.kicker}
                </p>
                <h3 className="font-serif-display mt-3 text-[36px] leading-none tracking-tight text-heading lg:text-[40px]">
                  {ch.title}
                </h3>
                <p className="mt-4 min-h-[4.5rem] text-[15px] leading-6 text-muted-foreground text-pretty">
                  {ch.copy}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ch.channels.map((id) => (
                    <span
                      key={id}
                      className="inline-flex size-8 items-center justify-center rounded-[8px] border border-border bg-background text-foreground"
                    >
                      <ChannelMark id={id as ChannelId} />
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex-1 [&_>_*]:h-full [&_>_*]:min-h-[10.5rem]">
                  <ChapterCard card={ch.card} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
