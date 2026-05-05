import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";

export const Route = createFileRoute("/parent/performance")({
  component: ParentPerformance,
});

const examHistory = [
  { exam: "Midterm Exam", date: "Mar 2026", math: 88, physics: 90, chem: 78, eng: 85, bio: 87, cs: 92, avg: 87 },
  { exam: "Assignment 3", date: "Feb 2026", math: 85, physics: 92, chem: 76, eng: 88, bio: 90, cs: 95, avg: 88 },
  { exam: "Quiz 2", date: "Jan 2026", math: 82, physics: 85, chem: 72, eng: 80, bio: 85, cs: 90, avg: 82 },
  { exam: "Term 1 Final", date: "Dec 2025", math: 80, physics: 82, chem: 70, eng: 82, bio: 80, cs: 88, avg: 80 },
];

function ParentPerformance() {
  return (
    <div>
      <PageHeader
        title="Academic Performance"
        description="Detailed performance tracking for Alice Johnson"
      />

      {/* Trend */}
      <div className="mb-8 rounded-2xl border border-primary/20 bg-surface p-6">
        <h3 className="text-lg font-bold">Performance Trend</h3>
        <p className="mt-1 text-sm text-muted-foreground">Average scores over the last 4 assessments</p>
        <div className="mt-6 flex items-end gap-6">
          {examHistory.reverse().map((e) => (
            <div key={e.exam} className="flex flex-1 flex-col items-center">
              <span className="mb-2 text-sm font-bold text-gradient">{e.avg}%</span>
              <div className="w-full rounded-t-lg bg-hero-gradient" style={{ height: `${e.avg * 1.5}px` }} />
              <span className="mt-2 text-xs text-muted-foreground">{e.date}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">Exam History</h2>
      <DataTable headers={["Exam", "Date", "Math", "Physics", "Chem", "English", "Bio", "CS", "Average"]}>
        {[...examHistory].reverse().map((e) => (
          <tr key={e.exam} className="hover:bg-surface/50">
            <td className="px-5 py-3.5 text-sm font-medium">{e.exam}</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.date}</td>
            <td className="px-5 py-3.5 text-sm">{e.math}</td>
            <td className="px-5 py-3.5 text-sm">{e.physics}</td>
            <td className="px-5 py-3.5 text-sm">{e.chem}</td>
            <td className="px-5 py-3.5 text-sm">{e.eng}</td>
            <td className="px-5 py-3.5 text-sm">{e.bio}</td>
            <td className="px-5 py-3.5 text-sm">{e.cs}</td>
            <td className="px-5 py-3.5 text-sm font-bold text-primary">{e.avg}%</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
