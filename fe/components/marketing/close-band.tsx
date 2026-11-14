import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/marketing/reveal";

export function CloseBand() {
  return (
    <section className="relative overflow-hidden border-t border-border px-4 section-pad">
      <div className="paper-grain-overlay" aria-hidden="true" />
      <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <p className="font-mono text-12 uppercase tracking-[0.18em] text-muted-foreground">
            Early access
          </p>
          <h2 className="heading-1 mt-4 max-w-xl">
            Paste a URL.{" "}
            <span className="accent-word">Get in.</span> We ask the rest inside.
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-6 text-muted-foreground">
            AI drafts who to sell to and where to show up. You approve every send until you trust the channel.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/signup" size="lg">
              Get started
            </ButtonLink>
            <ButtonLink href="/pricing" size="lg" variant="outline">
              Pricing
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
