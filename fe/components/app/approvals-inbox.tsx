"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChannelMark } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Segmented } from "@/components/ui/segmented";
import { Textarea } from "@/components/ui/textarea";
import { KIND_LABELS } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import type { Draft, DraftKind } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Group = "all" | "posts" | "emails" | "dms" | "ads";
type Status = "pending" | "approved" | "rejected" | "all";

const GROUP_OF: Record<DraftKind, Exclude<Group, "all">> = {
  email: "emails",
  linkedin_message: "dms",
  instagram_dm: "dms",
  linkedin_comment: "posts",
  linkedin_post: "posts",
  instagram_caption: "posts",
  tiktok_caption: "posts",
  x_post: "posts",
  ad_copy: "ads",
};

export function ApprovalsInbox() {
  const searchParams = useSearchParams();
  const { state, approveDraft, rejectDraft, updateDraft, bulkApprove } = useWorkspace();
  const [status, setStatus] = useState<Status>("pending");
  const [group, setGroup] = useState<Group>("all");
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("draft"));
  const [checked, setChecked] = useState<string[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const drafts = state.drafts.filter(
    (draft) =>
      (status === "all" || draft.status === status) &&
      (group === "all" || GROUP_OF[draft.kind] === group)
  );
  const selected = drafts.find((draft) => draft.id === selectedId) ?? drafts[0] ?? null;
  const account = state.accounts.find((item) => item.id === selected?.accountId);
  const signal = state.signals.find((item) => item.id === selected?.signalId);
  const buyer = state.contacts.find((item) => item.id === account?.buyerId);

  const approvable = drafts.filter((d) => d.status === "pending" && d.flaggedClaims.length === 0);
  const bulkIds = checked.length > 0
    ? checked.filter((id) => approvable.some((d) => d.id === id))
    : approvable.map((d) => d.id);

  const sendHint = !selected
    ? ""
    : selected.channel === "email"
      ? "Approve saves this to Gmail drafts. NameLoop never auto-sends."
      : "Copy this and send it yourself. Social actions stay human.";

  function onApprove(draft: Draft | null = selected) {
    if (!draft) return;
    if (draft.status !== "pending") return;
    if (draft.flaggedClaims.length > 0) {
      toast.error("Resolve flagged claims before you approve.");
      return;
    }
    approveDraft(draft.id);
    toast.success(draft.channel === "email" ? "Saved to Gmail drafts" : "Ready to copy and send");
  }

  function onBulk() {
    if (bulkIds.length === 0) return;
    bulkApprove(bulkIds);
    setChecked([]);
    toast.success(`Approved ${bulkIds.length} draft${bulkIds.length === 1 ? "" : "s"}`);
  }

  // J/K move, A approve, R reject. Ignored while typing or when a dialog is open.
  const keyRef = useRef<(event: KeyboardEvent) => void>(() => undefined);
  useEffect(() => {
    keyRef.current = (event) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.metaKey || event.ctrlKey || event.altKey || rejectOpen) return;
      const index = drafts.findIndex((d) => d.id === selected?.id);
      const key = event.key.toLowerCase();
      if (key === "j" && drafts[index + 1]) setSelectedId(drafts[index + 1].id);
      else if (key === "k" && drafts[index - 1]) setSelectedId(drafts[index - 1].id);
      else if (key === "a") onApprove();
      else if (key === "r" && selected?.status === "pending") {
        event.preventDefault();
        setRejectOpen(true);
      }
    };
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => keyRef.current(event);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Approvals"
        title="One inbox for everything NameLoop wants to send."
        description="Posts, emails, DMs, and ad copy. Edit, approve, or reject with a reason. Claims not in your Brain block approval."
        actions={
          <Button onClick={onBulk} disabled={bulkIds.length === 0}>
            {checked.length > 0
              ? `Approve ${bulkIds.length} selected`
              : `Approve all clean (${bulkIds.length})`}
          </Button>
        }
      />
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          aria-label="Status"
          value={status}
          onChange={(value) => {
            setStatus(value);
            setChecked([]);
          }}
          options={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "all", label: "All" },
          ]}
        />
        <Segmented
          aria-label="Type"
          value={group}
          onChange={setGroup}
          options={[
            { value: "all", label: "Everything" },
            { value: "posts", label: "Posts" },
            { value: "emails", label: "Emails" },
            { value: "dms", label: "DMs" },
            { value: "ads", label: "Ads" },
          ]}
        />
        <p className="font-mono text-12 text-muted-foreground">
          J/K move · A approve · R reject
        </p>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          title="Nothing here"
          description="No drafts match these filters. Change the filter or check Sprint for what is coming."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)_240px]">
          <ScrollArea className="h-[70vh] rounded-[12px] border border-border bg-card">
            <div className="p-2">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={cn(
                    "mb-1 flex items-start gap-2 rounded-[8px] px-2 py-2",
                    selected?.id === draft.id ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  {draft.status === "pending" ? (
                    <Checkbox
                      className="mt-1"
                      aria-label="Select for bulk approve"
                      checked={checked.includes(draft.id)}
                      onCheckedChange={(value) =>
                        setChecked((ids) =>
                          value ? [...ids, draft.id] : ids.filter((id) => id !== draft.id)
                        )
                      }
                    />
                  ) : (
                    <span className="w-4" />
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedId(draft.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-1.5 text-13 font-medium">
                      <ChannelMark id={draft.channel} />
                      {KIND_LABELS[draft.kind]}
                      {draft.flaggedClaims.length > 0 ? (
                        <span className="rounded-[6px] bg-destructive/[0.12] px-1 text-12 text-destructive">
                          flagged
                        </span>
                      ) : null}
                    </span>
                    <span className="block truncate text-12 text-muted-foreground">
                      {draft.subject ?? draft.body}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
          {selected ? (
            <div className="surface space-y-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-12 text-muted-foreground">{KIND_LABELS[selected.kind]}</p>
                  <h2 className="text-20 font-semibold text-balance">
                    {account?.company ?? "Sprint content"}
                  </h2>
                </div>
                <p className="max-w-xs text-12 text-muted-foreground">{sendHint}</p>
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
                    onChange={(event) => updateDraft(selected.id, selected.body, event.target.value)}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="body">Draft</Label>
                <Textarea
                  id="body"
                  rows={14}
                  className="rounded-[8px]"
                  value={selected.body}
                  onChange={(event) => updateDraft(selected.id, event.target.value, selected.subject)}
                />
              </div>
              {selected.status === "pending" ? (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => onApprove()}>Approve</Button>
                  <Button variant="outline" onClick={() => setRejectOpen(true)}>
                    Reject
                  </Button>
                </div>
              ) : (
                <p className="text-14 capitalize text-muted-foreground">
                  {selected.status}
                  {selected.rejectReason ? `. ${selected.rejectReason}` : ""}
                </p>
              )}
            </div>
          ) : null}
          <aside className="surface space-y-4 p-4 text-14">
            <div>
              <p className="text-12 text-muted-foreground">Account</p>
              <p className="font-medium">{account?.company ?? "Content, not a named account"}</p>
              {buyer ? (
                <p className="text-muted-foreground">
                  {buyer.name} · {buyer.title}
                </p>
              ) : null}
            </div>
            {signal ? (
              <div className="space-y-2">
                <p className="text-12 text-muted-foreground">Why this draft exists</p>
                <p>{signal.summary}</p>
                <SourceChip source={signal.source} />
              </div>
            ) : (
              <p className="text-muted-foreground">
                Sprint content. Written to earn saves and replies, not hashtag volume.
              </p>
            )}
          </aside>
        </div>
      )}
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
