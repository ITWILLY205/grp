import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/parent/attendance")({
  component: ParentAttendance,
});

const months = [
  {
    name: "April 2026",
    days: [
      { date: 1, day: "Tue", status: "present" },
      { date: 2, day: "Wed", status: "present" },
      { date: 3, day: "Thu", status: "absent" },
      { date: 4, day: "Fri", status: "present" },
      { date: 7, day: "Mon", status: "present" },
      { date: 8, day: "Tue", status: "present" },
      { date: 9, day: "Wed", status: "present" },
      { date: 10, day: "Thu", status: "present" },
      { date: 11, day: "Fri", status: "absent" },
      { date: 14, day: "Mon", status: "present" },
      { date: 15, day: "Tue", status: "present" },
      { date: 16, day: "Wed", status: "present" },
    ],
  },
];

function ParentAttendance() {
  const data = months[0];
  const present = data.days.filter((d) => d.status === "present").length;
  const total = data.days.length;

  return (
    <div>
      <PageHeader
        title="Attendance Record"
        description="Alice Johnson's attendance tracking"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-gradient">{Math.round((present / total) * 100)}%</p>
          <p className="mt-1 text-sm text-muted-foreground">This Month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-chart-5">{present}</p>
          <p className="mt-1 text-sm text-muted-foreground">Days Present</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-destructive">{total - present}</p>
          <p className="mt-1 text-sm text-muted-foreground">Days Absent</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">{data.name}</h2>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {data.days.map((d) => (
          <div
            key={d.date}
            className={`flex items-center gap-2 rounded-xl border p-3 ${
              d.status === "present" ? "border-chart-5/20 bg-chart-5/5" : "border-destructive/20 bg-destructive/5"
            }`}
          >
            {d.status === "present" ? <Check className="h-4 w-4 text-chart-5" /> : <X className="h-4 w-4 text-destructive" />}
            <div>
              <p className="text-sm font-medium">Apr {d.date}</p>
              <p className="text-xs text-muted-foreground">{d.day}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
