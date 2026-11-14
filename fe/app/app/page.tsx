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
  return /reply|replies|dm|creator/i.test(text) ? "/app/outreach" : "/app/approvals";
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
  const { brief, sprint } = state;
  const pending = state.drafts.filter((draft) => draft.status === "pending").length;
  const waitingPosts = sprint.posts.filter((p) => p.status === "waiting_approval").length;
  const dueNow = state.queue.filter((item) => item.urgency === "now").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${state.tenant.name} · morning brief`}
        title="Good morning. Here is where the loop stands."
        description={brief.sprintProgress}
        actions={<ButtonLink href="/app/sprint" variant="outline">Open sprint</ButtonLink>}
      />

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-foreground transition-[width] duration-200 ease-out"
            style={{ width: `${(sprint.dayOf21 / 21) * 100}%` }}
          />
        </div>
        <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-12 text-muted-foreground">
          Day {sprint.dayOf21} of 21
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Sprint day" value={`${sprint.dayOf21}/21`} />
        <Stat label="Drafts waiting" value={String(pending)} />
        <Stat label="Posts waiting approval" value={String(waitingPosts)} />
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
                  className="group flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 -mx-2 hover:bg-muted"
                >
                  {item}
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="surface space-y-3 p-4">
          <h2 className="text-16 font-semibold">Today&apos;s posts</h2>
          <List items={brief.todayPosts} />
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Queue</h2>
        {state.queue.length === 0 ? (
          <p className="surface p-4 text-14 text-muted-foreground">Queue is clear.</p>
        ) : (
          <div className="surface divide-y divide-border">
            {state.queue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-[family-name:var(--font-geist-mono)] text-12 uppercase text-muted-foreground">
                      {urgencyCopy[item.urgency]}
                    </span>
                    <p className="text-14 font-medium">{item.title}</p>
                  </div>
                  <p className="text-13 text-muted-foreground text-pretty">{item.reason}</p>
                  <p className="font-[family-name:var(--font-geist-mono)] text-12 tabular-nums text-muted-foreground">
                    Due {formatDue(item.dueAt)}
                  </p>
                </div>
                <ButtonLink href={item.href} size="sm">
                  {item.actionLabel}
                </ButtonLink>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
