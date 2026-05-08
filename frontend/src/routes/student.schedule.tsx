import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";

export const Route = createFileRoute("/student/schedule")({
  component: StudentSchedule,
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const schedule: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
  Monday: [
    { time: "8:00", subject: "Math", teacher: "Ms. Chen", room: "101" },
    { time: "9:00", subject: "English", teacher: "Mr. Brown", room: "102" },
    { time: "10:00", subject: "Physics", teacher: "Mr. Park", room: "Lab 1" },
    { time: "11:00", subject: "Chemistry", teacher: "Ms. Adams", room: "Lab 2" },
    { time: "13:00", subject: "History", teacher: "Ms. Rivera", room: "201" },
  ],
  Tuesday: [
    { time: "8:00", subject: "English", teacher: "Mr. Brown", room: "102" },
    { time: "9:00", subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
    { time: "10:00", subject: "Math", teacher: "Ms. Chen", room: "101" },
    { time: "11:00", subject: "PE", teacher: "Coach Smith", room: "Gym" },
    { time: "13:00", subject: "CS", teacher: "Mr. Lee", room: "Comp Lab" },
  ],
  Wednesday: [
    { time: "8:00", subject: "Chemistry", teacher: "Ms. Adams", room: "Lab 2" },
    { time: "9:00", subject: "Math", teacher: "Ms. Chen", room: "101" },
    { time: "10:00", subject: "English", teacher: "Mr. Brown", room: "102" },
    { time: "11:00", subject: "CS", teacher: "Mr. Lee", room: "Comp Lab" },
    { time: "13:00", subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
  ],
  Thursday: [
    { time: "8:00", subject: "Physics", teacher: "Mr. Park", room: "Lab 1" },
    { time: "9:00", subject: "History", teacher: "Ms. Rivera", room: "201" },
    { time: "10:00", subject: "Math", teacher: "Ms. Chen", room: "101" },
    { time: "11:00", subject: "English", teacher: "Mr. Brown", room: "102" },
    { time: "14:00", subject: "Calculus (Live)", teacher: "Ms. Chen", room: "Virtual" },
  ],
  Friday: [
    { time: "8:00", subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
    { time: "9:00", subject: "CS", teacher: "Mr. Lee", room: "Comp Lab" },
    { time: "10:00", subject: "History", teacher: "Ms. Rivera", room: "201" },
    { time: "11:00", subject: "Math", teacher: "Ms. Chen", room: "101" },
  ],
};

const subjectColors: Record<string, string> = {
  Math: "border-l-primary",
  English: "border-l-accent",
  Physics: "border-l-chart-3",
  Chemistry: "border-l-chart-4",
  Biology: "border-l-chart-5",
  History: "border-l-highlight",
  CS: "border-l-chart-1",
  PE: "border-l-chart-2",
  "Calculus (Live)": "border-l-destructive",
};

function StudentSchedule() {
  return (
    <div>
      <PageHeader title="My Schedule" description="Weekly class schedule" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {days.map((day) => (
          <div key={day}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{day}</h3>
            <div className="space-y-2">
              {schedule[day]?.map((s, i) => (
                <div key={i} className={`rounded-xl border-l-4 bg-card p-3 ${subjectColors[s.subject] || "border-l-border"}`}>
                  <p className="text-xs font-semibold text-primary">{s.time}</p>
                  <p className="text-sm font-semibold">{s.subject}</p>
                  <p className="text-xs text-muted-foreground">{s.teacher}</p>
                  <p className="text-xs text-muted-foreground">{s.room}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
