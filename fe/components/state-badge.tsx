import { Badge } from "@/components/ui/badge";
import { STATE_LABELS } from "@/lib/labels";
import type { RecordState } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<RecordState, string> = {
  ai_working: "border-transparent bg-ai text-ai-foreground",
  waiting_approval: "border-transparent bg-human text-human-foreground",
  needs_human: "border-transparent bg-[#FEECEC] text-[#B42318] dark:bg-[#3A1512] dark:text-[#F97066]",
  human_owned: "border-transparent bg-foreground text-background",
  paused: "border-transparent bg-muted text-muted-foreground",
  live: "border-transparent bg-success text-success-foreground",
  scheduled: "border-transparent bg-muted text-foreground",
  failed: "border-transparent bg-[#FEECEC] text-[#B42318] dark:bg-[#3A1512] dark:text-[#F97066]",
};

export function StateBadge({
  state,
  label,
  className,
}: {
  state: RecordState;
  label?: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("rounded-[8px] text-12 font-medium", styles[state], className)}>
      {label ?? STATE_LABELS[state]}
    </Badge>
  );
}
