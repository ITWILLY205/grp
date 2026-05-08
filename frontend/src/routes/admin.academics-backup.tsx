import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Users, BookOpen, GraduationCap, Clock, Settings, ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/academics-backup")({
  component: AdminAcademics,
});

function AdminAcademics() {
  const [activeTab, setActiveTab] = useState("academic-years");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Navigation handlers
  const handleAddAcademicYear = () => {
    alert("Navigate to Add Academic Year form");
  };

  const handleAddClass = () => {
    alert("Navigate to Add Class form");
  };

  const handleAddSubject = () => {
    alert("Navigate to Add Subject form");
  };

  const handleAddGradeScale = () => {
    alert("Navigate to Add Grade Scale form");
  };

  const handleScheduleExam = () => {
    alert("Navigate to Schedule Exam form");
  };

  const handleGenerateTimetable = () => {
    alert("Navigate to Generate Timetable form");
  };

  const handleEdit = (type: string, id: number) => {
    alert(`Edit ${type} with ID: ${id}`);
  };

  const handleDelete = (type: string, id: number) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      alert(`Delete ${type} with ID: ${id}`);
    }
  };

  const handleViewDetails = (type: string, id: number) => {
    alert(`View details for ${type} with ID: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-3 py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Management</h2>
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2 px-4" aria-label="Tabs">
              {[
                { id: "academic-years", label: "Academic Years & Terms", icon: Calendar },
                { id: "classes", label: "Classes & Sections", icon: Users },
                { id: "subjects", label: "Subjects Management", icon: BookOpen },
                { id: "grading", label: "Grading System", icon: GraduationCap },
                { id: "exams", label: "Exam Management", icon: Clock },
                { id: "timetable", label: "Timetable", icon: Clock },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 py-2 px-3 border-b-2 font-medium text-xs whitespace-nowrap rounded-t-lg ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {activeTab === "academic-years" && <AcademicYearsSection 
            onAddAcademicYear={handleAddAcademicYear}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "classes" && <ClassesSectionsSection 
            onAddClass={handleAddClass}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "subjects" && <SubjectsManagementSection 
            onAddSubject={handleAddSubject}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "grading" && <GradingSystemSection 
            onAddGradeScale={handleAddGradeScale}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "exams" && <ExamManagementSection 
            onScheduleExam={handleScheduleExam}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "timetable" && <TimetableSection 
            onGenerateTimetable={handleGenerateTimetable}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />}
          {activeTab === "settings" && <SettingsSection />}
        </div>
      </div>
    </div>
  );
}

// Academic Years & Terms Section
function AcademicYearsSection({ onAddAcademicYear, onEdit, onDelete, onViewDetails }: {
  onAddAcademicYear: () => void;
  onEdit: (type: string, id: number) => void;
  onDelete: (type: string, id: number) => void;
  onViewDetails: (type: string, id: number) => void;
}) {
  const [academicYears, setAcademicYears] = useState([
    { id: 1, name: "2024-2025", startDate: "2024-09-01", endDate: "2025-07-31", isActive: true },
    { id: 2, name: "2025-2026", startDate: "2025-09-01", endDate: "2026-07-31", isActive: false },
  ]);

  const [terms, setTerms] = useState([
    { id: 1, academicYearId: 1, name: "Term 1", startDate: "2024-09-01", endDate: "2024-12-15" },
    { id: 2, academicYearId: 1, name: "Term 2", startDate: "2025-01-05", endDate: "2025-04-15" },
    { id: 3, academicYearId: 1, name: "Term 3", startDate: "2025-04-22", endDate: "2025-07-31" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Academic Years & Terms</h3>
        <button onClick={onAddAcademicYear} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-3 w-3" /> Add Academic Year
        </button>
      </div>

      {/* Academic Years */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Academic Years</h4>
        <div className="grid gap-4">
          {academicYears.map((year) => (
            <div key={year.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{year.name}</h5>
                  <p className="text-sm text-gray-600">{year.startDate} to {year.endDate}</p>
                  {year.isActive && <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit("academic year", year.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button onClick={() => onDelete("academic year", year.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Terms/Semesters</h4>
        <div className="grid gap-4">
          {terms.map((term) => (
            <div key={term.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{term.name}</h5>
                  <p className="text-sm text-gray-600">{term.startDate} to {term.endDate}</p>
                  <p className="text-xs text-gray-500 mt-1">Academic Year: {academicYears.find(y => y.id === term.academicYearId)?.name}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit("term", term.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button onClick={() => onDelete("term", term.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Classes & Sections Section
function ClassesSectionsSection({ onAddClass, onEdit, onDelete, onViewDetails }: {
  onAddClass: () => void;
  onEdit: (type: string, id: number) => void;
  onDelete: (type: string, id: number) => void;
  onViewDetails: (type: string, id: number) => void;
}) {
  const [classes, setClasses] = useState([
    { id: 1, name: "Grade 1", order: 1, sections: ["A", "B", "C"] },
    { id: 2, name: "Grade 2", order: 2, sections: ["A", "B"] },
    { id: 3, name: "Class 9", order: 3, sections: ["Science", "Commerce", "Arts"] },
    { id: 4, name: "Class 10", order: 4, sections: ["Science", "Commerce"] },
  ]);

  const [sectionCapacity, setSectionCapacity] = useState([
    { classId: 1, section: "A", capacity: 30 },
    { classId: 1, section: "B", capacity: 30 },
    { classId: 1, section: "C", capacity: 25 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Classes & Sections</h3>
        <button onClick={onAddClass} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm">
          <Plus className="h-3 w-3" /> Add Class
        </button>
      </div>

      {/* Classes */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Class Management</h4>
        <div className="grid gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium">{cls.name}</h5>
                  <p className="text-sm text-gray-600">Order: {cls.order}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {cls.sections.map((section) => (
                      <span key={section} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Section {section}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Capacity */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Section Capacity</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sectionCapacity.map((cap) => (
                <tr key={`${cap.classId}-${cap.section}`}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {classes.find(c => c.id === cap.classId)?.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{cap.section}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{cap.capacity}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex gap-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Subjects Management Section
function SubjectsManagementSection() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", code: "MATH101", type: "Compulsory", maxMarks: 100, passingMarks: 40 },
    { id: 2, name: "English", code: "ENG101", type: "Compulsory", maxMarks: 100, passingMarks: 40 },
    { id: 3, name: "Physics", code: "PHY201", type: "Theory", maxMarks: 100, passingMarks: 40 },
    { id: 4, name: "Chemistry Lab", code: "CHMLAB", type: "Practical", maxMarks: 50, passingMarks: 20 },
    { id: 5, name: "Computer Science", code: "CS301", type: "Elective", maxMarks: 100, passingMarks: 40 },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, subjectId: 1, classId: 3, section: "Science", teacherId: 1 },
    { id: 2, subjectId: 2, classId: 3, section: "Science", teacherId: 2 },
    { id: 3, subjectId: 3, classId: 3, section: "Science", teacherId: 3 },
  ]);

  const teachers = ["Dr. Smith", "Ms. Johnson", "Mr. Brown"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Subjects Management</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      {/* Subject List */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Subject List</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passing Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subject.type === "Compulsory" ? "bg-red-100 text-red-800" :
                      subject.type === "Elective" ? "bg-blue-100 text-blue-800" :
                      subject.type === "Theory" ? "bg-green-100 text-green-800" :
                      "bg-purple-100 text-purple-800"
                    }`}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.maxMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.passingMarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Assignments */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Subject Assignments</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subjects.find(s => s.id === assignment.subjectId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Class {assignment.classId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher, idx) => (
                        <option key={idx} value={idx + 1}>{teacher}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Grading System Section
function GradingSystemSection() {
  const [gradeScales, setGradeScales] = useState([
    { grade: "A+", minPercentage: 90, maxPercentage: 100, gradePoints: 4.0, remarks: "Outstanding" },
    { grade: "A", minPercentage: 80, maxPercentage: 89, gradePoints: 3.7, remarks: "Excellent" },
    { grade: "B+", minPercentage: 70, maxPercentage: 79, gradePoints: 3.3, remarks: "Very Good" },
    { grade: "B", minPercentage: 60, maxPercentage: 69, gradePoints: 3.0, remarks: "Good" },
    { grade: "C", minPercentage: 50, maxPercentage: 59, gradePoints: 2.0, remarks: "Satisfactory" },
    { grade: "D", minPercentage: 40, maxPercentage: 49, gradePoints: 1.0, remarks: "Needs Improvement" },
    { grade: "F", minPercentage: 0, maxPercentage: 39, gradePoints: 0.0, remarks: "Fail" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Grading System</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Grade Scale
        </button>
      </div>

      {/* Grade Scales */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Grade Scales</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gradeScales.map((scale) => (
                <tr key={scale.grade}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{scale.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scale.minPercentage}% - {scale.maxPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scale.gradePoints}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scale.remarks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Rules */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Grading Rules</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grading System Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Percentage System</option>
                <option>CGPA System</option>
                <option>GPA System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Criteria</label>
              <input type="number" placeholder="Minimum passing percentage" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exam Management Section
function ExamManagementSection() {
  const [examTypes, setExamTypes] = useState([
    { id: 1, name: "Mid-term Examination", weightage: 30 },
    { id: 2, name: "Final Examination", weightage: 50 },
    { id: 3, name: "Unit Test", weightage: 10 },
    { id: 4, name: "Quiz", weightage: 10 },
  ]);

  const [examSchedules, setExamSchedules] = useState([
    { id: 1, examType: "Mid-term", subject: "Mathematics", class: "Class 9", section: "Science", date: "2024-10-15", time: "09:00 AM", room: "Room 101" },
    { id: 2, examType: "Final", subject: "English", class: "Class 9", section: "Science", date: "2024-12-20", time: "10:00 AM", room: "Room 102" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Exam Management</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Schedule Exam
        </button>
      </div>

      {/* Exam Types */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Exam Types</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weightage (%)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examTypes.map((type) => (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.weightage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Schedules */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Exam Schedules</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {examSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.examType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.room}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Timetable Section
function TimetableSection() {
  const [periods, setPeriods] = useState([
    { id: 1, startTime: "08:00", endTime: "08:45", name: "Period 1" },
    { id: 2, startTime: "08:45", endTime: "09:30", name: "Period 2" },
    { id: 3, startTime: "09:45", endTime: "10:30", name: "Period 3" },
    { id: 4, startTime: "10:30", endTime: "11:15", name: "Period 4" },
    { id: 5, startTime: "11:30", endTime: "12:15", name: "Period 5" },
    { id: 6, startTime: "12:15", endTime: "01:00", name: "Period 6" },
  ]);

  const [workingDays, setWorkingDays] = useState([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Timetable Configuration</h3>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Generate Timetable
        </button>
      </div>

      {/* Period Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Period/Slot Settings</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {periods.map((period) => (
                <tr key={period.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{period.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{period.endTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Working Days */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Working Days Configuration</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workingDays.includes(day)}
                  className="rounded border-gray-300"
                  readOnly
                />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Academic Settings</h3>

      <div className="space-y-6">
        {/* Promotion Rules */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Promotion/Demotion Rules</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Passing Percentage for Promotion</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Failed Subjects Allowed</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Requirement (%)</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="75" />
            </div>
          </div>
        </div>

        {/* Subject Combination Rules */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Subject Combination Rules</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option>Class 9-10 (O-Level)</option>
                <option>Class 11-12 (A-Level)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compulsory Subjects</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-gray-300" />
                  <span className="text-sm">Mathematics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-gray-300" />
                  <span className="text-sm">English</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="rounded border-gray-300" />
                  <span className="text-sm">Science</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Elective Subjects (Select Minimum)</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2" />
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Other Academic Settings</h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Students per Section</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Marks Policy</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAcademics;
