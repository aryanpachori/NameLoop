import { cn } from "@/lib/utils";

export function ProductFrame({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] bg-card text-card-foreground ring-1 ring-border",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        <span className="size-2 rounded-full bg-muted-foreground/40" />
        {title ? (
          <span className="ml-2 text-[14px] font-light text-muted-foreground">{title}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
