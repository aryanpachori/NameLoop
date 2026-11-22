"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OwnerBadge } from "@/components/owner-badge";
import { SourceChip } from "@/components/source-chip";
import { StateBadge } from "@/components/state-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STAGE_LABELS, TRACKER_LABELS, formatDue } from "@/lib/labels";
import { useAccount, useWorkspace } from "@/lib/store";
import { toast } from "sonner";

export default function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { account, contacts, buyer, signals, touches, drafts, discovery, meeting } =
    useAccount(id);
  const { takeOver, handBack, pauseAccount, doNotContact, wrongBuyer, stopLead } =
    useWorkspace();
  const [note, setNote] = useState("");

  if (!account) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-15 text-muted-foreground">
            {account.industry}, {account.domain}
          </p>
          <h1 className="heading-1">{account.company}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <OwnerBadge owner={account.owner} />
            <StateBadge state={account.state} />
            <span className="rounded-[6px] bg-muted px-2 py-0.5 text-12 font-medium">
              {TRACKER_LABELS[account.trackerStage]}
            </span>
            <span className="text-13 text-muted-foreground">{STAGE_LABELS[account.stage]}</span>
            {account.sender ? (
              <span className="font-mono text-12 capitalize text-muted-foreground">
                via {account.sender}
              </span>
            ) : null}
            <span className="font-mono text-12 tabular-nums text-muted-foreground">Score {account.score}</span>
          </div>
          <p className="text-14 text-muted-foreground">
            {buyer ? `${buyer.name} · ${buyer.title}` : "No buyer yet"} · Next: {account.nextAction} · Due{" "}
            {formatDue(account.dueAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {account.trackerStage !== "replied" ? (
            <Button
              onClick={() => {
                stopLead(account.id, "replied");
                toast.success("Stopped — you own the reply");
              }}
            >
              Stop · human reply
            </Button>
          ) : null}
          <Button onClick={() => { takeOver(account.id); toast.message("You own this account"); }}>
            Take over
          </Button>
          <Button variant="outline" onClick={() => { handBack(account.id); toast.message("Handed back to AI"); }}>
            Hand back
          </Button>
          <Button variant="outline" onClick={() => { pauseAccount(account.id); toast.message("Paused"); }}>
            Pause
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Do not contact
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add {account.company} to suppression?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is irreversible in the demo. The account leaves the pipeline and will not receive drafts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    doNotContact(account.id);
                    toast.message("Added to suppression");
                  }}
                >
                  Do not contact
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="surface p-5 space-y-3">
        <h2 className="text-15 font-semibold tracking-tight">Why now</h2>
        <p className="text-14 text-pretty">{account.whyNow}</p>
        <SourceChip source={account.whyNowSource} />
        <p className="text-14 text-muted-foreground">{account.reason}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5 space-y-3">
          <h2 className="text-15 font-semibold tracking-tight">Timeline</h2>
          {touches.length === 0 ? (
            <p className="text-14 text-muted-foreground">No touches yet.</p>
          ) : (
            touches.map((touch) => (
              <div key={touch.id} className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between gap-2">
                  <OwnerBadge owner={touch.actor} />
                  <span className="font-mono text-12 text-muted-foreground tabular-nums">
                    {formatDue(touch.at)}
                  </span>
                </div>
                <p className="mt-2 text-14">{touch.summary}</p>
              </div>
            ))
          )}
        </div>
        <div className="surface p-5 space-y-3">
          <h2 className="text-15 font-semibold tracking-tight">Buyer map</h2>
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-14 font-medium">
                  {contact.name}
                  {contact.isBuyer ? (
                    <span className="ml-1.5 font-mono text-12 text-success-foreground">chosen</span>
                  ) : null}
                </p>
                <p className="text-13 text-muted-foreground">{contact.title}</p>
                <p className="mt-1 text-13 text-muted-foreground">{contact.rationale}</p>
              </div>
              {!contact.isBuyer ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    wrongBuyer(account.id, contact.id);
                    toast.success(`Buyer is now ${contact.name}`);
                  }}
                >
                  Make buyer
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {discovery ? (
        <div className="surface p-5">
          <h2 className="text-15 font-semibold tracking-tight">
            Discovery ·{" "}
            <span className="font-mono text-13 font-normal text-muted-foreground">
              {Math.round(discovery.confidence * 100)}% confidence
            </span>
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Pain", discovery.pain],
              ["Impact", discovery.impact],
              ["Workaround", discovery.workaround],
              ["Timeline", discovery.timeline],
              ["Budget owner", discovery.budgetOwner],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-12 text-muted-foreground uppercase tracking-wide font-mono">{label}</p>
                <p className="mt-1 text-14">{value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {meeting ? (
        <div className="surface p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-15 font-semibold tracking-tight">Meeting brief</h2>
            <span className="font-mono text-12 text-muted-foreground tabular-nums shrink-0">
              {formatDue(meeting.at)}
            </span>
          </div>
          <p className="text-14">{meeting.angle}</p>
          <ul className="space-y-2">
            {meeting.questions.map((question) => (
              <li key={question} className="flex items-start gap-2 text-14">
                <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                {question}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="surface p-5 space-y-4">
        <h2 className="text-15 font-semibold tracking-tight">Drafts on this account</h2>
        {drafts.length === 0 ? (
          <p className="text-14 text-muted-foreground">None queued.</p>
        ) : (
          <ul className="space-y-2">
            {drafts.map((draft) => (
              <li key={draft.id} className="flex items-center gap-2 text-14">
                <Link
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                  href={`/app/approvals?draft=${draft.id}`}
                >
                  {draft.subject ?? draft.kind}
                </Link>
                <span className="text-muted-foreground">·</span>
                <span className="text-13 text-muted-foreground">{draft.status}</span>
              </li>
            ))}
          </ul>
        )}
        {signals.length > 0 ? (
          <ul className="space-y-1">
            {signals.map((signal) => (
              <li key={signal.id} className="text-13 text-muted-foreground">
                Signal: {signal.summary}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="space-y-1.5 pt-1">
          <label className="text-13 font-medium text-muted-foreground">
            Note when handing back
          </label>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional context for the AI…"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
