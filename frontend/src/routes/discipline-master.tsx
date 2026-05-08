import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
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
import { useEffect, useState } from "react";

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
  beforeLoad: ({ location }) => {
    const userJson = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userJson) {
      throw redirect({
        to: "/login-staff",
        search: { redirect: location.href },
      });
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role !== "DISCIPLINE_MASTER") {
        throw redirect({ to: "/" });
      }
    } catch (e) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      throw redirect({ to: "/login-staff" });
    }
  },
  component: DisciplineMasterLayout,
});

function DisciplineMasterLayout() {
  const [userName, setUserName] = useState("Discipline Officer");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.full_name || user.username || "Discipline Officer");
        setUserEmail(user.email || user.username || "");
      } catch {
        // ignore parse error
      }
    }
  }, []);

  return (
    <DashboardShell
      role="dod"
      roleLabel="Discipline on Duty"
      navItems={dodNav}
      userName={userName}
      userEmail={userEmail}
    >
      <Outlet />
    </DashboardShell>
  );
}

