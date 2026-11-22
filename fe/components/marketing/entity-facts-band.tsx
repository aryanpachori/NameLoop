import { homeEntityFacts } from "@/lib/home-copy";

/** Server-rendered entity facts for crawlers and AI citation (no client-only wrapper). */
export function EntityFactsBand() {
  return (
    <section
      className="section-pad border-t border-border bg-muted/40"
      aria-labelledby="entity-facts-heading"
    >
      <div className="marketing-shell max-w-3xl">
        <p className="section-eyebrow">{homeEntityFacts.eyebrow}</p>
        <h2 id="entity-facts-heading" className="heading-1 mt-3">
          {homeEntityFacts.headline}
        </h2>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-16 leading-7 text-muted-foreground text-pretty">
          {homeEntityFacts.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}