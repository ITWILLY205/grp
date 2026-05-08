import { createFileRoute } from "@tanstack/react-router";
import { StatCard, PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { statsApi } from "@/lib/api";
import { getLogs } from "@/utils/auditLog";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});


const ACTION_LABELS: Record<string, string> = {
  LOGIN: "logged in",
  LOGOUT: "logged out",
  FAILED_LOGIN: "failed to log in",
  CREATE: "created a record",
  UPDATE: "updated a record",
  DELETE: "deleted a record",
  GRADE: "entered marks",
  EXPORT: "exported data",
  GENERATE: "generated a report",
  ASSIGN: "made an assignment",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

function AdminOverview() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, users: 0, classes: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    statsApi.getDashboardStats().then(res => setStats(res.data));
    const logs = getLogs().reverse().slice(0, 10);
    setRecentActivity(logs);
  }, []);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of your school's performance and activity"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={stats.students.toString()} change="+23 this month" changeType="up" color="bg-primary/10 text-primary" />
        <StatCard icon={GraduationCap} label="Teachers" value={stats.teachers.toString()} change="+2 new" changeType="up" color="bg-accent/10 text-accent" />
        <StatCard icon={BookOpen} label="System Users" value={stats.users.toString()} change="active now" changeType="neutral" color="bg-chart-5/10 text-chart-5" />
        <StatCard icon={TrendingUp} label="Total Classes" value={stats.classes.toString()} change="All active" changeType="up" color="bg-chart-4/10 text-chart-4" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-blue-600">Recent Activity</h2>
          <DataTable headers={["User", "Action", "Module", "Time"]}>
            {recentActivity.length > 0 ? recentActivity.map((a) => (
              <tr key={a.id} className="hover:bg-surface/50">
                <td className="px-5 py-3.5 text-sm font-medium">{a.user}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">
                  {ACTION_LABELS[a.action] || a.action}{a.target ? ` — ${a.target}` : ""}
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">{a.module}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground whitespace-nowrap">{timeAgo(a.timestamp)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No activity yet. Logs will appear here as users interact with the system.
                </td>
              </tr>
            )}
          </DataTable>
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-blue-600">System Status</h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, label: "Server Status", value: "Operational", color: "text-chart-5" },
              { icon: Clock, label: "Uptime", value: "—", color: "text-primary" },
              { icon: AlertCircle, label: "Pending Issues", value: "—", color: "text-accent" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-semibold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="pt-4 text-lg font-bold text-blue-600">Attendance Today</h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gradient">—</p>
                <p className="mt-1 text-sm text-muted-foreground">No data available</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-0 rounded-full bg-hero-gradient" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
