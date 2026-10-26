import {
  Brain,
  CalendarDays,
  CheckSquare,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  Settings,
  Target,
  Users,
} from "lucide-react";

export const navItems = [
  { href: "/app", label: "Today", icon: Inbox },
  { href: "/app/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/app/targets", label: "Targets", icon: Target },
  { href: "/app/pipeline", label: "Pipeline", icon: Users },
  { href: "/app/content", label: "Content", icon: CalendarDays },
  { href: "/app/brain", label: "Business Brain", icon: Brain },
  { href: "/app/report", label: "Report", icon: LayoutDashboard },
  { href: "/app/health", label: "Health", icon: HeartPulse },
  { href: "/app/settings", label: "Settings", icon: Settings },
];
