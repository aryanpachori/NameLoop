"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWorkspace } from "@/lib/store";
import { toast } from "sonner";

export default function SettingsPage() {
  const { state, toggleKillSwitch, addSuppression, reconnect } = useWorkspace();
  const [email, setEmail] = useState("");
  const [reviewer, setReviewer] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Connections, caps, people"
        description="Gmail is drafts only. Reviewers can approve. They cannot change billing."
      />
      <Card>
        <CardHeader>
          <CardTitle>Gmail</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Drafts folder only. Never auto-send in this release.
          </p>
          <Button
            onClick={() => {
              reconnect("con-gmail");
              toast.success("Gmail drafts connected");
            }}
          >
            {state.connectors.find((item) => item.id === "con-gmail")?.status === "connected"
              ? "Connected"
              : "Connect Gmail"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kill switch</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Pause every engine for this tenant.</p>
          <Switch checked={state.tenant.paused} onCheckedChange={toggleKillSwitch} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Suppression list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.suppressions.map((item) => (
            <p key={item.id} className="text-sm">
              {item.value} · {item.reason}
            </p>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="email or domain"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (!email.trim()) return;
                addSuppression(email.trim(), "Manual");
                setEmail("");
              }}
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reviewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="reviewer">Invite someone who can approve drafts</Label>
          <div className="flex gap-2">
            <Input
              id="reviewer"
              placeholder="cofounder@company.com"
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
            />
            <Button
              onClick={() => {
                if (!reviewer.trim()) return;
                toast.success(`Invite queued for ${reviewer}`);
                setReviewer("");
              }}
            >
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
