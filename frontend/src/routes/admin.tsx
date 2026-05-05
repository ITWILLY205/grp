import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  Settings,
  BookOpen,
  Calendar,
  Bell,
  Shield,
  Filter,
  Award,
  AlertTriangle,
  GraduationCap,
  UserCheck,
  UserPlus,
} from "lucide-react";

const adminNav = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "System Users", href: "/admin/users" },
  { icon: BookOpen, label: "Academics", href: "/admin/academics" },
  { icon: Calendar, label: "Timetable", href: "/admin/timetable" },
  { icon: FileBarChart, label: "Reports", href: "/admin/reports" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Shield, label: "Audit Log", href: "/admin/audit" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

import { useEffect } from "react";
import { toast } from "sonner";
import { usePermissionStore } from "@/lib/permissionStore";

function AdminLayout() {
  const { getOverduePermissions, markAsNotified } = usePermissionStore();

  useEffect(() => {
    const checkOverdue = () => {
      const overdue = getOverduePermissions();
      
      overdue.forEach(permission => {
        toast.error(`Return Time Reached!`, {
          description: `${permission.studentName} (${permission.classLevel}) was expected back by ${new Date(permission.dateIn).toLocaleString()}.`,
          duration: 10000,
          action: {
            label: "Ack",
            onClick: () => markAsNotified(permission.id)
          }
        });
        // We mark as notified immediately to avoid duplicate toasts on next tick
        markAsNotified(permission.id);
      });
    };

    // Initial check
    checkOverdue();

    // Check every 30 seconds
    const interval = setInterval(checkOverdue, 30000);
    return () => clearInterval(interval);
  }, [getOverduePermissions, markAsNotified]);

  return (
    <DashboardShell
      role="admin"
      roleLabel="Administrator"
      navItems={adminNav}
      userName="James Wilson"
      userEmail="admin@sms.com"
    >
      <Outlet />
    </DashboardShell>
  );
}
