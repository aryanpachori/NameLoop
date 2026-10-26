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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGE_LABELS, formatDue } from "@/lib/labels";
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
  const { takeOver, handBack, pauseAccount, doNotContact, wrongBuyer } = useWorkspace();
  const [note, setNote] = useState("");

  if (!account) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[15px] text-clay">
            {account.industry}, {account.domain}
          </p>
          <h1 className="heading-1">{account.company}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <OwnerBadge owner={account.owner} />
            <StateBadge state={account.state} />
            <span className="text-sm text-muted-foreground">{STAGE_LABELS[account.stage]}</span>
            <span className="text-xs tabular-nums">Score {account.score}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {buyer ? `${buyer.name} · ${buyer.title}` : "No buyer yet"} · Next: {account.nextAction} · Due{" "}
            {formatDue(account.dueAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Why now</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-pretty">{account.whyNow}</p>
          <SourceChip source={account.whyNowSource} />
          <p className="text-sm text-muted-foreground">{account.reason}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {touches.length === 0 ? (
              <p className="text-sm text-muted-foreground">No touches yet.</p>
            ) : (
              touches.map((touch) => (
                <div key={touch.id} className="rounded-[14px] bg-muted p-4">
                  <div className="flex items-center justify-between gap-2">
                    <OwnerBadge owner={touch.actor} />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {formatDue(touch.at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{touch.summary}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Buyer map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {contact.name}
                    {contact.isBuyer ? " · chosen" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{contact.rationale}</p>
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
          </CardContent>
        </Card>
      </div>

      {discovery ? (
        <Card>
          <CardHeader>
            <CardTitle>Discovery · {Math.round(discovery.confidence * 100)}% confidence</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              ["Pain", discovery.pain],
              ["Impact", discovery.impact],
              ["Workaround", discovery.workaround],
              ["Timeline", discovery.timeline],
              ["Budget owner", discovery.budgetOwner],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {meeting ? (
        <Card>
          <CardHeader>
            <CardTitle>Meeting brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{meeting.angle}</p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {formatDue(meeting.at)}
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {meeting.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Drafts on this account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {drafts.length === 0 ? (
            <p className="text-muted-foreground">None queued.</p>
          ) : (
            drafts.map((draft) => (
              <p key={draft.id}>
                <Link className="underline" href={`/app/approvals?draft=${draft.id}`}>
                  {draft.subject ?? draft.kind}
                </Link>{" "}
                <span className="text-muted-foreground">{draft.status}</span>
              </p>
            ))
          )}
          {signals.map((signal) => (
            <p key={signal.id} className="text-muted-foreground">
              Signal: {signal.summary}
            </p>
          ))}
          <label className="block text-xs text-muted-foreground">
            Note when handing back
            <textarea
              className="mt-1 w-full rounded-lg border border-input bg-transparent p-2 text-foreground"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
