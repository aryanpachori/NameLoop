"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export type FaqItem = { q: string; a: string };

function FaqRow({ q, a, index }: FaqItem & { index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-t border-border"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left sm:py-6"
      >
        <span className="text-17 font-medium tracking-tight text-pretty transition-colors duration-150 hover:text-brand">
          {q}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mt-0.5 shrink-0 font-mono text-18 font-normal text-muted-foreground"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="pb-5 max-w-2xl text-15 text-muted-foreground text-pretty sm:pb-6">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="border-b border-border">
      {items.map(({ q, a }, i) => (
        <FaqRow key={q} q={q} a={a} index={i} />
      ))}
    </div>
  );
}
