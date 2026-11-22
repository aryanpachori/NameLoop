"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, animate } from "motion/react";
import { LoopMark } from "@/components/loop-mark";

type Phase = "boot" | "greet" | "tear" | "done";

const EASE = [0.2, 0, 0, 1] as const;
const STORAGE_KEY = "nameloop.welcome.v5";

/**
 * Welcome gate (once per session, ?welcome=1 to replay).
 * Large animated NameLoop mark is the focus → centre tear into homepage.
 */
export function HomeWelcome() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("boot");
  const [tear, setTear] = useState(0);
  const [size, setSize] = useState({ w: 1280, h: 800 });
  const [line, setLine] = useState(0);

  const active = phase === "greet" || phase === "tear";

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);

    const params = new URLSearchParams(window.location.search);
    const force = params.get("welcome") === "1";
    if (window.sessionStorage.getItem(STORAGE_KEY) && !force) {
      setPhase("done");
      return () => window.removeEventListener("resize", measure);
    }

    const t = window.setTimeout(() => setPhase("greet"), 120);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;

    if (reduce) {
      setLine(1);
      const t = window.setTimeout(() => startTear(), 1000);
      return () => window.clearTimeout(t);
    }

    const timers = [
      window.setTimeout(() => setLine(1), 400),
      window.setTimeout(() => startTear(), 3000),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, reduce]);

  useEffect(() => {
    if (phase !== "tear") return;
    const controls = animate(0, 1, {
      duration: 2.55,
      ease: [0.22, 0.08, 0.25, 1],
      onUpdate: setTear,
      onComplete: finish,
    });
    return () => controls.stop();
  }, [phase]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  function startTear() {
    setPhase("tear");
  }

  function finish() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
  }

  const clipPath = useMemo(() => {
    if (tear <= 0.001) return undefined;
    const hole = jaggedHolePx(tear, size.w, size.h);
    return `path(evenodd, "M0 0H${size.w}V${size.h}H0Z${hole}")`;
  }, [tear, size.w, size.h]);

  if (phase === "boot" || phase === "done") return null;

  const fade = tear > 0.14;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to NameLoop"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: "var(--background)",
          ...(clipPath ? { clipPath, WebkitClipPath: clipPath } : {}),
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, color-mix(in oklab, var(--brand) 16%, transparent), transparent 62%), radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in oklab, var(--brand) 8%, transparent), transparent 55%)",
          }}
        />
        <div className="paper-grain-overlay !z-0" aria-hidden />

        <motion.div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: fade ? 0 : 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className="font-mono text-12 uppercase tracking-[0.16em] text-muted-foreground">
            Early access
          </p>
          <p className="font-mono text-12 tabular-nums text-muted-foreground">NL · 01</p>
        </motion.div>

        {tear > 0.02 ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 48%, transparent ${Math.max(0, tear * 34)}%, color-mix(in oklab, var(--foreground) 14%, transparent) ${tear * 43}%, transparent ${tear * 54}%)`,
            }}
          />
        ) : null}

        <div className="relative flex h-full flex-col items-center justify-center px-6 pb-16 pt-20">
          {/* Hero brand — takes the animal’s place as main focus */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={reduce ? { opacity: 0, y: 12 } : { opacity: 0, y: -48, scale: 0.92 }}
            animate={{
              opacity: fade ? 0 : 1,
              y: fade ? 12 : 0,
              scale: tear > 0.2 ? 0.94 : 1,
            }}
            transition={{ duration: reduce ? 0.35 : 0.9, ease: EASE }}
          >
            <LoopMark size={96} className="sm:hidden" />
            <LoopMark size={128} className="hidden sm:block lg:hidden" />
            <LoopMark size={160} className="hidden lg:block" />
            <p className="mt-6 font-serif-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-tight text-foreground">
              Name<span className="text-brand">Loop</span>
            </p>
          </motion.div>

          <motion.p
            className="mt-8 max-w-lg text-center text-16 font-medium text-muted-foreground text-pretty sm:text-18"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: fade ? 0 : line >= 1 ? 1 : 0, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            Grow your product. Outbound that books. Inbound that compounds.
          </motion.p>
        </div>

      </div>
    </div>
  );
}

function jaggedHolePx(progress: number, w: number, h: number) {
  const cx = w * 0.5;
  const cy = h * 0.48;
  const maxR = Math.hypot(w, h) * 0.72;
  const base = progress * maxR;
  const points = 84;
  let d = "";
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const n1 = hash(i * 1.7 + 2.1);
    const n2 = hash(i * 4.3 + 9.7);
    const ragged =
      (n1 * 2 - 1) * 0.16 * progress * base + (n2 * 2 - 1) * 0.06 * progress * base;
    const x = cx + Math.cos(a) * (base + ragged);
    const y = cy + Math.sin(a) * (base * 0.92 + ragged * 0.9);
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : `L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

function hash(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}
