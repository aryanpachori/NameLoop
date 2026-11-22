"use client";

import { cn } from "@/lib/utils";

const SRC = {
  walk: "/marketing/nameloop-fox-walk.png",
  wave: "/marketing/nameloop-fox-wave.png",
  idle: "/marketing/nameloop-fox-wave.png",
} as const;

/**
 * NameLoop fox companion (Gemini assets).
 * Walk / wave sprites with a light hop on walk.
 */
export function LoopPet({
  pose = "wave",
  className,
}: {
  pose?: "walk" | "wave" | "idle";
  className?: string;
}) {
  const walking = pose === "walk";

  return (
    <div
      className={cn(
        "loop-fox relative",
        walking && "loop-fox--walk",
        className
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC[pose]}
        alt=""
        width={420}
        height={480}
        draggable={false}
        className="h-auto w-full select-none"
      />
      <style>{`
        @keyframes loop-fox-hop {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .loop-fox--walk {
          animation: loop-fox-hop 0.34s cubic-bezier(0.2, 0, 0, 1) infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .loop-fox--walk { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
