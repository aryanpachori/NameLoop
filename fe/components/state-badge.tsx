import { Badge } from "@/components/ui/badge";
import { STATE_LABELS } from "@/lib/labels";
import type { RecordState } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<RecordState, string> = {
  ai_working: "border-transparent bg-ai text-ai-foreground",
  waiting_approval: "border-transparent bg-human text-human-foreground",
  needs_human: "border-transparent bg-destructive text-primary-foreground",
  human_owned: "border-transparent bg-foreground text-background",
  paused: "border-transparent bg-muted text-muted-foreground",
};

export function StateBadge({ state, className }: { state: RecordState; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-[22px]", styles[state], className)}>
      {STATE_LABELS[state]}
    </Badge>
  );
}
