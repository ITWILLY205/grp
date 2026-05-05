import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

const parentNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/parent" },
  { icon: Users, label: "My Children", href: "/parent/children" },
  { icon: BookOpen, label: "Academic Progress", href: "/parent/academic" },
  { icon: ClipboardCheck, label: "Attendance", href: "/parent/attendance" },
  { icon: MessageSquare, label: "Messages", href: "/parent/messages" },
  { icon: AlertTriangle, label: "Discipline", href: "/parent/discipline" },
];

export const Route = createFileRoute("/parent")({
  component: ParentLayout,
});

function ParentLayout() {
  return (
    <DashboardShell
      role="parent"
      roleLabel="Parent"
      navItems={parentNav}
      userName="Robert Johnson"
      userEmail="rjohnson@sms.com"
    >
      <Outlet />
    </DashboardShell>
  );
}
