"use client";

import { ChannelChip } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/stat";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";

const n = (value: number) => value.toLocaleString("en-US");

export default function ReportPage() {
  const { state } = useWorkspace();
  const { report } = state;
  const b2b = state.tenant.businessModel === "b2b";

  const stats: { label: string; value: string }[] = b2b
    ? [
        { label: "Accounts found", value: n(report.accountsFound) },
        { label: "Contacted", value: n(report.contacted) },
        { label: "Replies", value: n(report.replies) },
        { label: "Positive replies", value: n(report.positiveReplies) },
        { label: "Meetings", value: n(report.meetings) },
        { label: "Content views", value: n(report.contentViews) },
        { label: "Saves", value: n(report.contentSaves) },
        { label: "Intervention rate", value: `${Math.round(report.interventionRate * 100)}%` },
      ]
    : [
        { label: "Content views", value: n(report.contentViews) },
        { label: "Saves", value: n(report.contentSaves) },
        { label: "Creators contacted", value: n(report.contacted) },
        { label: "Replies", value: n(report.replies) },
        { label: "Intervention rate", value: `${Math.round(report.interventionRate * 100)}%` },
      ];

  const best = [...report.bestPosts];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Report"
        title={`Week of ${report.weekOf}`}
        description="What the sprint produced, by channel, and which posts earned a second life as ads."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Stat key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">By channel</h2>
        {report.byChannel.length === 0 ? (
          <EmptyState title="No channel data yet" description="Numbers show up after the first posts go out." />
        ) : (
          <div className="surface overflow-x-auto">
            <table className="w-full text-left text-14">
              <thead className="sticky top-0 border-b border-border bg-card text-12 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Channel</th>
                  <th className="px-4 py-2 text-right font-medium">Reach</th>
                  <th className="px-4 py-2 text-right font-medium">Replies</th>
                  <th className="px-4 py-2 text-right font-medium">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.byChannel.map((row) => (
                  <tr key={row.channel}>
                    <td className="px-4 py-3">
                      <ChannelChip id={row.channel} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {n(row.reach)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      {n(row.replies)}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 text-right font-mono tabular-nums",
                        row.delta.startsWith("+") && "text-success-foreground",
                        row.delta.startsWith("-") && "text-destructive"
                      )}
                    >
                      {row.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Best posts</h2>
        {best.length === 0 ? (
          <EmptyState title="No standout posts yet" description="Ranked posts appear once there is enough data." />
        ) : (
          <ol className="surface divide-y divide-border">
            {best.map((post, index) => (
              <li key={post.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span className="font-mono text-13 tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <p className="text-14 font-medium">{post.title}</p>
                    <p className="text-13 text-muted-foreground">{post.why}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ChannelChip id={post.channel} />
                  <span className="font-mono text-13 tabular-nums">
                    {post.metric}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="surface space-y-2 p-4">
        <h2 className="text-16 font-semibold">What to change</h2>
        <ul className="space-y-1.5 text-14">
          {report.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
