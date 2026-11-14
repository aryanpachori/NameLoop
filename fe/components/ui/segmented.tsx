"use client";

import { cn } from "@/lib/utils";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex h-9 items-center rounded-[8px] border border-border bg-muted p-0.5", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={cn(
              "h-8 rounded-[6px] px-3 text-13 font-medium transition-colors duration-150 ease-out",
              active ? "bg-card text-foreground shadow-none" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
