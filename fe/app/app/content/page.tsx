"use client";

import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KIND_LABELS, formatDue } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";

const days = ["Mon 27", "Tue 28", "Wed 29", "Thu 30", "Fri 31", "Sat 1", "Sun 2"];

export default function ContentPage() {
  const { state } = useWorkspace();
  const pack = state.drafts.filter(
    (draft) => draft.kind === "linkedin_post" || draft.kind === "instagram_caption"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="This week's posts"
        description="3 LinkedIn posts (one is a carousel outline) and 2 Instagram captions with reel scripts."
      />
      <div className="grid gap-3 lg:grid-cols-7">
        {days.map((day, index) => {
          const items = pack.filter((draft) => {
            if (!draft.scheduledFor) return false;
            const date = new Date(draft.scheduledFor).getDate();
            const map = [27, 28, 29, 30, 31, 1, 2];
            return date === map[index];
          });
          return (
            <Card key={day} size="sm">
              <CardHeader>
                <CardTitle className="text-xs">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">Open</p>
                ) : (
                  items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/app/approvals?draft=${item.id}`}
                      className="block rounded-md bg-muted px-2 py-1 text-[11px]"
                    >
                      {item.channel === "linkedin" ? "LI" : "IG"} · {item.status}
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="space-y-3">
        {pack.map((draft) => (
          <Card key={draft.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>{KIND_LABELS[draft.kind]}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {draft.scheduledFor ? `Scheduled ${formatDue(draft.scheduledFor)}` : "Unscheduled"}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{draft.status}</Badge>
                {draft.flaggedClaims.length > 0 ? (
                  <Badge variant="destructive">Claim flag</Badge>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-pretty">
              {draft.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
