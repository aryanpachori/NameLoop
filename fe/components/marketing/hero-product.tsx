"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    label: "Discovery",
    title: "Harborstack is a fit",
    meta: "Maya Chen, VP Finance. Hire opened Tuesday.",
  },
  {
    label: "Outreach",
    title: "First note to Harborstack",
    meta: "Cites the hire. First note is out.",
  },
  {
    label: "Followups",
    title: "Day 3 and day 8",
    meta: "Same thread. Still no reply, so the next note goes.",
  },
  {
    label: "Content",
    title: "Close post is live",
    meta: "Published where you set it to run. Next note can cite it.",
  },
  {
    label: "Conversion",
    title: "Harborstack booked 12 minutes",
    meta: "Call on the calendar. Conversion is marked.",
  },
];

const LAST = steps.length - 1;

export function HeroProduct() {
  const [step, setStep] = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(LAST);
      return;
    }
    let index = 0;
    let timer = 0;
    let cancelled = false;
    const later = (fn: () => void, ms: number) => {
      timer = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };
    const tick = () => {
      index += 1;
      if (index > LAST) {
        later(() => {
          setResetting(true);
          index = 0;
          setStep(0);
          requestAnimationFrame(() => {
            if (!cancelled) setResetting(false);
          });
          later(tick, 700);
        }, 1600);
        return;
      }
      setStep(index);
      later(tick, index === LAST ? 1400 : 720);
    };
    setStep(0);
    later(tick, 480);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const first = 100 / steps.length / 2;
  const span = 100 - first * 2;
  const token = first + (step / LAST) * span;
  const fill = (step / LAST) * span;
  const scene = steps[step];

  return (
    <div className="soft-window overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/6 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-black/12" />
          <span className="size-2 rounded-full bg-black/12" />
          <span className="size-2 rounded-full bg-black/12" />
          <span className="ml-2 text-[13px] text-muted-foreground">The suite</span>
        </div>
        <span className="ready-chip rounded-full bg-[#eef2ff] px-2.5 py-1 text-[12px] font-medium text-brand">
          {step === LAST ? "Converted" : "Running"}
        </span>
      </div>

      <div className="px-3 pb-5 pt-7 sm:px-6">
        <div className="relative">
          <div
            className="absolute top-[5px] h-0.5 rounded-full bg-[#ececee]"
            style={{ left: `${first}%`, width: `${span}%` }}
          />
          <div
            className={`pipe-progress absolute top-[5px] h-0.5 rounded-full bg-brand ${resetting ? "is-reset" : ""}`}
            style={{ left: `${first}%`, width: `${fill}%` }}
          />
          <div
            className={`pipe-token absolute top-px size-2.5 rounded-full bg-brand ${resetting ? "is-reset" : ""}`}
            style={{ left: `${token}%` }}
          />
          <ol className="relative flex">
            {steps.map((item, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <li key={item.label} className="flex flex-1 flex-col items-center text-center">
                  <span
                    className={`mb-3 size-2.5 rounded-full ring-2 ring-white ${
                      current ? "node-pulse bg-brand" : done ? "bg-brand" : "bg-black/15"
                    }`}
                  />
                  <p
                    className={`text-[11px] font-medium sm:text-[13px] ${
                      current || done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="border-t border-black/6 p-4 sm:p-5">
        <div key={scene.label} className="row-in rounded-2xl bg-[#f7f8ff] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] text-muted-foreground">{scene.label}</p>
              <p className="mt-1 text-[16px] font-medium">{scene.title}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{scene.meta}</p>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[12px] text-muted-foreground">
              {step === LAST ? "done" : "now"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
