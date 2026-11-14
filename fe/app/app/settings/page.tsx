"use client";

import { useState } from "react";
import { ChannelChip } from "@/components/channel-mark";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MODEL_LABELS } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface space-y-4 p-4 sm:p-5">
      <div>
        <h2 className="text-16 font-semibold">{title}</h2>
        {hint ? <p className="mt-0.5 text-13 text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Meter({ label, used, cap }: { label: string; used: number; cap: number }) {
  const pct = Math.min(100, Math.round((used / cap) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-13">{label}</span>
        <span className="font-[family-name:var(--font-geist-mono)] text-13 tabular-nums">
          {used}/{cap}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full", pct > 85 ? "bg-destructive" : "bg-foreground")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { state, toggleKillSwitch, addSuppression, reconnect, setConnection } = useWorkspace();
  const { tenant } = state;
  const [email, setEmail] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [notify, setNotify] = useState({ digest: true, approvals: true, failures: true });
  const emailConn = state.connections.find((c) => c.channelId === "email");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace, people, connections, billing"
        description="Reviewers can approve. They cannot change billing."
      />

      <Section title="Workspace">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Name</Label>
            <Input key={tenant.id} id="ws-name" defaultValue={tenant.name} />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <p className="flex h-8 items-center font-[family-name:var(--font-geist-mono)] text-13">
              {tenant.productUrl}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Business model</Label>
            <p className="flex h-8 items-center text-14">{MODEL_LABELS[tenant.businessModel]}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => toast.success("Workspace saved (mock)")}>
          Save
        </Button>
      </Section>

      <Section title="Seats" hint={`${tenant.seats} seats in use. Invite someone who can approve drafts.`}>
        <div className="flex gap-2">
          <Input
            aria-label="Reviewer email"
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
      </Section>

      <Section title="Connections" hint="Channels and tools NameLoop can use. Gmail is drafts only.">
        <div className="divide-y divide-border rounded-[8px] border border-border">
          {state.connections.map((conn) => (
            <div key={conn.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-3">
                <ChannelChip id={conn.channelId} />
                <span className="text-13 capitalize text-muted-foreground">
                  {conn.status.replace("_", " ")}
                </span>
              </div>
              <Button
                size="sm"
                variant={conn.status === "connected" ? "ghost" : "outline"}
                onClick={() => {
                  setConnection(conn.id, conn.status === "connected" ? "disconnected" : "connected");
                  toast.message(conn.status === "connected" ? "Disconnected" : "Connected (mock)");
                }}
              >
                {conn.status === "connected" ? "Disconnect" : conn.status === "needs_reauth" ? "Reauthorize" : "Connect"}
              </Button>
            </div>
          ))}
          {state.connectors.map((connector) => (
            <div key={connector.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <p className="text-14">{connector.name}</p>
                <p className="text-13 capitalize text-muted-foreground">
                  {connector.status}
                  {connector.lastError ? `. ${connector.lastError}` : ""}
                </p>
              </div>
              <Button
                size="sm"
                variant={connector.status === "connected" ? "ghost" : "outline"}
                disabled={connector.status === "connected"}
                onClick={() => {
                  reconnect(connector.id);
                  toast.success(`${connector.name} connected (mock)`);
                }}
              >
                {connector.status === "connected" ? "Connected" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sending domain" hint="Cold email goes out from a separate domain so your main one stays clean.">
        {emailConn ? (
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-12 text-muted-foreground">Domain</dt>
              <dd className="font-[family-name:var(--font-geist-mono)] text-14">
                {emailConn.sendingDomain ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-12 text-muted-foreground">Warmup</dt>
              <dd className="text-14 capitalize">{emailConn.warmup ?? "cold"}</dd>
            </div>
            <div>
              <dt className="text-12 text-muted-foreground">Health</dt>
              <dd className="text-14 capitalize">{emailConn.health ?? tenant.domainHealth}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-14 text-muted-foreground">
            No email channel connected. Connect email in Channels to set up a domain.
          </p>
        )}
      </Section>

      <Section title="Billing and usage" hint="Meters reset monthly. Ad spend is billed by the ad platform, not NameLoop.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Meter label="Posts" used={tenant.usedPosts} cap={tenant.postsCap} />
          <Meter label="Outreach sends" used={tenant.usedSends} cap={tenant.sendingCap} />
          <Meter label="Seats" used={tenant.seats} cap={Math.max(tenant.seats, 3)} />
        </div>
        <p className="text-13 text-muted-foreground">No invoices yet. Checkout is not connected.</p>
      </Section>

      <Section title="Notifications" hint="Preview only. Nothing is sent yet.">
        {(
          [
            ["digest", "Morning brief email"],
            ["approvals", "New approvals waiting"],
            ["failures", "Failed posts and sends"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-14">{label}</span>
            <Switch
              aria-label={label}
              checked={notify[key]}
              onCheckedChange={(value) => setNotify((prev) => ({ ...prev, [key]: value }))}
            />
          </div>
        ))}
      </Section>

      <Section title="Kill switch">
        <div className="flex items-center justify-between gap-3">
          <p className="text-14 text-muted-foreground">Pause every engine for this workspace.</p>
          <Switch aria-label="Kill switch" checked={tenant.paused} onCheckedChange={toggleKillSwitch} />
        </div>
      </Section>

      <Section title="Suppression list">
        <ul className="space-y-1 text-14">
          {state.suppressions.map((item) => (
            <li key={item.id}>
              {item.value} <span className="text-muted-foreground">· {item.reason}</span>
            </li>
          ))}
        </ul>
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
      </Section>
    </div>
  );
}
