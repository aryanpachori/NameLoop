"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/lib/store";

export default function ReportPage() {
  const { state } = useWorkspace();
  const { report } = state;
  const stats = [
    ["Accounts found", report.accountsFound],
    ["Contacted", report.contacted],
    ["Replies", report.replies],
    ["Positive replies", report.positiveReplies],
    ["Meetings", report.meetings],
    ["Content views", report.contentViews],
    ["Saves", report.contentSaves],
    ["Intervention rate", `${Math.round(report.interventionRate * 100)}%`],
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly report"
        title={`Week of ${report.weekOf}`}
        description="Accounts found, what you sent, and where you had to step in."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label} size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-[34px] font-bold tabular-nums text-foreground">{value}</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>What to change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {report.takeaways.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
