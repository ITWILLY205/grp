import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Lock, Unlock, AlertCircle, CheckCircle, Users, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/term-management")({
  component: TermManagement,
});

interface Term {
  id: string;
  name: string;
  status: "active" | "finished" | "upcoming";
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  activeCourses: number;
  marksEntryAllowed: boolean;
}

function TermManagement() {
  const [terms, setTerms] = useState<Term[]>([
    {
      id: "1",
      name: "Term 1 2024",
      status: "finished",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      enrolledStudents: 245,
      activeCourses: 12,
      marksEntryAllowed: false
    },
    {
      id: "2", 
      name: "Term 2 2024",
      status: "active",
      startDate: "2024-05-01",
      endDate: "2024-08-31",
      enrolledStudents: 252,
      activeCourses: 14,
      marksEntryAllowed: true
    },
    {
      id: "3",
      name: "Term 3 2024",
      status: "upcoming",
      startDate: "2024-09-01",
      endDate: "2024-12-15",
      enrolledStudents: 0,
      activeCourses: 0,
      marksEntryAllowed: false
    }
  ]);

  const handleFinishTerm = (termId: string) => {
    if (window.confirm("Are you sure you want to finish this term? Teachers will no longer be able to enter marks for this term.")) {
      setTerms(terms.map(term => 
        term.id === termId 
          ? { ...term, status: "finished" as const, marksEntryAllowed: false }
          : term
      ));
      alert("Term finished successfully! Teacher access to marks entry has been revoked.");
    }
  };

  const handleActivateTerm = (termId: string) => {
    setTerms(terms.map(term => 
      term.id === termId 
        ? { ...term, status: "active" as const, marksEntryAllowed: true }
        : term
    ));
    alert("Term activated successfully!");
  };

  const handleToggleMarksAccess = (termId: string) => {
    setTerms(terms.map(term => 
      term.id === termId 
        ? { ...term, marksEntryAllowed: !term.marksEntryAllowed }
        : term
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-6xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Term Management</h2>
        
        {/* Term Access Rules */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Term Access Rules</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Teachers can enter marks for active terms</li>
                <li>• By default, finishing a term locks mark entry, but admins can re-enable it</li>
                <li>• Administrators can toggle mark entry access for ANY term (Finished or Active)</li>
                <li>• This allows teachers to still have access to edit marks in Term 1 if authorized</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {terms.map((term) => (
            <div key={term.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Term Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{term.name}</h3>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  term.status === "active" 
                    ? "bg-green-100 text-green-800"
                    : term.status === "finished"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {term.status}
                </div>
              </div>

              {/* Term Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900">{term.startDate} - {term.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="text-gray-900">{term.enrolledStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Courses:</span>
                  <span className="text-gray-900">{term.activeCourses}</span>
                </div>
              </div>

              {/* Access Status */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {term.marksEntryAllowed ? (
                      <Unlock className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {term.marksEntryAllowed ? "Marks Entry Allowed" : "Marks Entry Locked"}
                    </span>
                  </div>
                </div>

                {/* Access Details */}
                <div className="text-xs text-gray-600 mb-4">
                  {term.status === "finished" ? (
                    <div className="space-y-1">
                      <p>• Teachers: No access to marks entry</p>
                      <p>• Teachers: No access to view data</p>
                      <p>• Admin: Full access to all data</p>
                    </div>
                  ) : term.marksEntryAllowed ? (
                    <div className="space-y-1">
                      <p>• Teachers: Can enter marks</p>
                      <p>• Teachers: Can view term data</p>
                      <p>• Admin: Full access to all data</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p>• Teachers: Cannot enter marks</p>
                      <p>• Teachers: Can view term data</p>
                      <p>• Admin: Full access to all data</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {term.status === "active" && (
                    <>
                      <button
                        onClick={() => handleToggleMarksAccess(term.id)}
                        className={`w-full px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          term.marksEntryAllowed
                            ? "bg-white text-red-600 border-red-600 hover:bg-red-50"
                            : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                        }`}
                      >
                        {term.marksEntryAllowed ? "Lock Marks Entry" : "Allow Marks Entry"}
                      </button>
                      <button
                        onClick={() => handleFinishTerm(term.id)}
                        className="w-full bg-white text-red-600 border-2 border-red-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50 transition-colors"
                      >
                        Finish Term
                      </button>
                    </>
                  )}
                  {term.status === "upcoming" && (
                    <button
                      onClick={() => handleActivateTerm(term.id)}
                      className="w-full bg-white text-green-600 border-2 border-green-600 rounded-lg px-3 py-2 text-sm font-medium hover:bg-green-50 transition-colors"
                    >
                      Activate Term
                    </button>
                  )}
                  {term.status === "finished" && (
                    <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
                      Term finished - Admin only access
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Terms</p>
                <p className="text-xl font-bold text-gray-900">
                  {terms.filter(t => t.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Finished Terms</p>
                <p className="text-xl font-bold text-gray-900">
                  {terms.filter(t => t.status === "finished").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-2">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Terms</p>
                <p className="text-xl font-bold text-gray-900">
                  {terms.filter(t => t.status === "upcoming").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-bold text-gray-900">
                  {terms.reduce((sum, term) => sum + term.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermManagement;
