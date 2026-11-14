"use client";

import { ChannelChip } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { StateBadge } from "@/components/state-badge";
import { useWorkspace } from "@/lib/store";

export default function OutreachPage() {
  const { state } = useWorkspace();
  const seq = state.outreach[0];

  if (!seq) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Outreach" title="Outreach" />
        <EmptyState
          title="No outreach running"
          description="Connect email or Instagram in Channels and NameLoop will propose a sequence."
        />
      </div>
    );
  }

  const creator = seq.kind === "d2c_creator";
  const needsHuman = seq.prospects.filter((p) => p.state === "needs_human");
  const pct = Math.round((seq.usedToday / seq.dailyCap) * 100);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={creator ? "Creator and partner outreach" : "Sequence"}
        title={seq.name}
        description={
          creator
            ? "Gift, brief, and track creators who fit your product. Every DM waits for your approval."
            : "A short multi-channel sequence. First touches wait for your approval."
        }
        actions={<ButtonLink href="/app/approvals" variant="outline">Open approvals</ButtonLink>}
      />

      {needsHuman.length > 0 ? (
        <div className="rounded-[12px] border border-destructive/30 bg-destructive/[0.08] p-4">
          <p className="text-14 font-medium text-destructive">
            {needsHuman.length} {creator ? "creator needs" : "reply needs"} you
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Daily cap</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {seq.usedToday}/{seq.dailyCap}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-foreground" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">{creator ? "Creators in sequence" : "Prospects"}</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {seq.prospects.length}
          </p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Steps</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {seq.steps.length}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">{creator ? "Outreach flow" : "Sequence steps"}</h2>
        <ol className="surface divide-y divide-border">
          {seq.steps.map((step) => (
            <li key={step.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
              <p className="w-20 shrink-0 font-mono text-13 tabular-nums">
                Day {step.day}
              </p>
              <ChannelChip id={step.channelId} className="w-fit" />
              <div className="min-w-0">
                <p className="text-14 font-medium">{step.label}</p>
                <p className="text-13 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">{creator ? "Creators" : "Prospects"}</h2>
        {seq.prospects.length === 0 ? (
          <EmptyState title="No one in this sequence yet" description="Prospects appear after discovery." />
        ) : (
          <div className="surface overflow-x-auto">
            <table className="w-full text-left text-14">
              <thead className="sticky top-0 border-b border-border bg-card text-12 text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">{creator ? "Creator" : "Name"}</th>
                  <th className="px-4 py-2 font-medium">{creator ? "Handle" : "Company"}</th>
                  <th className="px-4 py-2 font-medium">State</th>
                  <th className="px-4 py-2 font-medium">Next step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {seq.prospects.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-12 text-muted-foreground">{p.title}</p>
                    </td>
                    <td className="px-4 py-3">{p.company}</td>
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
