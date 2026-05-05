import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/student/attendance")({
  component: StudentAttendance,
});

const attendanceData = [
  { date: "Apr 16", day: "Wed", status: "present" },
  { date: "Apr 15", day: "Tue", status: "present" },
  { date: "Apr 14", day: "Mon", status: "present" },
  { date: "Apr 11", day: "Fri", status: "absent" },
  { date: "Apr 10", day: "Thu", status: "present" },
  { date: "Apr 9", day: "Wed", status: "present" },
  { date: "Apr 8", day: "Tue", status: "present" },
  { date: "Apr 7", day: "Mon", status: "present" },
  { date: "Apr 4", day: "Fri", status: "present" },
  { date: "Apr 3", day: "Thu", status: "absent" },
  { date: "Apr 2", day: "Wed", status: "present" },
  { date: "Apr 1", day: "Tue", status: "present" },
];

function StudentAttendance() {
  const present = attendanceData.filter((d) => d.status === "present").length;
  const total = attendanceData.length;
  const pct = Math.round((present / total) * 100);

  return (
    <div>
      <PageHeader
        title="My Attendance"
        description="Your attendance record this term"
      />

      {/* Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-3xl font-bold text-gradient">{pct}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Attendance Rate</p>
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

      <h2 className="mb-4 text-lg font-bold">Attendance Log</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {attendanceData.map((d, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border p-3 ${
              d.status === "present"
                ? "border-chart-5/20 bg-chart-5/5"
                : "border-destructive/20 bg-destructive/5"
            }`}
          >
            {d.status === "present" ? (
              <Check className="h-5 w-5 text-chart-5" />
            ) : (
              <X className="h-5 w-5 text-destructive" />
            )}
            <div>
              <p className="text-sm font-medium">{d.date}</p>
              <p className="text-xs text-muted-foreground">{d.day}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
