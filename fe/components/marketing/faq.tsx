export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-b border-border">
      {items.map(({ q, a }) => (
        <details key={q} className="group border-t border-border py-5 sm:py-6">
          <summary className="cursor-pointer list-none text-17 font-medium tracking-tight transition-colors duration-150 hover:text-brand [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-6">
              <span className="text-pretty">{q}</span>
              <span
                aria-hidden
                className="mt-0.5 font-mono text-18 font-normal text-muted-foreground transition-transform duration-150 group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-15 text-muted-foreground text-pretty">{a}</p>
        </details>
      ))}
    </div>
  );
}
