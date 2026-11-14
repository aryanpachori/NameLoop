"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { cn } from "@/lib/utils";

const items = [
  { label: "Today", href: "/app" },
  { label: "Approvals", href: "/app/approvals" },
  { label: "Channels", href: "/app/channels" },
  { label: "Sprint", href: "/app/sprint" },
  { label: "Outreach", href: "/app/outreach" },
  { label: "Brain", href: "/app/brain" },
  { label: "Report", href: "/app/report" },
  { label: "Ads", href: "/app/ads" },
  { label: "Loop", href: "/app/loop" },
  { label: "Settings", href: "/app/settings" },
  { label: "Design system", href: "/design" },
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
];

export function CommandMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-[15vh]", className)}>
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close command menu" onClick={() => setOpen(false)} />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[12px] border border-border bg-card text-card-foreground shadow-none"
        label="Command menu"
      >
        <Command.Input
          placeholder="Go to…"
          className="h-11 w-full border-b border-border bg-transparent px-4 text-14 outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-72 overflow-auto p-2">
          <Command.Empty className="px-3 py-6 text-13 text-muted-foreground">No matches.</Command.Empty>
          {items.map((item) => (
            <Command.Item
              key={item.href}
              value={item.label}
              className="flex cursor-pointer items-center rounded-[8px] px-3 py-2 text-14 aria-selected:bg-muted"
              onSelect={() => {
                setOpen(false);
                router.push(item.href);
              }}
            >
              {item.label}
            </Command.Item>
          ))}
        </Command.List>
        <div className="border-t border-border px-4 py-2 font-mono text-12 text-muted-foreground">
          ⌘K
        </div>
      </Command>
    </div>
  );
}

export function CommandMenuHint() {
  return (
    <p className="font-mono text-12 text-muted-foreground">
      Press ⌘K to open the command menu
    </p>
  );
}
