import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";

const parentNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/parent" },
  { icon: Users, label: "My Children", href: "/parent/children" },
  { icon: BookOpen, label: "Academic Progress", href: "/parent/academic" },
  { icon: ClipboardCheck, label: "Attendance", href: "/parent/attendance" },
  { icon: MessageSquare, label: "Messages", href: "/parent/messages" },
  { icon: AlertTriangle, label: "Discipline", href: "/parent/discipline" },
];

export const Route = createFileRoute("/parent")({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      throw redirect({ to: "/login-parent" });
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role !== 'PARENT') {
        throw redirect({ to: "/login-parent" });
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw redirect({ to: "/login-parent" });
    }
  },
  component: ParentLayout,
});

function ParentLayout() {
  const [userName, setUserName] = useState("Parent");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.full_name || user.username || "Parent");
        setUserEmail(user.email || user.username || "");
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <DashboardShell
      role="parent"
      roleLabel="Parent"
      navItems={parentNav}
      userName={userName}
      userEmail={userEmail}
    >
      <Outlet />
    </DashboardShell>
  );
}
