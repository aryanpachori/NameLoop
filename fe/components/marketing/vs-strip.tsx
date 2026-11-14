import { cn } from "@/lib/utils";
import { Reveal } from "@/components/marketing/reveal";
import { homeVs } from "@/lib/home-copy";

export function VsStrip() {
  return (
    <section className="section-pad border-t border-border">
      <div className="marketing-shell">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-eyebrow">{homeVs.eyebrow}</p>
            <h2 className="heading-1 mt-3">{homeVs.headline}</h2>
            <p className="mt-4 text-15 text-muted-foreground text-pretty">
              {homeVs.support}
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[12px] border border-border bg-border sm:grid-cols-3">
          {homeVs.rows.map((row, i) => (
            <Reveal key={row.label} delay={(i === 0 ? 1 : i === 1 ? 2 : 3) as 1 | 2 | 3}>
              <li
                className={cn(
                  "relative flex min-h-[16rem] flex-col overflow-hidden p-6 sm:p-8",
                  row.accent
                    ? "bg-accent/50 card-gradient-border card-top-glow shimmer-once"
                    : "bg-card"
                )}
              >
                {/* Spotlight glow behind the featured card */}
                {row.accent && (
                  <div
                    className="glow-blob"
                    style={{
                      width: "180px",
                      height: "180px",
                      background: "rgba(77, 130, 255, 0.18)",
                      top: "-40px",
                      right: "-40px",
                    }}
                    aria-hidden="true"
                  />
                )}

                <p className="section-eyebrow relative z-[1]">
                  {row.accent ? "Your stack" : `0${i + 1}`}
                </p>
                <p
                  className={cn(
                    "relative z-[1] font-serif-display mt-4 text-28 sm:text-32",
                    row.accent ? "text-heading" : "text-muted-foreground"
                  )}
                >
                  {row.label}
                </p>
                <p
                  className={cn(
                    "relative z-[1] mt-4 flex-1 text-15 text-pretty",
                    row.accent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {row.copy}
                </p>
                <p
                  className={cn(
                    "relative z-[1] mt-6 font-mono text-12",
                    row.accent ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {row.tag}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
