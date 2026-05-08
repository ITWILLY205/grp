import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge } from "@/components/dashboard/SharedUI";

export const Route = createFileRoute("/student/grades")({
  component: StudentGrades,
});

import { recordApi } from "@/lib/api";
import { useEffect, useState } from "react";

function StudentGrades() {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session_user") || "{}");
    if (session && session.id) {
      recordApi.getStudentMarks(session.id).then(res => setGrades(res.data)).catch(console.error);
    }
  }, []);

  const calculateGpa = (grade: string) => {
    if (!grade) return 0;
    if (grade.startsWith("A")) return 4.0;
    if (grade.startsWith("B")) return 3.0;
    if (grade.startsWith("C")) return 2.0;
    if (grade.startsWith("D")) return 1.0;
    return 0;
  };

  const cumulativeGpa = grades.length > 0 
    ? (grades.reduce((sum, g) => sum + calculateGpa(g.grade), 0) / grades.length).toFixed(2)
    : "0.00";

  return (
    <div>
      <PageHeader
        title="My Grades"
        description="Academic performance across all subjects"
      />

      {/* GPA Card */}
      <div className="mb-8 flex items-center gap-6 rounded-2xl border border-primary/20 bg-surface p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-hero-gradient">
          <span className="text-2xl font-extrabold text-primary-foreground">{cumulativeGpa}</span>
        </div>
        <div>
          <p className="text-lg font-bold">Cumulative GPA</p>
          <p className="text-sm text-muted-foreground">Based on {grades.length} courses this term</p>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-hero-gradient" style={{ width: `${(parseFloat(cumulativeGpa) / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      <DataTable headers={["Subject", "Term", "CAT Score", "Exam Score", "Total Score", "Grade", "GPA"]}>
        {grades.map((g, i) => (
          <tr key={i} className="hover:bg-surface/50">
            <td className="px-5 py-3.5 text-sm font-medium">{g.subject_name || "Unknown"}</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{g.term_name || "N/A"}</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{g.cat_score || 0}%</td>
            <td className="px-5 py-3.5 text-sm text-muted-foreground">{g.exam_score || 0}%</td>
            <td className="px-5 py-3.5 text-sm font-semibold">{g.total_score || 0}%</td>
            <td className="px-5 py-3.5">
              <Badge variant={g.grade && g.grade.startsWith("A") ? "success" : g.grade && g.grade.startsWith("B") ? "default" : "warning"}>
                {g.grade || "N/A"}
              </Badge>
            </td>
            <td className="px-5 py-3.5 text-sm font-semibold">{calculateGpa(g.grade).toFixed(1)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
