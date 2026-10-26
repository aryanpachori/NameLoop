import Image from "next/image";
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
      <span className={cn("inline-flex items-center gap-2.5 text-[22px] font-semibold tracking-tight text-current", className)}>
        <Image
          src="/logo-mark.png"
          alt=""
          width={72}
          height={72}
          className="h-9 w-auto"
          priority
        />
        <span>
          Name<span className="text-brand">Loop</span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-current", className)}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={48}
        height={26}
        className="h-6 w-auto"
        priority
      />
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
