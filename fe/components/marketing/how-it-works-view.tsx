"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { WaitlistEmail } from "@/components/marketing/waitlist-email";

const ease = [0.22, 1, 0.36, 1] as const;

const story = [
  {
    day: "Monday",
    title: "Priya pastes the Ledgerline site",
    copy: "NameLoop reads the offer, the buyer, and what she can say. She picks where the loop should run.",
  },
  {
    day: "Tuesday",
    title: "Discovery finds Harborstack",
    copy: "Maya Chen, VP Finance. A hire opened that morning. Why now is on the record before any note exists.",
  },
  {
    day: "Wednesday",
    title: "Outreach sends the first note",
    copy: "It cites the hire. If Maya stays quiet, day 3 and day 8 stay on the same thread.",
  },
  {
    day: "Friday",
    title: "Content keeps Ledgerline visible",
    copy: "A close post goes live where Priya set it to run. The next note can cite the save. Not a second tool.",
  },
  {
    day: "Next week",
    title: "Harborstack books 12 minutes",
    copy: "The loop marks the conversion. Same buyer, one record, discovery through the call.",
  },
];

const loop = [
  {
    n: "01",
    label: "Discovery",
    title: "Find the opening",
    copy: "Buyer, account, and why now. Before outreach starts.",
  },
  {
    n: "02",
    label: "Outreach",
    title: "First note and followups",
    copy: "The first touch goes out. Later notes stay on that thread.",
  },
  {
    n: "03",
    label: "Content",
    title: "Keep showing up",
    copy: "Posts run in the same loop. Later notes can cite them.",
  },
  {
    n: "04",
    label: "Conversion",
    title: "The booking lands",
    copy: "A reply or a call. One record. The loop marks it done.",
  },
];

const layers = [
  {
    kicker: "You",
    title: "Set the product. Pick where it runs.",
    copy: "That is the only setup. The places are yours. They are not a fixed path.",
  },
  {
    kicker: "The suite",
    title: "Discovery, outreach, content.",
    copy: "One loop. Not an SDR for mail plus a writer plus a list tool.",
  },
  {
    kicker: "The outcome",
    title: "Conversion on one record.",
    copy: "The same buyer moves from the opening to the booking.",
  },
];

function fade(reduce: boolean | null) {
  if (reduce) {
    return { hidden: { opacity: 1 }, show: { opacity: 1 } };
  }
  return {
    hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease },
    },
  };
}

export function HowItWorksView() {
  const reduce = useReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start 0.75", "end 0.35"],
  });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });
  const lineScale = useTransform(line, [0, 1], [0, 1]);
  const item = fade(reduce);

  return (
    <main className="flex-1">
      <section className="hero-wash px-4 pb-20 pt-16">
        <div className="mx-auto w-full max-w-4xl text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-[13px] font-medium text-muted-foreground"
          >
            How it works
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease, delay: 0.06 }}
            className="heading-hero mt-4"
          >
            One founder. One loop.
            <br />
            Discovery to <span className="accent-word">conversion.</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.16 }}
            className="mx-auto mt-5 max-w-[38rem] text-[18px] leading-[1.65] text-muted-foreground"
          >
            Priya runs Ledgerline. NameLoop finds the opening, does the outreach, and keeps the content going.
            She picks where it runs.
          </motion.p>
          <motion.nav
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-2 text-[13px]"
          >
            {[
              ["#story", "User story"],
              ["#end-to-end", "End to end"],
              ["#architecture", "Architecture"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full bg-white px-3 py-1.5 text-muted-foreground ring-1 ring-black/6 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        </div>
      </section>

      <section id="story" className="px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={item}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <h2 className="heading-1">User story</h2>
          <p className="mt-4 text-[17px] text-muted-foreground">
            A week with NameLoop, from the site paste to the booking.
          </p>
        </motion.div>
        <div ref={storyRef} className="relative mx-auto mt-14 w-full max-w-3xl">
          <div className="absolute top-2 bottom-2 left-[11px] w-px bg-black/8 sm:left-[15px]" />
          <motion.div
            style={{ scaleY: reduce ? 1 : lineScale }}
            className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-brand sm:left-[15px]"
          />
          <ol className="space-y-8">
            {story.map((beat, index) => (
              <motion.li
                key={beat.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.45 }}
                variants={item}
                transition={{ delay: index * 0.04 }}
                className="relative pl-10 sm:pl-12"
              >
                <span className="absolute top-2 left-0 size-6 rounded-full bg-white ring-2 ring-brand/25 sm:size-8">
                  <span className="absolute inset-1.5 rounded-full bg-brand sm:inset-2.5" />
                </span>
                <p className="text-[13px] text-muted-foreground">{beat.day}</p>
                <h3 className="mt-1 text-[22px] font-semibold tracking-tight">{beat.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{beat.copy}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section id="end-to-end" className="px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={item}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <h2 className="heading-1">End to end</h2>
          <p className="mt-4 text-[17px] text-muted-foreground">
            The same four moves, every time. You only set the product and where it runs.
          </p>
        </motion.div>
        <div className="mx-auto mt-12 grid w-full max-w-6xl gap-4 md:grid-cols-2">
          {loop.map((step, index) => (
            <motion.article
              key={step.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={item}
              transition={{ delay: index * 0.06 }}
              className="soft-card lift p-6"
            >
              <p className="text-[13px] text-muted-foreground">
                {step.n} · {step.label}
              </p>
              <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="architecture" className="px-4 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={item}
          className="mx-auto w-full max-w-3xl text-center"
        >
          <h2 className="heading-1">Architecture</h2>
          <p className="mt-4 text-[17px] text-muted-foreground">
            High level. Three layers. One loop.
          </p>
        </motion.div>

        <div className="mx-auto mt-12 w-full max-w-5xl space-y-3">
          {layers.map((layer, index) => (
            <motion.article
              key={layer.kicker}
              initial={reduce ? false : { opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.65, ease, delay: index * 0.1 }}
              className="soft-card overflow-hidden p-6 sm:p-8"
            >
              <p className="text-[13px] font-medium text-brand">{layer.kicker}</p>
              <h3 className="mt-2 text-[24px] font-semibold tracking-tight">{layer.title}</h3>
              <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">{layer.copy}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
          }}
          className="soft-window mx-auto mt-10 w-full max-w-5xl overflow-hidden p-6 sm:p-8"
        >
          <p className="text-[13px] text-muted-foreground">The loop</p>
          <ol className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {["Discovery", "Outreach", "Content", "Conversion"].map((node, index) => (
              <li key={node} className="flex flex-1 items-center gap-3">
                <motion.div
                  variants={item}
                  className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#f7f8ff] text-[14px] font-medium"
                >
                  {node}
                </motion.div>
                {index < 3 ? (
                  <motion.span
                    variants={{
                      hidden: { scaleX: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
                      show: {
                        scaleX: 1,
                        opacity: 1,
                        transition: { duration: 0.45, ease },
                      },
                    }}
                    className="hidden h-0.5 w-8 origin-left bg-brand sm:block"
                  />
                ) : null}
              </li>
            ))}
          </ol>
          <motion.p variants={item} className="mt-6 text-[14px] text-muted-foreground">
            You pick where it runs. Same loop everywhere you turn on.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-4 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={item}
          className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          <h2 className="heading-1">Join the waitlist</h2>
          <p className="mt-4 max-w-xl text-[17px] text-muted-foreground">
            Enter your email. We email you when a seat opens.
          </p>
          <WaitlistEmail className="mt-8" />
          <p className="mt-4 text-[13px] text-muted-foreground">7 days free, then $10 a month.</p>
        </motion.div>
      </section>
    </main>
  );
}
