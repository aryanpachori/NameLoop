import { LoopMark } from "@/components/loop-mark";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  markOnly,
  stacked,
}: {
  className?: string;
  markOnly?: boolean;
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2.5 text-[22px] font-semibold tracking-tight text-current",
          className
        )}
      >
        <LoopMark size={40} />
        <span>
          Name<span className="text-brand">Loop</span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-current",
        className
      )}
    >
      <LoopMark size={28} />
      {markOnly ? (
        <span className="sr-only">NameLoop</span>
      ) : (
        <span>
          Name<span className="text-brand">Loop</span>
        </span>
      )}
    </span>
  );
}
