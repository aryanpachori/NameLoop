import { Badge } from "@/components/ui/badge";
import type { Owner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OwnerBadge({ owner, className }: { owner: Owner; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[22px] border-transparent font-medium",
        owner === "ai"
          ? "bg-ai text-ai-foreground"
          : "bg-human text-human-foreground",
        className
      )}
    >
      {owner === "ai" ? "AI" : "Human"}
    </Badge>
  );
}
