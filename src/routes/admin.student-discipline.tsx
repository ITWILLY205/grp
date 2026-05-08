import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, GraduationCap, AlertTriangle, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/student-discipline")({
  component: StudentDiscipline,
});

function StudentDiscipline() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Unknown Student");
  const [studentClass, setStudentClass] = useState("Unknown Class");
  const [currentMarks, setCurrentMarks] = useState(40);
  const [recentReason, setRecentReason] = useState("No recent incident");

  useEffect(() => {
    const data = sessionStorage.getItem("disciplineData");
    if (data) {
      const parsedData = JSON.parse(data);
      setStudentName(parsedData.studentName || "Unknown Student");
      setStudentClass(parsedData.class || "Unknown Class");
      setCurrentMarks(parsedData.currentMarks || 40);
      setRecentReason(parsedData.reason || "No recent incident");
      sessionStorage.removeItem("disciplineData");
    }
  }, []);

  const recentMistakes = [
    { id: 1, date: "2026-04-15", offense: recentReason, marksDeducted: 5, remaining: currentMarks },
    { id: 2, date: "2026-04-10", offense: "Late Coming", marksDeducted: 3, remaining: currentMarks + 5 },
    { id: 3, date: "2026-04-05", offense: "Uniform Violation", marksDeducted: 2, remaining: currentMarks + 8 },
  ];

  const getMarksColor = (marks: number) => {
    if (marks >= 30) return "text-green-600";
    if (marks >= 20) return "text-yellow-600";
    if (marks >= 10) return "text-orange-600";
    return "text-red-600";
  };

  const getMarksBgColor = (marks: number) => {
    if (marks >= 30) return "bg-green-50 border-green-200";
    if (marks >= 20) return "bg-yellow-50 border-yellow-200";
    if (marks >= 10) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate({ to: "/admin/academics" })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Academics
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Discipline Details</h1>
          <p className="text-gray-600 mt-2">View student discipline marks and recent mistakes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Student Info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{studentName}</h2>
                  <p className="text-sm text-gray-600">Class {studentClass}</p>
                </div>
              </div>

              {/* Current Discipline Marks */}
              <div className={`${getMarksBgColor(currentMarks)} border rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Discipline Marks</p>
                  <GraduationCap className="h-4 w-4 text-gray-600" />
                </div>
                <p className={`text-4xl font-bold ${getMarksColor(currentMarks)}`}>{currentMarks}/40</p>
                <p className="text-xs text-gray-600 mt-1">Maximum: 40 marks</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-medium">{((currentMarks / 40) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      currentMarks >= 30 ? "bg-green-500" :
                      currentMarks >= 20 ? "bg-yellow-500" :
                      currentMarks >= 10 ? "bg-orange-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(currentMarks / 40) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Warning if low marks */}
              {currentMarks <= 10 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Critical Warning</p>
                    <p className="text-xs text-red-700 mt-1">Student has low discipline marks. Immediate action required.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Recent Mistakes */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Mistakes</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>History</span>
                </div>
              </div>

              <div className="space-y-4">
                {recentMistakes.map((mistake) => (
                  <div key={mistake.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mistake.offense}</p>
                          <p className="text-sm text-gray-600 mt-1">{mistake.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">-{mistake.marksDeducted} marks</p>
                        <p className="text-xs text-gray-600 mt-1">Remaining: {mistake.remaining}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Deductions</p>
                    <p className="font-semibold text-gray-900">{40 - currentMarks} marks</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Remaining Marks</p>
                    <p className={`font-semibold ${getMarksColor(currentMarks)}`}>{currentMarks} marks</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Recent Incident</p>
                    <p className="font-semibold text-gray-900 truncate">{recentReason}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className={`font-semibold ${currentMarks >= 20 ? "text-green-600" : "text-red-600"}`}>
                      {currentMarks >= 20 ? "Good" : "Needs Attention"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
