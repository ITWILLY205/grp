import { createFileRoute } from "@tanstack/react-router";
import { StatCard, PageHeader } from "@/components/dashboard/SharedUI";
import { Award, BookOpen, ClipboardCheck, Video } from "lucide-react";
import { recordApi, notificationsApi } from "@/lib/api";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/student/")({
  component: StudentOverview,
});

function StudentOverview() {
  const session = JSON.parse(localStorage.getItem("session_user") || "{}");
  const studentName = session.name || "Student";
  const studentId = session.id;

  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      recordApi.getStudentMarks(studentId).then(res => setRecentGrades(res.data.slice(0, 4))).catch(console.error);
      notificationsApi.getForUser(studentId).then(res => setNotifications(res.data)).catch(console.error);
    }
  }, [studentId]);

  const disciplineAlerts = notifications.filter(n => n.type === 'discipline');

  const upcomingDeadlines = [
    { title: "Math Assignment Ch.8", subject: "Mathematics", due: "Apr 18", type: "Assignment" },
    { title: "Physics Lab Report", subject: "Physics", due: "Apr 20", type: "Report" },
    { title: "Biology Quiz", subject: "Biology", due: "Apr 21", type: "Quiz" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${studentName.split(' ')[0]}!`}
        description="Here's your academic overview"
      />

      {/* Discipline Alerts */}
      {disciplineAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {disciplineAlerts.slice(0, 3).map((alert: any) => (
            <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <span className="text-red-600 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-bold text-red-800">{alert.title}</p>
                <p className="text-xs text-red-700 mt-0.5">{alert.message}</p>
                <p className="text-[10px] text-red-400 mt-1">{new Date(alert.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Award} label="Total Subjects" value={recentGrades.length.toString()} color="bg-primary/10 text-primary" />
        <StatCard icon={BookOpen} label="Alerts" value={disciplineAlerts.length.toString()} color={disciplineAlerts.length > 0 ? "bg-red-100 text-red-600" : "bg-accent/10 text-accent"} />
        <StatCard icon={ClipboardCheck} label="Marks Recorded" value={recentGrades.length > 0 ? 'Yes' : 'None yet'} color="bg-chart-5/10 text-chart-5" />
        <StatCard icon={Video} label="Status" value="Active" color="bg-chart-4/10 text-chart-4" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-bold">Recent Marks</h2>
          <div className="space-y-3">
            {recentGrades.length > 0 ? recentGrades.map((g: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div>
                  <p className="text-sm font-semibold">{g.subject_name || 'Subject'}</p>
                  <p className="text-xs text-muted-foreground">{g.term_name || 'Term'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{g.total_score || 0}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                    g.grade === 'A' ? 'bg-chart-5/15 text-chart-5' : 'bg-primary/15 text-primary'
                  }`}>
                    {g.grade || 'N/A'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                No marks recorded yet. Once your teacher enters marks, they will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div>
          <h2 className="mb-4 text-lg font-bold">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-accent/10">
                  <span className="text-xs text-accent">{d.due.split(" ")[0]}</span>
                  <span className="text-sm font-bold text-accent">{d.due.split(" ")[1]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.subject} · {d.type}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-4 mt-8 text-lg font-bold">Today's Classes</h2>
          <div className="space-y-2">
            {[
              { time: "9:00 AM", subject: "Mathematics", room: "101" },
              { time: "11:00 AM", subject: "Physics", room: "Lab 1" },
              { time: "2:00 PM", subject: "Calculus", room: "Virtual" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-sm font-semibold text-primary">{c.time}</span>
                <span className="text-sm">{c.subject}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.room}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
