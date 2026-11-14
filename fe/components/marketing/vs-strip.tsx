import { Reveal } from "@/components/marketing/reveal";

const rows = [
  {
    label: "AI SDRs",
    copy: "Autonomous send. Volume first. You find out after the inbox fills.",
    tone: "mute" as const,
  },
  {
    label: "Sequencers",
    copy: "You already know the list and the channel. They run the cadence.",
    tone: "mute" as const,
  },
  {
    label: "NameLoop",
    copy: "AI finds who and where. You approve every draft. Winners compound into the next cycle.",
    tone: "accent" as const,
  },
];

export function VsStrip() {
  return (
    <section className="section-pad relative overflow-hidden border-t border-border px-4">
      <div className="paper-grain-overlay opacity-[0.03]" aria-hidden="true" />
      <div className="relative z-[1] mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-12 uppercase tracking-[0.18em] text-muted-foreground">
                Why not another AI SDR
              </p>
              <h2 className="heading-1 mt-4 max-w-2xl">
                Intelligence first.{" "}
                <span className="accent-word">Autopilot later</span> — when you trust it.
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-6 text-muted-foreground lg:text-right">
              Close comps automate the send. NameLoop starts one step earlier: who, where, then what to say.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 divide-y divide-border border-y border-border">
          {rows.map((row, i) => (
            <Reveal key={row.label} delay={(i === 0 ? 1 : i === 1 ? 2 : 3) as 1 | 2 | 3}>
              <li
                className={
                  row.tone === "accent"
                    ? "grid gap-4 bg-accent/40 py-8 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-10 sm:py-10"
                    : "grid gap-4 py-8 sm:grid-cols-[8rem_1fr_auto] sm:items-center sm:gap-10 sm:py-10"
                }
              >
                <p
                  className={
                    row.tone === "accent"
                      ? "font-mono text-12 tracking-[0.16em] text-brand"
                      : "font-mono text-12 tracking-[0.16em] text-muted-foreground"
                  }
                >
                  0{i + 1}
                </p>
                <div>
                  <p
                    className={
                      row.tone === "accent"
                        ? "font-serif-display text-[32px] leading-none tracking-tight text-heading sm:text-[40px]"
                        : "font-serif-display text-[32px] leading-none tracking-tight text-muted-foreground/80 line-through decoration-border sm:text-[40px]"
                    }
                  >
                    {row.label}
                  </p>
                  <p
                    className={
                      row.tone === "accent"
                        ? "mt-3 max-w-xl text-[16px] leading-6 text-foreground text-pretty"
                        : "mt-3 max-w-xl text-[15px] leading-6 text-muted-foreground text-pretty"
                    }
                  >
                    {row.copy}
                  </p>
                </div>
                <p className="font-mono text-12 text-muted-foreground sm:text-right">
                  {row.tone === "accent" ? "Your stack" : "Not this"}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
