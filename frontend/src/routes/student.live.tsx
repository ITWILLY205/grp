import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/dashboard/SharedUI";
import { Video, Clock, Users } from "lucide-react";

export const Route = createFileRoute("/student/live")({
  component: StudentLive,
});

const liveClasses = [
  { subject: "Calculus", teacher: "Ms. Chen", time: "2:00 PM", date: "Apr 16", status: "upcoming" },
  { subject: "Advanced Math", teacher: "Ms. Chen", time: "10:00 AM", date: "Apr 17", status: "scheduled" },
];

const recordings = [
  { subject: "Calculus", teacher: "Ms. Chen", date: "Apr 14", duration: "58 min" },
  { subject: "Physics", teacher: "Mr. Park", date: "Apr 13", duration: "44 min" },
];

function StudentLive() {
  return (
    <div>
      <PageHeader title="Live Classes" description="Join live sessions and watch recordings" />

      <h2 className="mb-4 text-lg font-bold">Upcoming Sessions</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {liveClasses.map((c, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-bold">{c.subject}</h3>
              <Badge variant={c.status === "upcoming" ? "success" : "default"}>{c.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{c.teacher}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> {c.date} · {c.time}
            </div>
            {c.status === "upcoming" && (
              <button className="mt-4 w-full rounded-xl bg-hero-gradient py-2.5 text-sm font-semibold text-primary-foreground">
                Join Class
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-bold">Recordings</h2>
      <div className="space-y-3">
        {recordings.map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">{r.subject}</p>
                <p className="text-xs text-muted-foreground">{r.teacher} · {r.date} · {r.duration}</p>
              </div>
            </div>
            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
              Watch
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
