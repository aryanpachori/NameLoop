"use client";

import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDue } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";

const urgencyCopy = {
  now: "Now",
  today: "Today",
  week: "This week",
};

export default function TodayPage() {
  const { state } = useWorkspace();
  const pending = state.drafts.filter((draft) => draft.status === "pending").length;
  const needsHuman = state.accounts.filter((account) => account.state === "needs_human").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Today queue"
        title="Things that need you"
        description="Sorted by urgency. Each row has a reason and one button."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Due now</CardTitle>
          </CardHeader>
          <CardContent className="text-[34px] font-bold tabular-nums text-foreground">
            {state.queue.filter((item) => item.urgency === "now").length}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Drafts waiting</CardTitle>
          </CardHeader>
          <CardContent className="text-[34px] font-bold tabular-nums text-foreground">{pending}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Accounts needing you</CardTitle>
          </CardHeader>
          <CardContent className="text-[34px] font-bold tabular-nums text-foreground">{needsHuman}</CardContent>
        </Card>
      </div>
      <div className="space-y-3">
        {state.queue.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] text-clay">
                    {urgencyCopy[item.urgency]}
                  </span>
                  <p className="font-medium">{item.title}</p>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">{item.reason}</p>
                <p className="text-[13px] tabular-nums text-muted-foreground">Due {formatDue(item.dueAt)}</p>
              </div>
              <ButtonLink href={item.href}>{item.actionLabel}</ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
