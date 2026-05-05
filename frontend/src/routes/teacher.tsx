import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  BookOpen,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const teacherNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/teacher" },
  { icon: FileText, label: "Marks & Grades", href: "/teacher/marks" },
  { icon: ClipboardCheck, label: "Attendance", href: "/teacher/attendance" },
  { icon: BookOpen, label: "elearning", href: "/teacher/materials" },
  { icon: BarChart3, label: "Performance", href: "/teacher/reports" },
  { icon: MessageSquare, label: "Messages", href: "/teacher/messages" },
];

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});

function TeacherLayout() {
  return (
    <DashboardShell
      role="teacher"
      roleLabel="Teacher"
      navItems={teacherNav}
      userName="Sarah Chen"
      userEmail="schen@sms.com"
    >
      <Outlet />
    </DashboardShell>
  );
}
