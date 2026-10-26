import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { HeroProduct } from "@/components/marketing/hero-product";
import { Reveal } from "@/components/marketing/reveal";
import { WaitlistEmail } from "@/components/marketing/waitlist-email";

const suite = [
  {
    n: "1",
    tag: "Discovery",
    title: "Find the opening",
    copy: "It names the buyer and why now. Before any note goes out.",
  },
  {
    n: "2",
    tag: "Outreach",
    title: "First note and followups",
    copy: "The first touch goes out where you set it to run. If they stay quiet, the next notes stay on the same thread.",
  },
  {
    n: "3",
    tag: "Content",
    title: "Keep showing up",
    copy: "Posts go live in the same loop. Later notes can cite them. Not a separate tool.",
  },
];

const examples = [
  {
    title: "Discovery",
    copy: "Harborstack opened a hire. NameLoop names Maya and why this week matters.",
  },
  {
    title: "Outreach",
    copy: "First note cites the hire. Day 3 and day 8 stay on that thread.",
  },
  {
    title: "Content",
    copy: "A close post goes live where you configured. The next note can mention the save.",
  },
  {
    title: "Conversion",
    copy: "They book 12 minutes. NameLoop marks the conversion.",
  },
];

const questions = [
  [
    "Is this an AI SDR?",
    "Those tools mostly send outbound email. NameLoop is the suite: discovery, outreach, and content.",
  ],
  [
    "Where does it run?",
    "You pick that when you set it up. Same loop everywhere you turn on.",
  ],
  [
    "What actually runs?",
    "It finds the opening, sends the next note, and keeps the posts going. Then it marks the conversion.",
  ],
  [
    "How do I get in?",
    "Leave your email. We email you when a seat opens. First 7 days are free, then $10 a month.",
  ],
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-wash px-4 pb-16 pt-14">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <Reveal instant delay={1}>
              <h1 className="heading-hero">
                Find them. Reach them.
                <br />
                Keep <span className="accent-word">showing up.</span>
              </h1>
            </Reveal>
            <Reveal instant delay={2}>
              <p className="mt-5 max-w-[38rem] text-[18px] leading-[1.65] text-muted-foreground">
                Discovery, outreach, and content. One suite. You pick where it runs.
              </p>
            </Reveal>
          </div>
          <Reveal instant delay={3} className="mx-auto mt-12 w-full max-w-5xl">
            <HeroProduct />
          </Reveal>
          <Reveal instant delay={4} className="mx-auto mt-8 flex w-full max-w-5xl flex-wrap justify-center gap-2">
            {["Discovery", "Outreach", "Content", "You pick where"].map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1.5 text-[13px] text-muted-foreground ring-1 ring-black/6">
                {item}
              </span>
            ))}
          </Reveal>
        </section>

        <section id="suite" className="px-4 py-24">
          <Reveal className="mx-auto w-full max-w-3xl text-center">
            <h2 className="heading-1">More than an AI SDR</h2>
            <p className="mt-4 text-[17px] text-muted-foreground">
              Most of those tools stop at outbound email. You get discovery, outreach, and content in one loop.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid w-full max-w-6xl gap-4 lg:grid-cols-3">
            {suite.map((step, index) => (
              <Reveal key={step.n} delay={(index + 1) as 1 | 2 | 3}>
                <article className="soft-card lift flex h-full flex-col p-6">
                  <p className="text-[13px] text-muted-foreground">
                    {step.n}. {step.tag}
                  </p>
                  <h3 className="mt-4 text-[22px] font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="loop" className="px-4 py-24">
          <Reveal className="mx-auto w-full max-w-3xl text-center">
            <h2 className="heading-1">What it looks like</h2>
          </Reveal>
          <div className="mx-auto mt-12 grid w-full max-w-6xl gap-4 md:grid-cols-2">
            {examples.map((play, index) => (
              <Reveal key={play.title} delay={((index % 2) + 1) as 1 | 2}>
                <article className="soft-card lift h-full p-6">
                  <h3 className="text-[20px] font-semibold tracking-tight">{play.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{play.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="px-4 py-24">
          <div className="mx-auto w-full max-w-3xl">
            <Reveal>
              <h2 className="heading-1 text-center">Questions</h2>
            </Reveal>
            <div className="mt-10 border-b border-black/8">
              {questions.map(([q, a]) => (
                <details key={q} className="group border-t border-black/8 py-5">
                  <summary className="cursor-pointer list-none text-[18px] font-semibold tracking-tight hover:text-brand [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {q}
                      <span className="text-[22px] font-normal text-muted-foreground group-open:hidden">+</span>
                      <span className="hidden text-[22px] font-normal text-muted-foreground group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24">
          <Reveal className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <h2 className="heading-1">Join the waitlist</h2>
            <p className="mt-4 max-w-xl text-[17px] text-muted-foreground">
              Enter your email. We email you when a seat opens.
            </p>
            <WaitlistEmail className="mt-8" />
            <p className="mt-4 text-[13px] text-muted-foreground">7 days free, then $10 a month.</p>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
