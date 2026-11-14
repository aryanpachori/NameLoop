"use client";

import { useState } from "react";
import { ChannelMark } from "@/components/channel-mark";
import { StateBadge } from "@/components/state-badge";
import { Button } from "@/components/ui/button";
import type { ChannelId, RecordState } from "@/lib/types";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  channel: ChannelId;
  kind: string;
  title: string;
  to: string;
  body: string;
  state: RecordState;
};

const SEED: Item[] = [
  {
    id: "a",
    channel: "email",
    kind: "Email, step 1 of 3",
    title: "Maya Chen, Harborstack",
    to: "To: maya@harborstack.io",
    body: "Hi Maya. Saw Harborstack opened a Finance Manager role this week. Teams at that stage tend to feel the close drag first. We cut it from 9 days to 4 for a team your size. Worth a short look?",
    state: "waiting_approval",
  },
  {
    id: "b",
    channel: "linkedin",
    kind: "Post, Thursday",
    title: "The month-end close checklist",
    to: "From: Priya Nair",
    body: "Nine steps we run every month before anyone opens a spreadsheet. Number 6 is the one most teams skip.",
    state: "waiting_approval",
  },
  {
    id: "c",
    channel: "email",
    kind: "Reply",
    title: "Dev Patel asks about pricing",
    to: "Thread with dev@northbeam.co",
    body: "Pricing question. Needs a person to answer.",
    state: "needs_human",
  },
  {
    id: "d",
    channel: "x",
    kind: "Post, Friday",
    title: "What changed at 40 employees",
    to: "From: Priya Nair",
    body: "The first hire that fixes your books is rarely the one you expect.",
    state: "waiting_approval",
  },
];

export function ApprovalInbox() {
  const [items, setItems] = useState(SEED);
  const [activeId, setActiveId] = useState("a");
  const active = items.find((i) => i.id === activeId) ?? items[0];
  const waiting = items.filter((i) => i.state === "waiting_approval").length;

  function approve() {
    setItems((prev) => prev.map((i) => (i.id === active.id ? { ...i, state: "scheduled" } : i)));
    const next = items.find((i) => i.id !== active.id && i.state === "waiting_approval");
    if (next) setActiveId(next.id);
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-border bg-card text-card-foreground">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-13 font-medium">Approvals</p>
        <p className="font-mono text-12 tabular-nums text-muted-foreground">{waiting} waiting</p>
      </div>
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <ul className="divide-y divide-border border-b border-border md:border-b-0 md:border-r">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveId(item.id)}
                aria-current={item.id === active.id ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-muted",
                  item.id === active.id && "bg-muted"
                )}
              >
                <ChannelMark id={item.channel} className="mt-0.5 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-13 font-medium">{item.title}</span>
                  <span className="block truncate text-12 text-muted-foreground">{item.kind}</span>
                  <StateBadge state={item.state} className="mt-2" />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col p-5">
          <div className="flex items-center gap-2 text-12 text-muted-foreground">
            <ChannelMark id={active.channel} className="text-muted-foreground" />
            <span>{active.kind}</span>
          </div>
          <p className="mt-2 text-13 font-medium">{active.title}</p>
          <p className="mt-0.5 text-12 text-muted-foreground">{active.to}</p>
          <p className="mt-4 flex-1 rounded-[8px] border border-border bg-background p-4 text-13 leading-5">
            {active.body}
          </p>
          <div aria-live="polite" className="mt-5 flex flex-wrap items-center gap-2">
            {active.state === "waiting_approval" ? (
              <>
                <Button size="sm" onClick={approve}>
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="ghost">
                  Reject
                </Button>
              </>
            ) : active.state === "scheduled" ? (
              <p className="text-13 text-muted-foreground">Approved. Goes out at the scheduled time.</p>
            ) : (
              <p className="text-13 text-muted-foreground">NameLoop will not reply to this one. It is yours.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
