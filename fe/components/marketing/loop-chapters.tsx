"use client";

import { motion } from "motion/react";
import { ChannelMark, channelLabel } from "@/components/channel-mark";
import { Reveal } from "@/components/marketing/reveal";
import { homeLoop, type LoopChapter } from "@/lib/home-copy";
import type { ChannelId } from "@/lib/types";

function ChapterCard({ card }: { card: LoopChapter["card"] }) {
  if (card.scores) {
    return (
      <ul className="flex h-full flex-col justify-between rounded-[12px] border border-border bg-card p-5">
        {card.scores.map((row, idx) => (
          <li
            key={row.id}
            className={
              idx === 0
                ? "flex flex-col gap-2 pb-3"
                : "flex flex-col gap-2 border-t border-border py-3 last:pb-0"
            }
          >
            <div className="flex items-center justify-between gap-3 text-14">
              <span className="inline-flex items-center gap-2.5">
                <ChannelMark id={row.id} />
                <span className="font-medium">{channelLabel(row.id)}</span>
              </span>
              <span className="font-mono text-13 text-muted-foreground">{row.score}</span>
            </div>
            {/* Animated score bar — fills on scroll-into-view */}
            <motion.div
              className="score-bar"
              initial={{ ["--pct" as string]: 0 }}
              whileInView={{ ["--pct" as string]: row.score }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.12 }}
              style={{ ["--pct" as string]: 0 }}
              role="presentation"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[12px] border border-border bg-card p-5 card-gradient-border card-top-glow">
      <div>
        <p className="section-eyebrow">{card.eyebrow}</p>
        {card.title ? (
          <p className="mt-4 text-15 font-medium tracking-tight">{card.title}</p>
        ) : null}
        {card.detail ? (
          <p className="mt-2 text-13 leading-5 text-muted-foreground">{card.detail}</p>
        ) : null}
      </div>
      <div className="mt-6 border-t border-border pt-4">
        {card.bigNumber ? (
          <>
            <p className="font-serif-display text-28 text-heading">
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
    <section className="relative border-t border-border bg-muted/30 overflow-hidden">
      {/* Subtle radial glow anchored to the top-right */}
      <div
        className="glow-blob"
        style={{
          width: "480px",
          height: "320px",
          background: "rgba(77, 130, 255, 0.055)",
          top: "-60px",
          right: "-80px",
        }}
        aria-hidden="true"
      />
      <div className="marketing-shell section-pad relative z-[1]">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-eyebrow">{homeLoop.eyebrow}</p>
            <h2 className="heading-1 mt-3">{homeLoop.headline}</h2>
            {"support" in homeLoop && homeLoop.support ? (
              <p className="mt-4 text-15 text-muted-foreground text-pretty">
                {homeLoop.support}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-8">
          {homeLoop.chapters.map((ch, i) => (
            <motion.article
              key={ch.n}
              className="flex h-full flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.12,
              }}
            >
              <p className="section-eyebrow">
                {ch.n} · {ch.kicker}
              </p>
              <h3 className="font-serif-display mt-3 text-36 text-heading lg:text-40">
                {ch.title}
              </h3>
              <p className="mt-4 min-h-[4.5rem] text-15 text-muted-foreground text-pretty">
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
