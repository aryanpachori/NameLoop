"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial word-by-word reveal (MengTo staggered-word-reveal).
 * Opacity + translateY only. Once. Respects prefers-reduced-motion. Visible without JS.
 */
export function WordReveal({
  text,
  className,
  accentWords = [],
  stagger = 0.07,
  baseDelay = 0,
  instant = false,
}: {
  text: string;
  className?: string;
  /** Case-insensitive match against trimmed words (punctuation kept on the word). */
  accentWords?: string[];
  stagger?: number;
  /** Extra delay in seconds before the first word. */
  baseDelay?: number;
  /** Start immediately (hero). Still staggers words. */
  instant?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setReady(true);
    if (reduce) {
      setVisible(true);
      return;
    }

    const show = () => setVisible(true);
    const node = ref.current;

    if (instant || !node || !("IntersectionObserver" in window)) {
      const outer = requestAnimationFrame(() => {
        requestAnimationFrame(show);
      });
      return () => cancelAnimationFrame(outer);
    }

    const rect = node.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight * 0.95;
    if (onScreen) {
      const outer = requestAnimationFrame(() => {
        requestAnimationFrame(show);
      });
      return () => cancelAnimationFrame(outer);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduce, instant]);

  const accent = new Set(accentWords.map((w) => w.toLowerCase()));
  const parts = text.split(/(\s+)/);
  let wordIndex = 0;

  return (
    <span
      ref={ref}
      className={cn("word-reveal", ready && "is-ready", visible && "is-visible", className)}
      aria-label={text}
    >
      {parts.map((part, i) => {
        if (!part.trim()) {
          return <span key={`s-${i}`}>{part}</span>;
        }
        const index = wordIndex++;
        const isAccent = accent.has(part.toLowerCase());
        return (
          <span
            key={`w-${i}`}
            className={cn("word-reveal__word", isAccent && "accent-word")}
            aria-hidden="true"
            style={
              {
                "--word-index": index,
                "--word-base-delay": `${baseDelay}s`,
                "--word-stagger": `${stagger}s`,
              } as CSSProperties
            }
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
