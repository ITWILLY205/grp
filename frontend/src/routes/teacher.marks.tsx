import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { useState } from "react";
import { Save, Search, Calendar, GraduationCap, FileText, Calculator, Play, BookOpen } from "lucide-react";
import { getTeacherSubjects } from "@/lib/teacherStore";
import { getActiveTerm } from "@/lib/termStore";
import { logMarksEntry, logMarksUpdate, getLogsByModule } from "@/utils/auditLog";
import { academicApi, peopleApi, recordApi } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/teacher/marks")({
  component: TeacherMarks,
});

// Cleared mock records
const classStudents: any = {};

const testTypes = ["Test", "Quiz", "Exam", "Assignment", "Practical", "Project"];
const teacherSubjects = getTeacherSubjects();

function TeacherMarks() {
  const activeTerm = getActiveTerm();
  const selectedTerm = activeTerm.name;
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [maxScore, setMaxScore] = useState<number>(100);
  const [studentMarks, setStudentMarks] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [saved, setSaved] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await academicApi.getClasses();
      setClassesList(response.data);
    } catch (error) {
      toast.error("Failed to load classes");
    }
  };

  const fetchStudentsByClass = async (className: string) => {
    try {
      const response = await peopleApi.getStudents();
      // Filter by class name
      const filtered = response.data.filter((s: any) => (s.class_name || s.class) === className);
      setStudents(filtered);
    } catch (error) {
      toast.error("Failed to load students for this class");
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);

  const filteredStudents = students.filter((s) =>
    (s.full_name || s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkChange = (studentId: number, value: string) => {
    const mark = value === "" ? 0 : Math.min(parseFloat(value) || 0, maxScore);
    setStudentMarks((prev) => ({ ...prev, [studentId]: mark }));
    setSaved(false);
  };

  const getPercentage = (mark: number) => {
    if (maxScore <= 0) return 0;
    return Math.round((mark / maxScore) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-50";
      case "B": return "text-blue-600 bg-blue-50";
      case "C": return "text-yellow-600 bg-yellow-50";
      case "D": return "text-orange-600 bg-orange-50";
      default: return "text-red-600 bg-red-50";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create entries for each mark entered
      // Map subject name to an ID matching our seeded database
      const subjectMap: Record<string, number> = {
        "Mathematics": 1,
        "Physics": 2,
        "Chemistry": 3
      };
      
      const savePromises = Object.entries(studentMarks).map(([studentId, marks]) => {
        return recordApi.saveMarks({
          student_id: parseInt(studentId),
          subject_id: subjectMap[selectedSubject] || 1,
          term_id: 1, // Matches 'Term 1' seeded in db
          cat_score: selectedType !== 'Exam' ? marks : null,
          exam_score: selectedType === 'Exam' ? marks : null,
          grade: getGrade(getPercentage(marks))
        });
      });

      await Promise.all(savePromises);
      toast.success("All marks saved successfully to database!");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error("Failed to save some marks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGo = () => {
    if (selectedClass !== "" && selectedDate !== "" && selectedType !== "" && selectedSubject !== "" && maxScore > 0) {
      setShowStudents(true);
      
      // Load existing marks from audit logs for this specific combination
      const academicLogs = getLogsByModule("ACADEMICS");
      const existingMarks: Record<number, number> = {};
      
      // Filter logs for this subject, term, and type
      // Note: In this mock, we assume logs are the source of truth
      academicLogs.forEach(log => {
        const details = log.details;
        if (
          details?.subject === selectedSubject &&
          details?.term === selectedTerm &&
          details?.type === selectedType
        ) {
          // Find student ID by name in current class list
          const student = students.find(s => (s.full_name || s.name) === details.studentName);
          if (student) {
            existingMarks[student.id] = details.marks;
          }
        }
      });

      setStudentMarks(existingMarks);
      setSaved(false);
    }
  };

  const allFieldsSelected = selectedClass !== "" && selectedDate !== "" && selectedType !== "" && selectedSubject !== "" && maxScore > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        <PageHeader
          title="Marks Entry"
          description="Select class, date, test type and enter student marks"
        />

        {/* Selection Panel - Only show when Start hasn't been clicked */}
        {!showStudents && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Active Term indicator */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Active Term
                </label>
                <div className="w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700">
                  {selectedTerm}
                </div>
              </div>

              {/* Class Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudentMarks({});
                    setSaved(false);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Class --</option>
                  {classesList.map((cls) => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>

              {/* Subject - Only teacher's assigned subjects */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4" />
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Subject --</option>
                  {teacherSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Test Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Test Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Type --</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Maximum Score */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calculator className="w-4 h-4" />
                  Maximum Marks
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={maxScore}
                  onChange={(e) => {
                    setMaxScore(parseInt(e.target.value) || 100);
                    setStudentMarks({});
                    setSaved(false);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Details Header - Only show when Start has been clicked */}
        {showStudents && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 w-full max-w-md">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <Calendar className="w-4 h-4" />
                  Term: {selectedTerm}
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <GraduationCap className="w-4 h-4" />
                  Class: {selectedClass}
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <BookOpen className="w-4 h-4" />
                  Subject: {selectedSubject}
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <FileText className="w-4 h-4" />
                  Type: {selectedType}
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <Calendar className="w-4 h-4" />
                  Date: {selectedDate}
                </span>
                <span className="flex items-center gap-1 text-sm text-blue-700">
                  <Calculator className="w-4 h-4" />
                  Max Score: {maxScore} marks
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        {allFieldsSelected && !showStudents && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGo}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-md"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          </div>
        )}

        {/* Students Table */}
        {allFieldsSelected && showStudents && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {saved && (
              <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
                Marks saved successfully!
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Marks Obtained
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const mark = studentMarks[student.id] || 0;
                    const percentage = getPercentage(mark);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {student.student_id || `#${student.id.toString().padStart(3, "0")}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {student.full_name || student.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={maxScore}
                            value={mark || ""}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            placeholder={`0-${maxScore}`}
                            className="w-24 text-center rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No students found matching your search.</p>
              </div>
            )}

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Marks
              </button>
            </div>
          </div>
        )}

        {!allFieldsSelected && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm">
              Please select all fields above (Class, Subject, Date, Test Type, and Maximum Marks) and click "Start" to view students.
            </p>
          </div>
        )}

        {allFieldsSelected && !showStudents && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm">
              All fields selected. Click the "Start" button to proceed with marks entry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
