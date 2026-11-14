import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("surface flex flex-col items-start gap-3 p-6", className)}>
      <h3 className="text-16 font-semibold tracking-tight">{title}</h3>
      <p className="max-w-md text-14 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
