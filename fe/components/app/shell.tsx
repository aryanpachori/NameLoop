"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { MODEL_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
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
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-sidebar-border bg-sidebar-accent px-3 py-2">
      <div>
        <p className="text-14 font-medium text-sidebar-foreground">Kill switch</p>
        <p className="text-14 text-muted-foreground">Pause all automation</p>
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

function TenantSwitcher() {
  const { tenantList, activeTenantId, switchTenant } = useWorkspace();
  const [open, setOpen] = useState(false);
  const active = tenantList.find((tenant) => tenant.id === activeTenantId) ?? tenantList[0];
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 rounded-[8px] border border-sidebar-border bg-card px-2.5 py-2 text-left transition-colors duration-150 ease-out hover:bg-sidebar-accent"
      >
        <span className="min-w-0">
          <span className="block truncate text-14 font-medium text-sidebar-foreground">
            {active?.name}
          </span>
          <span className="block font-mono text-12 text-muted-foreground">
            {active ? MODEL_LABELS[active.businessModel] : ""}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-[8px] border border-border bg-popover p-1"
        >
          {tenantList.map((tenant) => (
            <li key={tenant.id}>
              <button
                type="button"
                role="option"
                aria-selected={tenant.id === activeTenantId}
                onClick={() => {
                  switchTenant(tenant.id);
                  setOpen(false);
                  toast.message(`Switched to ${tenant.name}`);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-[6px] px-2 py-1.5 text-left hover:bg-muted"
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-14">{tenant.name}</span>
                  <span className="block font-mono text-12 text-muted-foreground">
                    {MODEL_LABELS[tenant.businessModel]}
                  </span>
                </span>
                {tenant.id === activeTenantId ? <Check className="size-4" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link href="/" className="px-1 text-14 text-sidebar-foreground" onClick={onNavigate}>
        <Logo />
      </Link>
      <TenantSwitcher />
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto space-y-4">
        <KillSwitch />
        <p className="px-1 text-13 leading-relaxed text-muted-foreground text-pretty">
          Approvals are required until you trust autopilot. <span className="font-mono">⌘K</span> to jump anywhere.
        </p>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state } = useWorkspace();
  const [open, setOpen] = useState(false);

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
            <p className="text-14 text-muted-foreground">
              <span className="font-medium text-foreground">{state.tenant.name}</span>
              {state.brief.sprintProgress ? (
                <> · <span className="tabular-nums">{state.brief.sprintProgress}</span></>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-[8px] px-2 py-1 text-13",
                state.tenant.domainHealth === "healthy"
                  ? "bg-muted text-foreground"
                  : "bg-destructive text-destructive-foreground"
              )}
            >
              Domain {state.tenant.domainHealth}
            </span>
            <span className="hidden rounded-[8px] bg-card px-2 py-1 font-mono text-12 tabular-nums ring-1 ring-border sm:inline">
              {state.tenant.usedSends}/{state.tenant.sendingCap} drafts
            </span>
          </div>
        </header>
        {state.tenant.paused ? (
          <div className="border-b border-border bg-destructive/15 px-4 py-2 text-14 text-destructive">
            Kill switch is on. AI will not draft or enqueue anything until you release it.
          </div>
        ) : null}
        <Separator className="sr-only" />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
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
