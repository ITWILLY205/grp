import { createFileRoute } from "@tanstack/react-router";
import { StatCard, PageHeader, DataTable } from "@/components/dashboard/SharedUI";
import {
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/')({
  component: DODOverview,
});

const recentActivity = [
  { user: "DOD Officer", action: "Resolved discipline case #452", time: "5 min ago", type: "resolved" },
  { user: "System", action: "New permission request from Student #1245", time: "12 min ago", type: "permission" },
  { user: "DOD Officer", action: "Marked attendance for Class 10-B", time: "1 hour ago", type: "attendance" },
  { user: "Mr. Johnson", action: "Reported student misconduct", time: "2 hours ago", type: "report" },
  { user: "DOD Officer", action: "Approved leave request #78", time: "3 hours ago", type: "approved" },
];

function DODOverview() {
  return (
    <div>
      <PageHeader
        title="Discipline Dashboard"
        description="Overview of discipline management and student behavior monitoring"
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value="1,247" change="+5 today" changeType="up" color="bg-primary/10 text-primary" />
        <StatCard icon={Shield} label="Active Cases" value="12" change="3 urgent" changeType="neutral" color="bg-accent/10 text-accent" />
        <StatCard icon={AlertTriangle} label="Incidents Today" value="4" change="-2 vs yesterday" changeType="up" color="bg-chart-5/10 text-chart-5" />
        <StatCard icon={CheckCircle} label="Resolved Cases" value="89%" change="+4.2%" changeType="up" color="bg-chart-4/10 text-chart-4" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-blue-600">Recent Activity</h2>
          <DataTable headers={["User", "Action", "Time"]}>
            {recentActivity.map((a, i) => (
              <tr key={i} className="hover:bg-surface/50">
                <td className="px-5 py-3.5 text-sm font-medium">{a.user}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{a.action}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{a.time}</td>
              </tr>
            ))}
          </DataTable>
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-blue-600">System Status</h2>
          <div className="space-y-3">
            {[
              { icon: Shield, label: "DOD Status", value: "On Duty", color: "text-chart-5" },
              { icon: Clock, label: "Shift Started", value: "2h 15m ago", color: "text-primary" },
              { icon: FileCheck, label: "Pending Reviews", value: "8", color: "text-accent" },
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
                <p className="text-3xl font-bold text-gradient">96.8%</p>
                <p className="mt-1 text-sm text-muted-foreground">1,208 / 1,247 present</p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[96.8%] rounded-full bg-hero-gradient" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
