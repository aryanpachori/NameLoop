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
    <nav className="flex flex-col gap-1">
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
              "flex items-center gap-2 rounded-[14px] px-2 py-2 text-[14px] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {count > 0 ? (
              <span className="rounded-[22px] bg-primary px-2 text-[13px] tabular-nums text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
