import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  Shield,
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  BarChart3,
  UserCheck,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Bell,
} from "lucide-react";

interface DisciplineCase {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
  description: string;
  reportedBy: string;
}

interface AttendanceRecord {
  id: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  class: string;
  stream: string;
}

interface PermissionRequest {
  id: string;
  studentName: string;
  type: 'leave' | 'medical' | 'special' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
}

const dodNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/discipline-master" },
  { icon: Shield, label: "Discipline", href: "/discipline-master/discipline" },
  { icon: Users, label: "Students", href: "/discipline-master/students" },
  { icon: FileText, label: "Permission", href: "/discipline-master/permission" },
  { icon: UserCheck, label: "Attendance", href: "/discipline-master/attendance" },
  { icon: BarChart3, label: "Reports", href: "/discipline-master/reports" },
  { icon: Bell, label: "Notifications", href: "/discipline-master/notifications" },
];

export const Route = createFileRoute('/discipline-master')({
  component: DisciplineMasterLayout,
});

function DisciplineMasterLayout() {
  return (
    <DashboardShell
      role="dod"
      roleLabel="Discipline on Duty"
      navItems={dodNav}
      userName="DOD Officer"
      userEmail="dod@scholar-sphere.com"
    >
      <Outlet />
    </DashboardShell>
  );
}

