import {
  Activity,
  Brain,
  CalendarDays,
  CheckSquare,
  Inbox,
  Kanban,
  LayoutDashboard,
  Megaphone,
  Radio,
  Repeat,
  Send,
  Settings,
} from "lucide-react";

export const navItems = [
  { href: "/app", label: "Today", icon: Inbox },
  { href: "/app/pipeline", label: "Tracker", icon: Kanban },
  { href: "/app/outreach", label: "Outreach", icon: Send },
  { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/app/health", label: "Health", icon: Activity },
  { href: "/app/channels", label: "Channels", icon: Radio },
  { href: "/app/sprint", label: "Sprint", icon: CalendarDays },
  { href: "/app/brain", label: "Brain", icon: Brain },
  { href: "/app/report", label: "Report", icon: LayoutDashboard },
  { href: "/app/ads", label: "Ads", icon: Megaphone },
  { href: "/app/loop", label: "Loop", icon: Repeat },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
