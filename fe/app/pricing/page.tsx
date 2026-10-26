import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { WaitlistEmail } from "@/components/marketing/waitlist-email";

const includes = [
  "Discovery, outreach, and content",
  "Followups on the same thread",
  "You pick where it runs",
  "Conversion tracked in the loop",
];

const questions = [
  [
    "Is this an AI SDR?",
    "Those tools mostly send outbound email. NameLoop is the suite: discovery, outreach, and content.",
  ],
  [
    "What runs on day one?",
    "Discovery, first notes, followups, and content. You pick where it runs.",
  ],
  [
    "Can I cancel?",
    "Yes. First 7 days are free. After that it is $10 a month. Cancel anytime.",
  ],
  [
    "When do I pay?",
    "You do not pay for the first 7 days. After that it is $10 a month.",
  ],
];

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-wash px-4 py-24">
          <div className="mx-auto w-full max-w-3xl text-center">
            <h1 className="heading-hero text-[clamp(2.2rem,5vw,3.6rem)]">
              7 days <span className="accent-word">free.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[36rem] text-[18px] text-muted-foreground">
              Then $10 a month. Discovery, outreach, and content.
            </p>
          </div>
        </section>
        <section className="px-4 pb-24">
          <article className="soft-card mx-auto flex w-full max-w-lg flex-col p-8">
            <p className="text-[13px] font-medium text-muted-foreground">Complete suite</p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[48px] font-bold tracking-tight tabular-nums">
              $10
              <span className="text-[18px] font-medium text-muted-foreground"> / month</span>
            </p>
            <p className="mt-2 text-[15px] text-muted-foreground">7 days free first. Then $10 a month. Cancel anytime.</p>
            <div className="mt-6 space-y-2 border-t border-black/6 pt-6 text-[15px]">
              {includes.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <WaitlistEmail className="mt-8 max-w-none" />
          </article>
        </section>
        <section className="px-4 pb-24">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="heading-1 text-center">Questions</h2>
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
                  <p className="mt-3 text-[16px] text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
