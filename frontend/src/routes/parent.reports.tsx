import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Badge } from "@/components/dashboard/SharedUI";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/parent/reports")({
  component: ParentReports,
});

const reports = [
  { name: "Term 1 Report Card", type: "PDF", date: "Apr 2026", status: "ready" },
  { name: "Attendance Summary — March", type: "PDF", date: "Mar 2026", status: "ready" },
  { name: "Mid-Year Progress Report", type: "PDF", date: "Feb 2026", status: "ready" },
  { name: "Term 1 Grades Export", type: "Excel", date: "Jan 2026", status: "ready" },
];

function ParentReports() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Download academic reports for Alice Johnson"
      />

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                r.type === "PDF" ? "bg-destructive/10" : "bg-chart-5/10"
              }`}>
                {r.type === "PDF" ? (
                  <FileText className="h-5 w-5 text-destructive" />
                ) : (
                  <FileSpreadsheet className="h-5 w-5 text-chart-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.date} · {r.type}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
