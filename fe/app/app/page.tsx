"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/stat";
import { formatDue } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";

const urgencyCopy = {
  now: "Now",
  today: "Today",
  week: "This week",
};

function needsYouHref(text: string) {
  if (/reply|replies|northwind|human/i.test(text)) return "/app/pipeline";
  if (/e1|approve|harborstack|claim/i.test(text)) return "/app/approvals";
  if (/atlas|icp|dq/i.test(text)) return "/app/pipeline";
  return "/app/outreach";
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-14">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TodayPage() {
  const { state } = useWorkspace();
  const { brief, gtm, accounts } = state;
  const pending = state.drafts.filter((draft) => draft.status === "pending").length;
  const ready = accounts.filter((a) => a.trackerStage === "ready_to_send").length;
  const replied = accounts.filter((a) => a.trackerStage === "replied").length;
  const dueNow = state.queue.filter((item) => item.urgency === "now").length;
  const nextSlot = gtm.slots.find((s) => s.sent < s.planned) ?? gtm.slots[gtm.slots.length - 1];
  const capPct = Math.round((gtm.usedToday / gtm.hardDailyCap) * 100);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${state.tenant.name} · morning brief`}
        title="Good morning. Here is where the machine stands."
        description={brief.sprintProgress}
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/app/pipeline" variant="outline">
              Tracker
            </ButtonLink>
            <ButtonLink href="/app/outreach" variant="outline">
              Outreach
            </ButtonLink>
          </div>
        }
      />

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-foreground transition-[width] duration-200 ease-out"
            style={{ width: `${capPct}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-12 text-muted-foreground">
          {gtm.usedToday}/{gtm.hardDailyCap} sends today · next slot {nextSlot.label}
          {gtm.paused ? " · PAUSED" : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ready to send" value={String(ready)} />
        <Stat label="Drafts waiting" value={String(pending)} />
        <Stat label="Human replies" value={String(replied)} />
        <Stat label="Due now" value={String(dueNow)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface space-y-3 p-4">
          <h2 className="text-16 font-semibold">Overnight</h2>
          <List items={brief.overnight} />
        </section>
        <section className="surface space-y-3 p-4">
          <h2 className="text-16 font-semibold">Needs you</h2>
          <ul className="space-y-2 text-14">
            {brief.needsYou.map((item) => (
              <li key={item}>
                <Link
                  href={needsYouHref(item)}
                  className="group -mx-2 flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 hover:bg-muted"
                >
                  {item}
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface space-y-3 p-4">
          <h2 className="text-16 font-semibold">Today&apos;s plan</h2>
          <List items={brief.todayPosts} />
          <ul className="space-y-1 border-t border-border pt-3 text-13 text-muted-foreground">
            {gtm.slots.map((slot) => (
              <li key={slot.id} className="flex justify-between font-mono tabular-nums">
                <span>{slot.label}</span>
                <span>
                  {slot.sent}/{slot.planned}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Queue</h2>
        {state.queue.length === 0 ? (
          <p className="surface p-4 text-14 text-muted-foreground">Queue is clear.</p>
        ) : (
          <ul className="surface divide-y divide-border">
            {state.queue.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex flex-col gap-1 px-4 py-3 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-14 font-medium">{item.title}</p>
                    <p className="text-13 text-muted-foreground">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 text-12 text-muted-foreground">
                    <span>{urgencyCopy[item.urgency]}</span>
                    <span className="font-mono tabular-nums">{formatDue(item.dueAt)}</span>
                    <span className="text-foreground">{item.actionLabel}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
