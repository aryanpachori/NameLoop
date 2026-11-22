"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { LoopMark } from "@/components/loop-mark";
import { WordReveal } from "@/components/marketing/word-reveal";

const DEFAULT_PATHWAY = [
  { n: "01", label: "Who might buy" },
  { n: "02", label: "Where they hang out" },
  { n: "03", label: "What to post" },
  { n: "04", label: "Meetings in" },
] as const;

/**
 * Shared left brand panel for login / signup / auth screens.
 * Same atmosphere, orbits, and type language everywhere.
 */
export function AuthBrandPanel({
  headline,
  accentWords = ["meetings"],
  body,
  footer = "Nothing goes live until you approve.",
  pathway = DEFAULT_PATHWAY,
}: {
  headline: string;
  accentWords?: string[];
  body: string;
  footer?: string;
  pathway?: readonly { n: string; label: string }[];
}) {
  return (
    <aside className="relative hidden overflow-hidden border-r border-border lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 50%), var(--muted)",
        }}
      />
      <div
        aria-hidden
        className="auth-orbit pointer-events-none absolute -right-16 top-1/4 size-[28rem] rounded-full border border-border/60"
      />
      <div
        aria-hidden
        className="auth-orbit-slow pointer-events-none absolute -left-24 bottom-8 size-[22rem] rounded-full border border-dashed border-border/50"
      />

      <div className="relative z-10 p-10">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="relative z-10 max-w-md px-10 pb-6">
        <LoopMark size={56} className="mb-8" />
        <h1 className="heading-1">
          <WordReveal text={headline} accentWords={accentWords} instant stagger={0.06} />
        </h1>
        <p
          className="mt-4 text-16 text-muted-foreground text-pretty auth-fade"
          style={{ animationDelay: "0.45s" }}
        >
          {body}
        </p>

        <ol className="mt-10 space-y-3" aria-label="The NameLoop pathway">
          {pathway.map((step, i) => (
            <li
              key={step.n}
              className="auth-fade flex items-baseline gap-4"
              style={{ animationDelay: `${0.55 + i * 0.08}s` }}
            >
              <span className="font-mono text-12 tabular-nums text-brand">{step.n}</span>
              <span className="text-15 font-medium text-foreground">{step.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="relative z-10 px-10 pb-10 text-13 text-muted-foreground">{footer}</p>

      <style>{`
        @keyframes auth-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes auth-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-fade {
          animation: auth-fade-up 0.55s cubic-bezier(0.2, 0, 0, 1) both;
        }
        .auth-orbit {
          animation: auth-orbit 48s linear infinite;
        }
        .auth-orbit-slow {
          animation: auth-orbit 72s linear infinite reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-fade,
          .auth-orbit,
          .auth-orbit-slow {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </aside>
  );
}
