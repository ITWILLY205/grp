import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookOpen, Download, Eye, X, ChevronDown } from "lucide-react";
import { getStudentsForParent, getSubjectsForClass } from "@/stores/studentData";

export const Route = createFileRoute("/parent/academic")({
  component: AcademicPage,
});

interface Report {
  id: number;
  term: string;
  year: string;
  date: string;
  status: "Published" | "Draft";
}

interface Assessment {
  id: number;
  type: "Quiz" | "Test" | "Exam" | "Assignment" | "Project";
  name: string;
  date: string;
  maxMarks: number;
  obtainedMarks: number;
  percentage: number;
}

interface SubjectMarks {
  subject: string;
  overallGrade: string;
  overallPercentage: number;
  assessments: Assessment[];
}

function AcademicPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const children = getStudentsForParent("Robert Johnson");
  const primaryChild = children[0];

  // Get subjects assigned to the student's class and stream
  const subjects = primaryChild 
    ? getSubjectsForClass(primaryChild.class, primaryChild.stream)
    : [];

  // Set default selected subject to first available subject
  useEffect(() => {
    if (subjects.length > 0 && selectedSubject === "") {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  const reports: Report[] = [
    { id: 1, term: "Term 1", year: "2024", date: "April 15, 2024", status: "Published" },
    { id: 2, term: "Term 2", year: "2024", date: "August 15, 2024", status: "Published" },
    { id: 3, term: "Term 3", year: "2024", date: "December 15, 2024", status: "Draft" },
  ];

  const subjectMarksData: Record<string, SubjectMarks> = {
    Mathematics: {
      subject: "Mathematics",
      overallGrade: "B+",
      overallPercentage: 85,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 10, 2024", maxMarks: 20, obtainedMarks: 18, percentage: 90 },
        { id: 2, type: "Quiz", name: "Quiz 2", date: "March 25, 2024", maxMarks: 20, obtainedMarks: 16, percentage: 80 },
        { id: 3, type: "Test", name: "Mid-Term Test", date: "April 5, 2024", maxMarks: 50, obtainedMarks: 42, percentage: 84 },
        { id: 4, type: "Assignment", name: "Assignment 1", date: "April 12, 2024", maxMarks: 30, obtainedMarks: 27, percentage: 90 },
        { id: 5, type: "Exam", name: "Final Exam", date: "April 20, 2024", maxMarks: 100, obtainedMarks: 85, percentage: 85 },
      ],
    },
    Physics: {
      subject: "Physics",
      overallGrade: "A-",
      overallPercentage: 90,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 12, 2024", maxMarks: 20, obtainedMarks: 19, percentage: 95 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 7, 2024", maxMarks: 50, obtainedMarks: 45, percentage: 90 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 22, 2024", maxMarks: 100, obtainedMarks: 90, percentage: 90 },
      ],
    },
    Chemistry: {
      subject: "Chemistry",
      overallGrade: "B-",
      overallPercentage: 76,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 15, 2024", maxMarks: 20, obtainedMarks: 14, percentage: 70 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 8, 2024", maxMarks: 50, obtainedMarks: 38, percentage: 76 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 23, 2024", maxMarks: 100, obtainedMarks: 76, percentage: 76 },
      ],
    },
    English: {
      subject: "English",
      overallGrade: "B+",
      overallPercentage: 88,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 14, 2024", maxMarks: 20, obtainedMarks: 18, percentage: 90 },
        { id: 2, type: "Assignment", name: "Essay Writing", date: "April 2, 2024", maxMarks: 50, obtainedMarks: 44, percentage: 88 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 21, 2024", maxMarks: 100, obtainedMarks: 88, percentage: 88 },
      ],
    },
    Biology: {
      subject: "Biology",
      overallGrade: "B+",
      overallPercentage: 87,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 16, 2024", maxMarks: 20, obtainedMarks: 17, percentage: 85 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 9, 2024", maxMarks: 50, obtainedMarks: 43, percentage: 86 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 24, 2024", maxMarks: 100, obtainedMarks: 87, percentage: 87 },
      ],
    },
    History: {
      subject: "History",
      overallGrade: "A",
      overallPercentage: 92,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 11, 2024", maxMarks: 20, obtainedMarks: 19, percentage: 95 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 6, 2024", maxMarks: 50, obtainedMarks: 46, percentage: 92 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 23, 2024", maxMarks: 100, obtainedMarks: 92, percentage: 92 },
      ],
    },
    Geography: {
      subject: "Geography",
      overallGrade: "B+",
      overallPercentage: 84,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 13, 2024", maxMarks: 20, obtainedMarks: 17, percentage: 85 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 8, 2024", maxMarks: 50, obtainedMarks: 42, percentage: 84 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 24, 2024", maxMarks: 100, obtainedMarks: 84, percentage: 84 },
      ],
    },
    Literature: {
      subject: "Literature",
      overallGrade: "A-",
      overallPercentage: 89,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 14, 2024", maxMarks: 20, obtainedMarks: 18, percentage: 90 },
        { id: 2, type: "Assignment", name: "Book Review", date: "April 3, 2024", maxMarks: 50, obtainedMarks: 44, percentage: 88 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 22, 2024", maxMarks: 100, obtainedMarks: 89, percentage: 89 },
      ],
    },
    Economics: {
      subject: "Economics",
      overallGrade: "B",
      overallPercentage: 82,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 12, 2024", maxMarks: 20, obtainedMarks: 16, percentage: 80 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 7, 2024", maxMarks: 50, obtainedMarks: 41, percentage: 82 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 23, 2024", maxMarks: 100, obtainedMarks: 82, percentage: 82 },
      ],
    },
    Accounting: {
      subject: "Accounting",
      overallGrade: "B+",
      overallPercentage: 86,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 15, 2024", maxMarks: 20, obtainedMarks: 17, percentage: 85 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 10, 2024", maxMarks: 50, obtainedMarks: 43, percentage: 86 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 25, 2024", maxMarks: 100, obtainedMarks: 86, percentage: 86 },
      ],
    },
    "Business Studies": {
      subject: "Business Studies",
      overallGrade: "B",
      overallPercentage: 83,
      assessments: [
        { id: 1, type: "Quiz", name: "Quiz 1", date: "March 13, 2024", maxMarks: 20, obtainedMarks: 16, percentage: 80 },
        { id: 2, type: "Test", name: "Mid-Term Test", date: "April 8, 2024", maxMarks: 50, obtainedMarks: 41, percentage: 82 },
        { id: 3, type: "Exam", name: "Final Exam", date: "April 24, 2024", maxMarks: 100, obtainedMarks: 83, percentage: 83 },
      ],
    },
  };

  const handleDownload = (report: Report) => {
    alert(`Downloading ${report.term} ${report.year} Report Card for ${primaryChild?.name}`);
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
  };

  const currentSubjectMarks = subjectMarksData[selectedSubject];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Academic Progress</h1>
        <p className="text-gray-600 mt-1">View report cards, assessments, and subject-wise performance</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Academic Progress</h3>
        <p className="text-sm text-blue-700">View report cards, assessments, and subject-wise performance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Report Cards</h2>
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Subject Performance</h2>
          <div className="space-y-3">
            {subjects.map((subject) => {
              const marks = subjectMarksData[subject];
              if (!marks) return null;
              return (
                <div key={subject} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{subject}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      marks.overallGrade.startsWith("A") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>{marks.overallGrade}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${marks.overallPercentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Subject Marks Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detailed Subject Marks</h2>
        
        {/* Subject Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Subjects assigned to {primaryChild?.class} - {primaryChild?.stream}</p>
        </div>

        {/* Subject Overview */}
        {currentSubjectMarks && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{currentSubjectMarks.subject}</h3>
                <p className="text-sm text-gray-600">Overall Performance</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{currentSubjectMarks.overallPercentage}%</p>
                <p className={`text-sm font-semibold ${
                  currentSubjectMarks.overallGrade.startsWith("A") ? "text-green-700" : "text-blue-700"
                }`}>Grade: {currentSubjectMarks.overallGrade}</p>
              </div>
            </div>
          </div>
        )}

        {/* Assessments Table */}
        {currentSubjectMarks && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assessment Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Max Marks</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Obtained</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {currentSubjectMarks.assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        assessment.type === "Quiz" ? "bg-purple-100 text-purple-800" :
                        assessment.type === "Test" ? "bg-blue-100 text-blue-800" :
                        assessment.type === "Exam" ? "bg-red-100 text-red-800" :
                        assessment.type === "Assignment" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>{assessment.type}</span>
                    </td>
                    <td className="py-3 px-4">{assessment.name}</td>
                    <td className="py-3 px-4 text-gray-600">{assessment.date}</td>
                    <td className="py-3 px-4 text-center">{assessment.maxMarks}</td>
                    <td className="py-3 px-4 text-center font-medium">{assessment.obtainedMarks}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        assessment.percentage >= 80 ? "text-green-600" :
                        assessment.percentage >= 60 ? "text-blue-600" :
                        "text-red-600"
                      }`}>{assessment.percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedReport.term} {selectedReport.year} Report Card - {primaryChild?.name}
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
                    <div><span className="text-gray-600">Stream:</span> {primaryChild?.stream}</div>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Subject Grades</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Subject</th>
                        <th className="text-center py-2">Score</th>
                        <th className="text-center py-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => {
                        const marks = subjectMarksData[subject];
                        if (!marks) return null;
                        return (
                          <tr key={subject} className="border-b border-gray-100">
                            <td className="py-2">{subject}</td>
                            <td className="text-center py-2">{marks.overallPercentage}%</td>
                            <td className="text-center py-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                marks.overallGrade.startsWith("A") ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}>{marks.overallGrade}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-600">GPA:</span> 3.56</div>
                    <div><span className="text-gray-600">Class Rank:</span> #5</div>
                    <div><span className="text-gray-600">Attendance:</span> 96.5%</div>
                    <div><span className="text-gray-600">Discipline:</span> {primaryChild?.disciplineMarks}/40</div>
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
