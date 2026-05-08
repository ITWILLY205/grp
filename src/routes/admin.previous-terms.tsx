import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Users, BookOpen, FileText, Download, Eye, Lock, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/previous-terms")({
  component: PreviousTerms,
});

interface PreviousTerm {
  id: string;
  name: string;
  year: string;
  status: "finished";
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  totalCourses: number;
  averageGrade: string;
  completionRate: string;
  archivedDate: string;
}

function PreviousTerms() {
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const previousTerms: PreviousTerm[] = [
    {
      id: "1",
      name: "Term 1",
      year: "2024",
      status: "finished",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      enrolledStudents: 245,
      totalCourses: 12,
      averageGrade: "B+",
      completionRate: "92%",
      archivedDate: "2024-04-20"
    },
    {
      id: "2",
      name: "Term 3",
      year: "2023",
      status: "finished",
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      enrolledStudents: 238,
      totalCourses: 11,
      averageGrade: "B",
      completionRate: "89%",
      archivedDate: "2023-12-20"
    },
    {
      id: "3",
      name: "Term 2",
      year: "2023",
      status: "finished",
      startDate: "2023-05-01",
      endDate: "2023-08-31",
      enrolledStudents: 242,
      totalCourses: 13,
      averageGrade: "B+",
      completionRate: "94%",
      archivedDate: "2023-09-05"
    },
    {
      id: "4",
      name: "Term 1",
      year: "2023",
      status: "finished",
      startDate: "2023-01-16",
      endDate: "2023-04-14",
      enrolledStudents: 230,
      totalCourses: 10,
      averageGrade: "B-",
      completionRate: "87%",
      archivedDate: "2023-04-19"
    },
    {
      id: "5",
      name: "Term 3",
      year: "2022",
      status: "finished",
      startDate: "2022-09-05",
      endDate: "2022-12-16",
      enrolledStudents: 225,
      totalCourses: 9,
      averageGrade: "B",
      completionRate: "91%",
      archivedDate: "2022-12-21"
    }
  ];

  const filteredTerms = previousTerms.filter(term => 
    term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.year.includes(searchTerm)
  );

  const selectedTermData = previousTerms.find(term => term.id === selectedTerm);

  const handleViewDetails = (termId: string) => {
    setSelectedTerm(termId);
  };

  const handleDownloadReport = (termId: string) => {
    const term = previousTerms.find(t => t.id === termId);
    alert(`Downloading report for ${term?.name} ${term?.year}...`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Previous Terms</h2>
        
        {/* Access Control Notice */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Access Information</h3>
              <p className="text-sm text-blue-800">
                Previous terms are archived and read-only. Teachers cannot access or modify finished term data. Only administrators can view previous term information.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search terms by name or year..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Previous Terms List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Archived Terms</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredTerms.map((term) => (
                  <div key={term.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{term.name} {term.year}</h4>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Finished
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{term.startDate} - {term.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{term.enrolledStudents} students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{term.totalCourses} courses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Avg: {term.averageGrade}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Lock className="h-4 w-4" />
                          <span>Archived on {term.archivedDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(term.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(term.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Term Details */}
          <div className="lg:col-span-1">
            {selectedTermData ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Term Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedTermData.name} {selectedTermData.year}
                    </h4>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      {selectedTermData.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{selectedTermData.startDate} - {selectedTermData.endDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="text-gray-900">{selectedTermData.enrolledStudents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Courses:</span>
                      <span className="text-gray-900">{selectedTermData.totalCourses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Grade:</span>
                      <span className="text-gray-900">{selectedTermData.averageGrade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion Rate:</span>
                      <span className="text-gray-900">{selectedTermData.completionRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Archived Date:</span>
                      <span className="text-gray-900">{selectedTermData.archivedDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Access Status</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-gray-700">Admin: Full access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-red-600" />
                        <span className="text-gray-700">Teachers: No access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-3 w-3 text-red-600" />
                        <span className="text-gray-700">Students: No access</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Available Actions</h5>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDownloadReport(selectedTermData.id)}
                        className="w-full bg-white text-green-600 border-2 border-green-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Full Report
                      </button>
                      <button className="w-full bg-white text-blue-600 border-2 border-blue-600 rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4" />
                        Export Summary
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Select a term to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Previous Terms</p>
                <p className="text-xl font-bold text-gray-900">{previousTerms.length}</p>
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
                  {previousTerms.reduce((sum, term) => sum + term.enrolledStudents, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-xl font-bold text-gray-900">
                  {previousTerms.reduce((sum, term) => sum + term.totalCourses, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-xl font-bold text-gray-900">91%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviousTerms;
