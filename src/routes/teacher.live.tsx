import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/dashboard/SharedUI";
import { Video, Clock, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/teacher/live")({
  component: TeacherLive,
});

const scheduledClasses = [
  { subject: "Calculus", class: "12-A", date: "Apr 16, 2026", time: "2:00 PM", duration: "60 min", enrolled: 32, status: "upcoming" },
  { subject: "Advanced Math", class: "11-A", date: "Apr 17, 2026", time: "10:00 AM", duration: "45 min", enrolled: 28, status: "scheduled" },
  { subject: "Mathematics", class: "10-A", date: "Apr 18, 2026", time: "9:00 AM", duration: "45 min", enrolled: 35, status: "scheduled" },
];

const pastClasses = [
  { subject: "Calculus", class: "12-A", date: "Apr 14, 2026", duration: "58 min", attended: 30, recorded: true },
  { subject: "Mathematics", class: "10-A", date: "Apr 13, 2026", duration: "44 min", attended: 33, recorded: true },
  { subject: "Advanced Math", class: "11-A", date: "Apr 12, 2026", duration: "47 min", attended: 25, recorded: false },
];

function TeacherLive() {
  return (
    <div>
      <PageHeader
        title="Live Classes"
        description="Schedule and manage your live video classes"
        action={
          <button className="flex items-center gap-2 rounded-xl bg-hero-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
            <Video className="h-4 w-4" />
            Schedule Class
          </button>
        }
      />

      {/* Upcoming */}
      <h2 className="mb-4 text-lg font-bold">Upcoming Classes</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scheduledClasses.map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold">{c.subject}</h3>
                <p className="text-sm text-muted-foreground">{c.class}</p>
              </div>
              <Badge variant={c.status === "upcoming" ? "success" : "default"}>{c.status}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {c.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {c.time} · {c.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {c.enrolled} enrolled
              </div>
            </div>
            {c.status === "upcoming" && (
              <button className="mt-4 w-full rounded-xl bg-hero-gradient py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
                Start Class Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Past */}
      <h2 className="mb-4 text-lg font-bold">Past Classes</h2>
      <div className="space-y-3">
        {pastClasses.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{c.subject} — {c.class}</p>
                <p className="text-xs text-muted-foreground">{c.date} · {c.duration} · {c.attended} attended</p>
              </div>
            </div>
            {c.recorded && (
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary">
                View Recording
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
