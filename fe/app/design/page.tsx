"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Segmented } from "@/components/ui/segmented";
import { StateBadge } from "@/components/state-badge";
import { OwnerBadge } from "@/components/owner-badge";
import { ChannelChip, CHANNEL_IDS } from "@/components/channel-mark";
import { Stat } from "@/components/stat";
import { EmptyState } from "@/components/empty-state";
import { CommandMenuHint } from "@/components/command-menu";
import type { ChannelId, RecordState } from "@/lib/types";

const states: RecordState[] = [
  "ai_working",
  "waiting_approval",
  "needs_human",
  "human_owned",
  "paused",
  "live",
  "scheduled",
  "failed",
];

const colors = [
  ["background", "bg-background border"],
  ["card", "bg-card border"],
  ["wash / muted", "bg-muted border"],
  ["primary", "bg-primary"],
  ["brand", "bg-brand"],
  ["destructive", "bg-destructive"],
  ["success", "bg-success border"],
  ["human", "bg-human border"],
  ["ai", "bg-ai border"],
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-12">
      <h2 className="text-20 font-semibold tracking-tight">{title}</h2>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

export default function DesignPage() {
  const { theme, setTheme } = useTheme();
  const [segment, setSegment] = useState<"week" | "month" | "list">("week");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-14 font-semibold tracking-tight">
              Name<span className="text-brand">Loop</span>
            </Link>
            <span className="text-13 text-muted-foreground">Design system</span>
          </div>
          <div className="flex items-center gap-2">
            {mounted ? (
              <Segmented
                aria-label="Theme"
                value={(theme === "light" ? "light" : "dark") as "light" | "dark"}
                onChange={(value) => setTheme(value)}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            ) : null}
            <Link
              href="/"
              className="inline-flex h-7 items-center rounded-[8px] border border-border px-2.5 text-13 font-medium hover:bg-muted"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-10">
        <p className="font-serif-display text-40 text-heading">Design system</p>
        <p className="mt-3 max-w-2xl text-16 text-muted-foreground">
          Tokens and components for NameLoop. Editorial, calm, hairline borders. See{" "}
          <code className="font-[family-name:var(--font-geist-mono)] text-13">DESIGN.md</code>.
        </p>
        <CommandMenuHint />

        <nav className="mt-8 flex flex-wrap gap-2 text-13">
          {[
            ["#type", "Type"],
            ["#color", "Color"],
            ["#states", "States"],
            ["#channels", "Channels"],
            ["#controls", "Controls"],
            ["#data", "Data"],
            ["#feedback", "Feedback"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-[8px] border border-border px-2.5 py-1 text-muted-foreground hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <Section id="type" title="Type">
          <div className="space-y-4">
            <p className="font-serif-display text-64 text-heading">Serif 64</p>
            <p className="font-serif-display text-40 text-heading">Serif 40</p>
            <p className="text-28 font-semibold">Sans 28 page</p>
            <p className="text-20 font-semibold">Sans 20 section</p>
            <p className="text-16">Sans 16 marketing body</p>
            <p className="text-14">Sans 14 UI body</p>
            <p className="text-13 text-muted-foreground">Sans 13 secondary</p>
            <p className="text-12 text-muted-foreground">Sans 12 meta</p>
            <p className="font-[family-name:var(--font-geist-mono)] text-13 tabular-nums">
              Mono 13 · 1,284 · 09:41
            </p>
          </div>
        </Section>

        <Section id="color" title="Color">
          <div className="grid gap-3 sm:grid-cols-3">
            {colors.map(([name, cls]) => (
              <div key={name} className="space-y-2">
                <div className={`h-16 rounded-[8px] ${cls}`} />
                <p className="font-[family-name:var(--font-geist-mono)] text-12 text-muted-foreground">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="states" title="State pills and owners">
          <div className="flex flex-wrap gap-2">
            {states.map((state) => (
              <StateBadge key={state} state={state} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <OwnerBadge owner="ai" />
            <OwnerBadge owner="human" />
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Section id="channels" title="Channel marks">
          <div className="flex flex-wrap gap-2">
            {CHANNEL_IDS.map((id) => (
              <ChannelChip key={id} id={id} />
            ))}
          </div>
        </Section>

        <Section id="controls" title="Controls">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="grid max-w-md gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sample-email">Email</Label>
              <Input id="sample-email" placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Plan</Label>
              <Select defaultValue="growth">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Segmented
              aria-label="Calendar view"
              value={segment}
              onChange={setSegment}
              options={[
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
                { value: "list", label: "List" },
              ]}
            />
          </div>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Open side sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Side sheet</SheetTitle>
              </SheetHeader>
              <p className="mt-4 text-14 text-muted-foreground">
                Use for post previews, account detail, and approval context.
              </p>
            </SheetContent>
          </Sheet>
        </Section>

        <Section id="data" title="Stats and table">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Reach" value="48.2k" delta="+12.4%" spark={[8, 10, 9, 14, 13, 18, 22]} />
            <Stat label="Replies" value="36" delta="+4" spark={[2, 3, 2, 5, 4, 6, 7]} serif />
            <Stat label="Meetings" value="5" delta="-1" spark={[4, 5, 5, 3, 4, 2, 3]} />
          </div>
          <div className="surface overflow-hidden">
            <div className="max-h-56 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    [
                      ["Harborstack", "linkedin", "waiting_approval", "92"],
                      ["Northwind", "email", "live", "88"],
                      ["Pixel Cart", "instagram", "scheduled", "76"],
                      ["Ledgerline", "email", "ai_working", "81"],
                    ] as const
                  ).map(([account, channel, state, score]) => (
                    <TableRow key={account}>
                      <TableCell className="font-medium">{account}</TableCell>
                      <TableCell>
                        <ChannelChip id={channel as ChannelId} />
                      </TableCell>
                      <TableCell>
                        <StateBadge state={state as RecordState} />
                      </TableCell>
                      <TableCell className="text-right font-[family-name:var(--font-geist-mono)] tabular-nums">
                        {score}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Section>

        <Section id="feedback" title="Empty, skeleton, toast">
          <EmptyState
            title="No approvals waiting"
            description="When NameLoop drafts a post or note, it lands here for you to approve."
            actionLabel="Open sprint"
            onAction={() => toast.message("Sprint opens in Batch 4")}
          />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-24 w-full rounded-[8px]" />
          </div>
          <Button
            variant="outline"
            onClick={() => toast.success("Saved to drafts")}
          >
            Trigger toast
          </Button>
        </Section>
      </main>
    </div>
  );
}
