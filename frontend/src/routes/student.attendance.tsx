import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/student/attendance")({
  component: StudentAttendance,
});

function StudentAttendance() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when attendance endpoint is available
      // const res = await attendanceApi.getMyAttendance();
      // setAttendanceData(res.data || []);
      setAttendanceData([]);
    } catch (err: any) {
      toast.error("Failed to load attendance");
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const present = attendanceData.filter((d) => d.status === "present").length;
  const total = attendanceData.length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading attendance...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Attendance"
        description="Your attendance record this term"
      />

      {attendanceData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No attendance data available yet.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
