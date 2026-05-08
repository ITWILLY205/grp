import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Download, Eye, X } from "lucide-react";
import { getStudentsForParent } from "@/stores/studentData";

export const Route = createFileRoute("/parent/discipline")({
  component: DisciplinePage,
});

interface DisciplineRecord {
  id: number;
  date: string;
  type: "Commendation" | "Warning";
  description: string;
  reportedBy: string;
}

interface DisciplineReport {
  id: number;
  term: string;
  year: string;
  date: string;
  status: "Published" | "Draft";
}

function DisciplinePage() {
  const [selectedReport, setSelectedReport] = useState<DisciplineReport | null>(null);
  const children = getStudentsForParent("Robert Johnson");
  const primaryChild = children[0];

  const disciplineRecords: DisciplineRecord[] = [
    { id: 1, date: "April 10, 2024", type: "Commendation", description: "Excellent participation in class discussion", reportedBy: "Mr. Smith" },
    { id: 2, date: "March 28, 2024", type: "Commendation", description: "Helped fellow student with homework", reportedBy: "Ms. Johnson" },
    { id: 3, date: "March 15, 2024", type: "Warning", description: "Late arrival to class", reportedBy: "Mrs. Davis" },
  ];

  const reports: DisciplineReport[] = [
    { id: 1, term: "Term 1", year: "2024", date: "April 15, 2024", status: "Published" },
    { id: 2, term: "Term 2", year: "2024", date: "August 15, 2024", status: "Published" },
    { id: 3, term: "Term 3", year: "2024", date: "December 15, 2024", status: "Draft" },
  ];

  const handleDownload = (report: DisciplineReport) => {
    alert(`Downloading ${report.term} ${report.year} Discipline Report for ${primaryChild?.name}`);
  };

  const handleView = (report: DisciplineReport) => {
    setSelectedReport(report);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discipline</h1>
        <p className="text-gray-600 mt-1">Behavior reports, warnings, and commendations</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Discipline & Behavior</h3>
        <p className="text-sm text-blue-700">Behavior reports, warnings, and commendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Discipline Reports</h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.term} {report.year}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(report)}
                    disabled={report.status === "Draft"}
                    className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded ${
                      report.status === "Published"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(report)}
                    disabled={report.status === "Draft"}
                    className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded ${
                      report.status === "Published"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Behavior Record</h2>
          <div className="space-y-3">
            {disciplineRecords.map((record) => (
              <div key={record.id} className={`p-4 rounded-lg ${
                record.type === "Commendation" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{record.date}</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded ${
                    record.type === "Commendation" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>{record.type}</span>
                </div>
                <p className="text-sm text-gray-600">{record.description}</p>
                <p className="text-xs text-gray-500 mt-1">Reported by: {record.reportedBy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedReport.term} {selectedReport.year} Discipline Report - {primaryChild?.name}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Student Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Student Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {primaryChild?.name}</div>
                    <div><span className="text-gray-600">Class:</span> {primaryChild?.class}</div>
                    <div><span className="text-gray-600">Index No:</span> {primaryChild?.indexNumber}</div>
                    <div><span className="text-gray-600">Discipline Score:</span> {primaryChild?.disciplineMarks}/40</div>
                  </div>
                </div>

                {/* Behavior Records */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Behavior Records</h4>
                  <div className="space-y-2">
                    {disciplineRecords.map((record) => (
                      <div key={record.id} className={`p-3 rounded border ${
                        record.type === "Commendation" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{record.date}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                            record.type === "Commendation" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>{record.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                        <p className="text-xs text-gray-500">Reported by: {record.reportedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-600">Total Commendations:</span> 2</div>
                    <div><span className="text-gray-600">Total Warnings:</span> 1</div>
                    <div><span className="text-gray-600">Overall Discipline Score:</span> {primaryChild?.disciplineMarks}/40</div>
                    <div><span className="text-gray-600">Status:</span> {primaryChild?.disciplineMarks >= 30 ? "Good" : "Needs Improvement"}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
