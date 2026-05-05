import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Video,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

const studentNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/student" },
  { icon: Award, label: "My Grades", href: "/student/grades" },
  { icon: BookOpen, label: "Materials", href: "/student/materials" },
  { icon: ClipboardCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Video, label: "Live Classes", href: "/student/live" },
  { icon: Calendar, label: "Schedule", href: "/student/schedule" },
];

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <DashboardShell
      role="student"
      roleLabel="Student"
      navItems={studentNav}
      userName="Alice Johnson"
      userEmail="alice@sms.com"
    >
      <Outlet />
    </DashboardShell>
  );
}
