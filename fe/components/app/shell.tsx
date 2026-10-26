"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/app/nav-links";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useWorkspace } from "@/lib/store";
import { toast } from "sonner";

function KillSwitch() {
  const { state, toggleKillSwitch } = useWorkspace();
  return (
    <div className="flex items-center justify-between gap-4 rounded-[14px] border border-sidebar-border bg-sidebar-accent px-4 py-2">
      <div>
        <p className="text-[14px] font-medium text-sidebar-foreground">Kill switch</p>
        <p className="text-[14px] text-muted-foreground">Pause all automation</p>
      </div>
      <Switch
        checked={state.tenant.paused}
        onCheckedChange={() => {
          toggleKillSwitch();
          toast.message(state.tenant.paused ? "Automation resumed" : "All automation paused");
        }}
        aria-label="Kill switch"
      />
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useWorkspace();
  return (
    <>
      <Link href="/" className="px-1 text-[14px] text-sidebar-foreground" onClick={onNavigate}>
        <Logo />
      </Link>
      <p className="px-1 text-[14px] text-muted-foreground">
        {state.tenant.name}
      </p>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto space-y-4">
        <KillSwitch />
        <p className="px-1 text-[14px] leading-relaxed text-muted-foreground text-pretty">
          Draft-only. Nothing sends until you approve it.
        </p>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useWorkspace();
  const [open, setOpen] = useState(false);
  const oldestHours = 4;

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))] text-sidebar-foreground lg:flex">
        <SidebarBody />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-4 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
            <p className="text-[14px] text-muted-foreground">
              Queue age <span className="tabular-nums text-foreground">{oldestHours}h</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-[14px] px-2 py-1 text-[14px] ${
                state.tenant.domainHealth === "healthy"
                  ? "bg-muted text-foreground"
                  : "bg-destructive text-primary-foreground"
              }`}
            >
              Domain {state.tenant.domainHealth}
            </span>
            <span className="hidden rounded-[14px] bg-card px-2 py-1 text-[14px] tabular-nums ring-1 ring-border sm:inline">
              {state.tenant.usedSends}/{state.tenant.sendingCap} drafts
            </span>
          </div>
        </header>
        {state.tenant.paused ? (
          <div className="border-b border-border bg-destructive/15 px-4 py-2 text-[14px] text-destructive">
            Kill switch is on. AI will not draft or enqueue anything until you release it.
          </div>
        ) : null}
        <Separator className="sr-only" />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
