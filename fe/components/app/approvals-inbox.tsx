"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { KIND_LABELS } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ApprovalsInbox() {
  const searchParams = useSearchParams();
  const { state, approveDraft, rejectDraft, updateDraft } = useWorkspace();
  const initial = searchParams.get("draft");
  const [tab, setTab] = useState("pending");
  const [selectedId, setSelectedId] = useState(initial);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const drafts = state.drafts.filter((draft) =>
    tab === "all" ? true : draft.status === tab
  );
  const selected =
    drafts.find((draft) => draft.id === selectedId) ?? drafts[0] ?? null;
  const account = state.accounts.find((item) => item.id === selected?.accountId);
  const signal = state.signals.find((item) => item.id === selected?.signalId);
  const buyer = state.contacts.find((item) => item.id === account?.buyerId);

  const sendHint = !selected
    ? ""
    : selected.channel === "email"
      ? "Approve saves this to Gmail drafts. NameLoop never auto-sends."
      : "Copy this and send it yourself. Social actions stay human.";

  function onApprove() {
    if (!selected) return;
    if (selected.flaggedClaims.length > 0) {
      toast.error("Resolve flagged claims before you approve.");
      return;
    }
    approveDraft(selected.id);
    toast.success(
      selected.channel === "email" ? "Saved to Gmail drafts" : "Ready to copy and send"
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Approvals"
        title="One inbox for every draft."
        description="Edit, approve, or reject with a reason. Claims not in the library block send."
      />
      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_240px]">
        <ScrollArea className="h-[70vh] rounded-[14px] bg-card">
          <div className="p-2">
            {drafts.map((draft) => (
              <button
                key={draft.id}
                type="button"
                onClick={() => setSelectedId(draft.id)}
                className={cn(
                  "mb-1 w-full rounded-lg px-3 py-3 text-left text-sm",
                  selected?.id === draft.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <p className="font-medium">{KIND_LABELS[draft.kind]}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {draft.subject ?? draft.body}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
        {selected ? (
          <div className="space-y-4 rounded-[14px] bg-card p-4 text-card-foreground">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{KIND_LABELS[selected.kind]}</p>
                <h2 className="text-[27px] font-bold text-foreground text-balance">{account?.company ?? "Weekly pack"}</h2>
              </div>
              <p className="max-w-xs text-xs text-muted-foreground">{sendHint}</p>
            </div>
            {selected.flaggedClaims.length > 0 ? (
              <Alert variant="destructive">
                <AlertTitle>Claim not in the library</AlertTitle>
                <AlertDescription>
                  {selected.flaggedClaims.join(", ")}. Edit or reject before you approve.
                </AlertDescription>
              </Alert>
            ) : null}
            {selected.kind === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={selected.subject ?? ""}
                  onChange={(event) =>
                    updateDraft(selected.id, selected.body, event.target.value)
                  }
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="body">Draft</Label>
              <Textarea
                id="body"
                rows={14}
                value={selected.body}
                onChange={(event) =>
                  updateDraft(selected.id, event.target.value, selected.subject)
                }
              />
            </div>
            {selected.status === "pending" ? (
              <div className="flex flex-wrap gap-2">
                <Button onClick={onApprove}>Approve</Button>
                <Button variant="outline" onClick={() => setRejectOpen(true)}>
                  Reject
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {selected.status}
                {selected.rejectReason ? `. ${selected.rejectReason}` : ""}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing in this tab.</p>
        )}
        <aside className="space-y-4 rounded-[14px] bg-card p-4 text-[14px] font-light text-card-foreground">
          <div>
            <p className="text-xs text-muted-foreground">Account</p>
            <p className="font-medium">{account?.company ?? "Content, not a named account"}</p>
            {buyer ? (
              <p className="text-muted-foreground">
                {buyer.name} · {buyer.title}
              </p>
            ) : null}
          </div>
          {signal ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Why this draft exists</p>
              <p>{signal.summary}</p>
              <SourceChip source={signal.source} />
            </div>
          ) : (
            <p className="text-muted-foreground">
              Weekly posts. Written to get saves and comments, not hashtag volume.
            </p>
          )}
        </aside>
      </div>
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject requires a reason</AlertDialogTitle>
            <AlertDialogDescription>
              The Brain learns lasting preferences. One-off notes stay on the draft.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Too generic / wrong buyer / invented claim…"
          />
          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={() => setRejectOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={!reason.trim()}
              onClick={() => {
                if (!selected || !reason.trim()) return;
                rejectDraft(selected.id, reason.trim());
                setRejectOpen(false);
                setReason("");
                toast.message("Rejected with a reason");
              }}
            >
              Reject draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
