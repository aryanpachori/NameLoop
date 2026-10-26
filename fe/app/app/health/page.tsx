"use client";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "@/lib/store";
import { toast } from "sonner";

export default function HealthPage() {
  const { state, reconnect } = useWorkspace();
  const used = Math.round((state.tenant.usedSends / state.tenant.sendingCap) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Health"
        title="Sending cap, domain, and connections"
        description="If the domain looks unhealthy, drafting pauses. This page is the demo gauges."
      />
      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sending cap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[34px] font-bold tabular-nums text-foreground">
              {state.tenant.usedSends}/{state.tenant.sendingCap}
            </p>
            <Progress value={used} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reputation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Bounce {state.tenant.bounceRate}% · target under 1%</p>
            <p>Spam {state.tenant.spamRate}% · Gmail wants under 0.10%</p>
            <Badge variant="outline">{state.tenant.domainHealth}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost meter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[34px] font-bold tabular-nums text-foreground">${state.tenant.spent}</p>
            <p className="text-sm text-muted-foreground">
              of ${state.tenant.monthlyBudget} Starter budget this month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connectors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.connectors.map((connector) => (
            <div key={connector.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{connector.name}</p>
                <p className="text-xs text-muted-foreground">
                  {connector.lastError ?? connector.status}
                </p>
              </div>
              {connector.status !== "connected" ? (
                <Button
                  size="sm"
                  onClick={() => {
                    reconnect(connector.id);
                    toast.success("Reconnected");
                  }}
                >
                  Reconnect
                </Button>
              ) : (
                <Badge variant="secondary">Connected</Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
