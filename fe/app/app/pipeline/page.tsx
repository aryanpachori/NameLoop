"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BOARD_STAGES,
  TRACKER_LABELS,
  TRACKER_STAGES,
  formatDue,
} from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import type { TrackerStage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TERMINAL: TrackerStage[] = [
  "bounced",
  "unsubscribed",
  "completed",
  "no_email",
  "disqualified",
];

export default function PipelinePage() {
  const { state, moveTracker, stopLead } = useWorkspace();
  const { accounts, gtm, contacts } = state;

  const byStage = (stage: TrackerStage) =>
    accounts.filter((a) => a.trackerStage === stage);

  const ready = byStage("ready_to_send").length;
  const inFlight = accounts.filter((a) =>
    ["sent", "follow_up_1", "follow_up_2", "follow_up_3", "follow_up_4", "follow_up_5"].includes(
      a.trackerStage
    )
  ).length;
  const replied = byStage("replied").length;
  const blocked = accounts.filter((a) => TERMINAL.includes(a.trackerStage)).length;

  function buyerName(accountId: string) {
    return contacts.find((c) => c.accountId === accountId && c.isBuyer)?.name;
  }

  function advance(accountId: string, current: TrackerStage) {
    const order = BOARD_STAGES;
    const i = order.indexOf(current);
    if (i < 0 || i >= order.length - 1) return;
    const next = order[i + 1];
    moveTracker(accountId, next);
    toast.message(`Moved to ${TRACKER_LABELS[next]}`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Lead board"
        title="Tracker"
        description="Source → qualify → E1 → FU1–5 → stop on reply / bounce / unsub. Drag is mock; advance or stop from the card."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/app/outreach" variant="outline">
              Sequence + slots
            </ButtonLink>
            <ButtonLink href="/app/health" variant="outline">
              Health
            </ButtonLink>
          </div>
        }
      />

      {gtm.paused ? (
        <div className="rounded-[12px] border border-destructive/30 bg-destructive/[0.08] p-4 text-14">
          Machine paused{gtm.pausedReason ? `: ${gtm.pausedReason}` : ""}. Resume from Health or Outreach.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Ready to send</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">{ready}</p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">In sequence</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">{inFlight}</p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Replied (human)</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">{replied}</p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Stopped / DQ</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">{blocked}</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {BOARD_STAGES.map((stage) => {
          const cols = byStage(stage);
          return (
            <section
              key={stage}
              className="flex w-64 shrink-0 flex-col gap-2 rounded-[12px] border border-border bg-muted/30 p-3"
            >
              <header className="flex items-baseline justify-between px-1">
                <h2 className="text-13 font-semibold">{TRACKER_LABELS[stage]}</h2>
                <span className="font-mono text-12 text-muted-foreground tabular-nums">
                  {cols.length}
                </span>
              </header>
              <ul className="flex max-h-[calc(100vh-22rem)] flex-col gap-2 overflow-y-auto">
                {cols.length === 0 ? (
                  <li className="rounded-[8px] border border-dashed border-border px-3 py-6 text-center text-12 text-muted-foreground">
                    Empty
                  </li>
                ) : (
                  cols.map((account) => (
                    <li key={account.id} className="surface space-y-2 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/app/accounts/${account.id}`}
                          className="min-w-0 text-14 font-medium hover:underline"
                        >
                          {account.company}
                        </Link>
                        {account.sender ? (
                          <Badge variant="outline" className="shrink-0 rounded-[6px] text-11 capitalize">
                            {account.sender}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="truncate text-12 text-muted-foreground">
                        {buyerName(account.id) ?? "—"} · {account.industry}
                      </p>
                      <p className="line-clamp-2 text-12 text-muted-foreground">{account.reason}</p>
                      <p className="font-mono text-11 text-muted-foreground">
                        Due {formatDue(account.dueAt)}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stage !== "replied" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-12"
                            onClick={() => advance(account.id, stage)}
                          >
                            Advance
                          </Button>
                        ) : null}
                        {stage !== "replied" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-12"
                            onClick={() => {
                              stopLead(account.id, "replied");
                              toast.success("Stopped — human owns reply");
                            }}
                          >
                            Stop · reply
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="text-16 font-semibold">Parked / terminal</h2>
        <div className="flex flex-wrap gap-2">
          {TRACKER_STAGES.filter((s) => TERMINAL.includes(s)).map((stage) => {
            const n = byStage(stage).length;
            return (
              <span
                key={stage}
                className={cn(
                  "rounded-[8px] border border-border bg-card px-3 py-1.5 text-13",
                  n === 0 && "text-muted-foreground"
                )}
              >
                {TRACKER_LABELS[stage]}{" "}
                <span className="font-mono tabular-nums">{n}</span>
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}
