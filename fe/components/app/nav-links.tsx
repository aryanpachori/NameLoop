"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/app/nav-items";
import { useWorkspace } from "@/lib/store";
import { cn } from "@/lib/utils";

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { state } = useWorkspace();
  const pending = state.drafts.filter((draft) => draft.status === "pending").length;
  const dueNow = state.queue.filter((item) => item.urgency === "now").length;

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        const count =
          item.href === "/app"
            ? dueNow
            : item.href === "/app/approvals"
              ? pending
              : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-14 transition-colors duration-150 ease-out",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {count > 0 ? (
              <span className="rounded-[8px] bg-primary px-1.5 font-mono text-12 tabular-nums text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
