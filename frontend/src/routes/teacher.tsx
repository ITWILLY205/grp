import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  BookOpen,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Teacher");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      navigate({ to: "/staff-login" });
      return;
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.full_name || user.username || "Teacher");
        setUserEmail(user.email || user.username || "");
      } catch {
        // ignore parse error
      }
    }
  }, [navigate]);

  return (
    <DashboardShell
      role="teacher"
      roleLabel="Teacher"
      navItems={teacherNav}
      userName={userName}
      userEmail={userEmail}
    >
      <Outlet />
    </DashboardShell>
  );
}
