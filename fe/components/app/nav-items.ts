import {
  Brain,
  CalendarDays,
  CheckSquare,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Radio,
  Repeat,
  Send,
  Settings,
} from "lucide-react";

export const navItems = [
  { href: "/app", label: "Today", icon: Inbox },
  { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/app/channels", label: "Channels", icon: Radio },
  { href: "/app/sprint", label: "Sprint", icon: CalendarDays },
  { href: "/app/outreach", label: "Outreach", icon: Send },
  { href: "/app/brain", label: "Brain", icon: Brain },
  { href: "/app/report", label: "Report", icon: LayoutDashboard },
  { href: "/app/ads", label: "Ads", icon: Megaphone },
  { href: "/app/loop", label: "Loop", icon: Repeat },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
