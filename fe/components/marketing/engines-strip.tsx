"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/marketing/reveal";
import { homeEngines } from "@/lib/home-copy";

export function EnginesStrip() {
  return (
    <section className="section-pad border-t border-border">
      <div className="marketing-shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-eyebrow">{homeEngines.eyebrow}</p>
            <h2 className="heading-1 mt-3">{homeEngines.headline}</h2>
            <p className="mt-4 text-15 text-muted-foreground text-pretty">
              {homeEngines.support}
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {homeEngines.cards.map((card, i) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.1,
              }}
              className="relative flex flex-col overflow-hidden rounded-[12px] border border-border bg-card p-6 sm:p-8"
            >
              <p className="section-eyebrow">{card.eyebrow}</p>
              <h3 className="mt-3 font-serif-display text-28 leading-8 tracking-tight text-heading">
                {card.title}
              </h3>
              <p className="mt-3 text-15 text-muted-foreground text-pretty">{card.copy}</p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5">
                {card.beats.map((beat) => (
                  <li
                    key={beat}
                    className="flex items-start gap-2.5 text-14 font-medium tracking-tight"
                  >
                    <svg
                      aria-hidden
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      className="mt-1 shrink-0 text-brand"
                    >
                      <path
                        d="M2.5 6.5L5 9L10.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {beat}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
