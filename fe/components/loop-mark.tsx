"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated infinity mark for NameLoop.
 * Continuous stroke flow — calm, no glow. Static under reduced motion.
 */
export function LoopMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <svg
      className={cn("shrink-0 text-brand", className)}
      width={size}
      height={Math.round(size * 0.56)}
      viewBox="0 0 48 27"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 13.5C8.5 8.2 12.6 5 17.2 5c3.2 0 5.6 1.5 6.8 3.6C25.2 6.5 27.6 5 30.8 5 35.4 5 39.5 8.2 39.5 13.5S35.4 22 30.8 22c-3.2 0-5.6-1.5-6.8-3.6C22.8 20.5 20.4 22 17.2 22 12.6 22 8.5 18.8 8.5 13.5Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={reduce ? 1 : 0.28}
      />
      {!reduce ? (
        <path
          d="M8.5 13.5C8.5 8.2 12.6 5 17.2 5c3.2 0 5.6 1.5 6.8 3.6C25.2 6.5 27.6 5 30.8 5 35.4 5 39.5 8.2 39.5 13.5S35.4 22 30.8 22c-3.2 0-5.6-1.5-6.8-3.6C22.8 20.5 20.4 22 17.2 22 12.6 22 8.5 18.8 8.5 13.5Z"
          stroke="currentColor"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          style={{
            strokeDasharray: "22 78",
            animation: "nameloop-flow 3.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
          }}
        />
      ) : null}
      <style>{`@keyframes nameloop-flow{to{stroke-dashoffset:-100}}`}</style>
    </svg>
  );
}
