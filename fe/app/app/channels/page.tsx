"use client";

import { useState } from "react";
import { ChannelChip, channelLabel } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MODEL_LABELS } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import type { ChannelConnection, ChannelId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COPY: Record<ChannelConnection["status"], string> = {
  connected: "Connected",
  needs_reauth: "Needs reauth",
  disconnected: "Not connected",
};

function ConnStatus({ status }: { status: ChannelConnection["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-[8px] text-12 font-medium",
        status === "connected" && "border-transparent bg-success text-success-foreground",
        status === "needs_reauth" &&
          "border-transparent bg-destructive/[0.12] text-destructive",
        status === "disconnected" && "border-transparent bg-muted text-muted-foreground"
      )}
    >
      {STATUS_COPY[status]}
    </Badge>
  );
}

export default function ChannelsPage() {
  const { state, setConnection } = useWorkspace();
  // Channels recommended but without a connection record are tracked locally (mock OAuth).
  const [localConnected, setLocalConnected] = useState<ChannelId[]>([]);

  const recs = [...state.channelRecs].sort((a, b) => b.fitScore - a.fitScore);
  const selectedIcp = state.brain.icps.find((icp) => state.brain.selectedIcpIds.includes(icp.id));
  const connFor = (id: ChannelId) => state.connections.find((c) => c.channelId === id);
  const email = state.connections.find((c) => c.channelId === "email");

  function act(channelId: ChannelId) {
    const conn = connFor(channelId);
    if (conn) {
      setConnection(conn.id, "connected");
    } else {
      setLocalConnected((ids) => [...ids, channelId]);
    }
    toast.success(`${channelLabel(channelId)} connected (mock)`);
  }

  function statusOf(channelId: ChannelId): ChannelConnection["status"] {
    const conn = connFor(channelId);
    if (conn) return conn.status;
    return localConnected.includes(channelId) ? "connected" : "disconnected";
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Channels"
        title="Where to run your sprint"
        description={`Ranked for ${selectedIcp ? selectedIcp.name : "your ICP"} on a ${MODEL_LABELS[state.tenant.businessModel]} model. Channels are places to run, not pipeline stages.`}
      />

      {recs.length === 0 ? (
        <EmptyState
          title="No channel ranks yet"
          description="Finish onboarding so NameLoop can rank channels for your ICP."
        />
      ) : (
        <ol className="space-y-3">
          {recs.map((rec, index) => {
            const status = statusOf(rec.channelId);
            return (
              <li key={rec.channelId} className="surface p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <span className="font-mono text-13 tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <ChannelChip id={rec.channelId} />
                        <ConnStatus status={status} />
                      </div>
                      <p className="max-w-xl text-14">{rec.why}</p>
                      <SourceChip source={rec.source} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 lg:w-72">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-12 text-muted-foreground">Fit</span>
                        <span className="font-mono text-13 tabular-nums">
                          {rec.fitScore}/100
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-foreground" style={{ width: `${rec.fitScore}%` }} />
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-13">
                      <div>
                        <dt className="text-12 text-muted-foreground">Effort</dt>
                        <dd className="font-mono">{rec.effortPerWeek}/wk</dd>
                      </div>
                      <div>
                        <dt className="text-12 text-muted-foreground">Expected</dt>
                        <dd>{rec.expectedOutcome}</dd>
                      </div>
                    </dl>
                    {status !== "connected" ? (
                      <Button
                        size="sm"
                        variant={status === "needs_reauth" ? "default" : "outline"}
                        onClick={() => act(rec.channelId)}
                      >
                        {status === "needs_reauth" ? "Reconnect" : "Connect"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Connections</h2>
        {state.connections.length === 0 ? (
          <EmptyState title="Nothing connected" description="Connect a channel above to start a sprint." />
        ) : (
          <div className="surface divide-y divide-border">
            {state.connections.map((conn) => (
              <div
                key={conn.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ChannelChip id={conn.channelId} />
                    <ConnStatus status={conn.status} />
                  </div>
                  {conn.detail ? <p className="text-13 text-muted-foreground">{conn.detail}</p> : null}
                </div>
                <div className="flex gap-2">
                  {conn.status !== "connected" ? (
                    <Button size="sm" onClick={() => act(conn.channelId)}>
                      {conn.status === "needs_reauth" ? "Reauthorize" : "Connect"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setConnection(conn.id, "disconnected");
                        toast.message(`${channelLabel(conn.channelId)} disconnected`);
                      }}
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {email ? (
        <section className="space-y-3">
          <h2 className="text-20 font-semibold">Email sending</h2>
          <dl className="surface grid gap-4 p-4 sm:grid-cols-4">
            <div>
              <dt className="text-12 text-muted-foreground">Sending domain</dt>
              <dd className="font-mono text-14">
                {email.sendingDomain ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-12 text-muted-foreground">Warmup</dt>
              <dd className="text-14 capitalize">{email.warmup ?? "cold"}</dd>
            </div>
            <div>
              <dt className="text-12 text-muted-foreground">Health</dt>
              <dd className="text-14 capitalize">{email.health ?? "unknown"}</dd>
            </div>
            <div>
              <dt className="text-12 text-muted-foreground">Bounce / spam</dt>
              <dd className="font-mono text-14 tabular-nums">
                {(state.tenant.bounceRate * 100).toFixed(1)}% / {(state.tenant.spamRate * 100).toFixed(2)}%
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}
