"use client";

import Link from "next/link";
import { ChannelChip } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StateBadge } from "@/components/state-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TRACKER_LABELS } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OutreachPage() {
  const { state, setSenderStatus, toggleGtmPause } = useWorkspace();
  const seq = state.outreach[0];
  const { gtm } = state;

  if (!seq) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Outreach" title="Outreach" />
        <EmptyState
          title="No sequence running"
          description="Connect Gmail or Resend in Channels, then NameLoop will propose E1 + FU1–5."
        />
      </div>
    );
  }

  const creator = seq.kind === "d2c_creator";
  const needsHuman = seq.prospects.filter((p) => p.state === "needs_human");
  const pct = Math.round((seq.usedToday / seq.dailyCap) * 100);
  const hardPct = Math.round((gtm.usedToday / gtm.hardDailyCap) * 100);
  const nextSlot = gtm.slots.find((s) => s.sent < s.planned) ?? gtm.slots[gtm.slots.length - 1];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={creator ? "Creator outreach" : "Send machine"}
        title={seq.name}
        description={
          creator
            ? "Gift, brief, and track creators. Every DM waits for approval."
            : "E1 + FU1–5 on dual senders. Caps, slots, and stop rules — you control the machine."
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/app/pipeline" variant="outline">
              Lead board
            </ButtonLink>
            <ButtonLink href="/app/approvals" variant="outline">
              Approvals
            </ButtonLink>
            <Button
              variant={gtm.paused ? "default" : "outline"}
              onClick={() => {
                toggleGtmPause(gtm.paused ? undefined : "Paused from Outreach");
                toast.message(gtm.paused ? "Machine resumed" : "Machine paused");
              }}
            >
              {gtm.paused ? "Resume sends" : "Pause sends"}
            </Button>
          </div>
        }
      />

      {gtm.paused ? (
        <div className="rounded-[12px] border border-destructive/30 bg-destructive/[0.08] p-4 text-14">
          Sending paused{gtm.pausedReason ? `: ${gtm.pausedReason}` : ""}.
        </div>
      ) : null}

      {needsHuman.length > 0 ? (
        <div className="rounded-[12px] border border-destructive/30 bg-destructive/[0.08] p-4">
          <p className="text-14 font-medium text-destructive">
            {needsHuman.length} {creator ? "creator needs" : "human replies"} — machine stopped on these
          </p>
          <ul className="mt-1 text-14">
            {needsHuman.map((p) => (
              <li key={p.id}>
                {p.name}, {p.company}: {p.nextStep}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Hard daily cap</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {gtm.usedToday}/{gtm.hardDailyCap}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-foreground" style={{ width: `${hardPct}%` }} />
          </div>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Sequence today</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {seq.usedToday}/{seq.dailyCap}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Schedule</p>
          <p className="mt-1 text-18 font-medium">Mon–Sat · IST</p>
          <p className="mt-1 text-13 text-muted-foreground">
            Next: {nextSlot.label} · {nextSlot.planned - nextSlot.sent} left
          </p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Last source pull</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {gtm.source.lastPullCount ?? "—"}
          </p>
          <p className="mt-1 text-13 text-muted-foreground capitalize">
            via {gtm.source.mode}
            {gtm.source.lastPullAt
              ? ` · ${new Date(gtm.source.lastPullAt).toLocaleTimeString("en-GB", {
                  timeZone: gtm.timezone,
                  hour: "numeric",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-20 font-semibold">Today&apos;s slots</h2>
          <p className="text-13 text-muted-foreground">10 AM sources · other slots send</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-5">
          {gtm.slots.map((slot) => {
            const done = slot.sent >= slot.planned;
            const fill = slot.planned ? Math.round((slot.sent / slot.planned) * 100) : 0;
            return (
              <li key={slot.id} className="surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-14 font-medium">{slot.label}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-[6px] text-11",
                      slot.role === "source" && "border-transparent bg-muted"
                    )}
                  >
                    {slot.role}
                  </Badge>
                </div>
                <p className="mt-2 font-mono text-22 tabular-nums">
                  {slot.sent}/{slot.planned}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full", done ? "bg-success" : "bg-foreground")}
                    style={{ width: `${fill}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Senders</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {gtm.senders.map((sender) => {
            const sp = Math.round((sender.usedToday / sender.dailyCap) * 100);
            return (
              <div key={sender.id} className="surface space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-16 font-semibold">{sender.label}</p>
                    <p className="font-mono text-13 text-muted-foreground">{sender.email}</p>
                    {sender.replyTo ? (
                      <p className="text-12 text-muted-foreground">Reply-to {sender.replyTo}</p>
                    ) : null}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-[8px] capitalize",
                      sender.status === "active" &&
                        "border-transparent bg-success text-success-foreground",
                      sender.status === "paused" &&
                        "border-transparent bg-destructive/[0.12] text-destructive",
                      sender.status === "warming" && "border-transparent bg-muted"
                    )}
                  >
                    {sender.status}
                  </Badge>
                </div>
                <dl className="grid grid-cols-3 gap-3 text-13">
                  <div>
                    <dt className="text-12 text-muted-foreground">Today</dt>
                    <dd className="font-mono tabular-nums">
                      {sender.usedToday}/{sender.dailyCap}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-12 text-muted-foreground">Bounce</dt>
                    <dd className="font-mono tabular-nums">
                      {(sender.bounceRate * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-12 text-muted-foreground">Warmup</dt>
                    <dd className="capitalize">{sender.warmup}</dd>
                  </div>
                </dl>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${sp}%` }} />
                </div>
                <div className="flex gap-2">
                  {sender.status !== "paused" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSenderStatus(sender.id, "paused");
                        toast.message(`${sender.label} paused`);
                      }}
                    >
                      Pause sender
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSenderStatus(sender.id, "active");
                        toast.success(`${sender.label} active`);
                      }}
                    >
                      Resume sender
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-13 text-muted-foreground">
          Auto-pause if bounce &gt; {(gtm.bouncePauseAt * 100).toFixed(0)}% or any complaint. Never auto-reply humans.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">{creator ? "Outreach flow" : "Sequence · E1 + FU1–5"}</h2>
        <ol className="surface divide-y divide-border">
          {seq.steps.map((step) => (
            <li key={step.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start">
              <div className="flex w-28 shrink-0 flex-col gap-1">
                {step.kind ? (
                  <span className="font-mono text-13 font-medium">{step.kind}</span>
                ) : null}
                <span className="font-mono text-12 text-muted-foreground tabular-nums">
                  Day {step.day}
                </span>
              </div>
              <ChannelChip id={step.channelId} className="w-fit" />
              <div className="min-w-0 flex-1">
                <p className="text-14 font-medium">{step.label}</p>
                {step.subject ? (
                  <p className="mt-0.5 font-mono text-12 text-muted-foreground">{step.subject}</p>
                ) : null}
                <p className="mt-1 text-13 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">{creator ? "Creators" : "In sequence"}</h2>
        {seq.prospects.length === 0 ? (
          <EmptyState title="No one in this sequence yet" description="Leads appear after qualify." />
        ) : (
          <div className="surface overflow-x-auto">
            <table className="w-full text-left text-14">
              <thead className="sticky top-0 border-b border-border bg-card text-12 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">{creator ? "Creator" : "Name"}</th>
                  <th className="px-4 py-2 font-medium">{creator ? "Handle" : "Company"}</th>
                  <th className="px-4 py-2 font-medium">Tracker</th>
                  <th className="px-4 py-2 font-medium">Sender</th>
                  <th className="px-4 py-2 font-medium">State</th>
                  <th className="px-4 py-2 font-medium">Next</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {seq.prospects.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-12 text-muted-foreground">{p.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.accountId ? (
                        <Link href={`/app/accounts/${p.accountId}`} className="hover:underline">
                          {p.company}
                        </Link>
                      ) : (
                        p.company
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.trackerStage ? (
                        <Badge variant="outline" className="rounded-[6px] text-11">
                          {TRACKER_LABELS[p.trackerStage]}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">
                      {p.sender ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge state={p.state} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.nextStep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
