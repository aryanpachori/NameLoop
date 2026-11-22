"use client";

import { ButtonLink } from "@/components/button-link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function HealthPage() {
  const { state, setSenderStatus, toggleGtmPause, toggleKillSwitch } = useWorkspace();
  const { gtm, tenant } = state;
  const overBounce = gtm.senders.some((s) => s.bounceRate >= gtm.bouncePauseAt);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Send health"
        title="Caps, bounce, pause"
        description="Hard 150/day, per-sender caps, bounce &gt;3% or any complaint pauses that sender. Kill switch stops everything."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/app/outreach" variant="outline">
              Outreach
            </ButtonLink>
            <ButtonLink href="/app/settings" variant="outline">
              Settings
            </ButtonLink>
          </div>
        }
      />

      {(gtm.paused || tenant.paused || overBounce) && (
        <div className="rounded-[12px] border border-destructive/30 bg-destructive/[0.08] p-4 text-14 space-y-1">
          {tenant.paused ? <p>Workspace kill switch is on.</p> : null}
          {gtm.paused ? (
            <p>GTM machine paused{gtm.pausedReason ? `: ${gtm.pausedReason}` : ""}.</p>
          ) : null}
          {overBounce ? (
            <p>At least one sender is at or over the {(gtm.bouncePauseAt * 100).toFixed(0)}% bounce line.</p>
          ) : null}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Hard cap today</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {gtm.usedToday}/{gtm.hardDailyCap}
          </p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Workspace bounce / spam</p>
          <p className="mt-1 font-mono text-28 font-medium tabular-nums">
            {(tenant.bounceRate * 100).toFixed(1)}% / {(tenant.spamRate * 100).toFixed(2)}%
          </p>
        </div>
        <div className="surface p-4">
          <p className="text-12 text-muted-foreground">Domain health</p>
          <p className="mt-1 text-28 font-medium capitalize">{tenant.domainHealth}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Senders</h2>
        <div className="surface divide-y divide-border">
          {gtm.senders.map((sender) => (
            <div
              key={sender.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{sender.label}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-[8px] capitalize",
                      sender.status === "active" &&
                        "border-transparent bg-success text-success-foreground",
                      sender.status === "paused" &&
                        "border-transparent bg-destructive/[0.12] text-destructive",
                      sender.status === "warming" && "border-transparent bg-muted"
                    )}
                  >
                    {sender.status}
                  </Badge>
                  <Badge variant="outline" className="rounded-[6px] capitalize text-11">
                    warmup {sender.warmup}
                  </Badge>
                </div>
                <p className="font-mono text-13 text-muted-foreground">{sender.email}</p>
                <p className="text-13 text-muted-foreground">
                  {sender.usedToday}/{sender.dailyCap} today · bounce{" "}
                  <span className="font-mono">{(sender.bounceRate * 100).toFixed(1)}%</span>
                </p>
              </div>
              <div className="flex gap-2">
                {sender.status === "paused" ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSenderStatus(sender.id, "active");
                      toast.success(`${sender.label} resumed`);
                    }}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSenderStatus(sender.id, "paused");
                      toast.message(`${sender.label} paused`);
                    }}
                  >
                    Pause
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-20 font-semibold">Controls</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={gtm.paused ? "default" : "outline"}
            onClick={() => {
              toggleGtmPause(gtm.paused ? undefined : "Manual pause from Health");
              toast.message(gtm.paused ? "GTM resumed" : "GTM paused");
            }}
          >
            {gtm.paused ? "Resume GTM" : "Pause GTM"}
          </Button>
          <Button
            variant={tenant.paused ? "default" : "destructive"}
            onClick={() => {
              toggleKillSwitch();
              toast.message(tenant.paused ? "Kill switch off" : "Kill switch on");
            }}
          >
            {tenant.paused ? "Release kill switch" : "Kill switch"}
          </Button>
        </div>
        <p className="text-13 text-muted-foreground">
          Policy: pause sender if bounce ≥ {(gtm.bouncePauseAt * 100).toFixed(0)}% or any spam complaint.
          Human replies stop that lead — never auto-reply.
        </p>
      </section>
    </div>
  );
}
