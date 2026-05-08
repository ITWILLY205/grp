import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Video,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

const studentNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/student" },
  { icon: Award, label: "My Grades", href: "/student/grades" },
  { icon: BookOpen, label: "Materials", href: "/student/materials" },
  { icon: ClipboardCheck, label: "Attendance", href: "/student/attendance" },
  { icon: Video, label: "Live Classes", href: "/student/live" },
  { icon: Calendar, label: "Schedule", href: "/student/schedule" },
];

export const Route = createFileRoute("/student")({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      throw redirect({ to: "/login-student" });
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role !== 'STUDENT') {
        throw redirect({ to: "/login-student" });
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw redirect({ to: "/login-student" });
    }
  },
  component: StudentLayout,
});

function StudentLayout() {
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.full_name || user.username || "Student");
        setUserEmail(user.email || user.username || "");
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <DashboardShell
      role="student"
      roleLabel="Student"
      navItems={studentNav}
      userName={userName}
      userEmail={userEmail}
    >
      <Outlet />
    </DashboardShell>
  );
}
