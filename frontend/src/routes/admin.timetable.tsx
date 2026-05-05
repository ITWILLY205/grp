import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";

export const Route = createFileRoute("/admin/timetable")({
  component: AdminTimetable,
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

const scheduleData: Record<string, Record<string, { subject: string; teacher: string; room: string }>> = {
  Monday: {
    "8:00": { subject: "Math", teacher: "Ms. Garcia", room: "101" },
    "9:00": { subject: "English", teacher: "Mr. Brown", room: "102" },
    "10:00": { subject: "Physics", teacher: "Mr. Park", room: "Lab 1" },
    "11:00": { subject: "Chemistry", teacher: "Ms. Chen", room: "Lab 2" },
    "13:00": { subject: "History", teacher: "Ms. Adams", room: "201" },
    "14:00": { subject: "CS", teacher: "Mr. Lee", room: "Computer Lab" },
  },
  Tuesday: {
    "8:00": { subject: "English", teacher: "Mr. Brown", room: "102" },
    "9:00": { subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
    "10:00": { subject: "Math", teacher: "Ms. Garcia", room: "101" },
    "11:00": { subject: "PE", teacher: "Coach Smith", room: "Gym" },
    "13:00": { subject: "Physics", teacher: "Mr. Park", room: "Lab 1" },
    "14:00": { subject: "Art", teacher: "Ms. Rivera", room: "Art Studio" },
  },
  Wednesday: {
    "8:00": { subject: "Chemistry", teacher: "Ms. Chen", room: "Lab 2" },
    "9:00": { subject: "Math", teacher: "Ms. Garcia", room: "101" },
    "10:00": { subject: "English", teacher: "Mr. Brown", room: "102" },
    "11:00": { subject: "CS", teacher: "Mr. Lee", room: "Computer Lab" },
    "13:00": { subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
  },
  Thursday: {
    "8:00": { subject: "Physics", teacher: "Mr. Park", room: "Lab 1" },
    "9:00": { subject: "History", teacher: "Ms. Adams", room: "201" },
    "10:00": { subject: "Math", teacher: "Ms. Garcia", room: "101" },
    "11:00": { subject: "English", teacher: "Mr. Brown", room: "102" },
    "13:00": { subject: "Chemistry", teacher: "Ms. Chen", room: "Lab 2" },
    "14:00": { subject: "PE", teacher: "Coach Smith", room: "Gym" },
  },
  Friday: {
    "8:00": { subject: "Biology", teacher: "Ms. Zhao", room: "Lab 3" },
    "9:00": { subject: "CS", teacher: "Mr. Lee", room: "Computer Lab" },
    "10:00": { subject: "History", teacher: "Ms. Adams", room: "201" },
    "11:00": { subject: "Math", teacher: "Ms. Garcia", room: "101" },
    "13:00": { subject: "Art", teacher: "Ms. Rivera", room: "Art Studio" },
  },
};

const subjectColors: Record<string, string> = {
  Math: "border-l-primary bg-primary/5",
  English: "border-l-accent bg-accent/5",
  Physics: "border-l-chart-3 bg-chart-3/5",
  Chemistry: "border-l-chart-4 bg-chart-4/5",
  Biology: "border-l-chart-5 bg-chart-5/5",
  History: "border-l-highlight bg-highlight/5",
  CS: "border-l-chart-1 bg-chart-1/5",
  PE: "border-l-chart-2 bg-chart-2/5",
  Art: "border-l-destructive bg-destructive/5",
};

function AdminTimetable() {
  return (
    <div>
      <PageHeader
        title="Timetable"
        description="Class 10-A weekly schedule"
        action={
          <button className="rounded-xl bg-hero-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:glow-primary">
            Edit Schedule
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
              {days.map((d) => (
                <th key={d} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{time}</td>
                {days.map((day) => {
                  const slot = scheduleData[day]?.[time];
                  return (
                    <td key={day} className="px-2 py-2">
                      {slot ? (
                        <div className={`rounded-lg border-l-4 p-2.5 ${subjectColors[slot.subject] || "border-l-border bg-surface"}`}>
                          <p className="text-sm font-semibold">{slot.subject}</p>
                          <p className="text-xs text-muted-foreground">{slot.teacher}</p>
                          <p className="text-xs text-muted-foreground">Room {slot.room}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-surface/30 p-2.5 text-center text-xs text-muted-foreground">
                          {time === "12:00" ? "Lunch Break" : "—"}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
