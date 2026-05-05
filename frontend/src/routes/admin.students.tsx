import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Upload, Download, Filter, User, Eye, Edit, Trash2, MoreVertical, ChevronDown, FileText, Mail, Phone, Shield, Key, Ban } from "lucide-react";
import { logCreateStudent, logDeleteStudent, logUpdateStudent } from "@/utils/auditLog";
import { peopleApi } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

// Removed mock import

interface Student {
  id: number;
  indexNumber: string;
  name: string;
  full_name?: string;
  student_id?: string;
  class_name?: string;
  parent_name?: string;
  parent_phone?: string;
  email: string;
  phone: string;
  class: string;
  gender: string;
  status: string;
  combination?: string;
  academicYear?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  admissionDate?: string;
  nationalId?: string;
  address?: string;
  city?: string;
  district?: string;
  nationality?: string;
  religion?: string;
  bloodGroup?: string;
  previousSchool?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianIdCard?: string;
  guardianOccupation?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  fatherIdCard?: string;
  fatherOccupation?: string;
  motherPhone?: string;
  motherEmail?: string;
  motherIdCard?: string;
  motherOccupation?: string;
  disciplineMarks?: number;
}

type ViewMode = "list" | "add" | "profile" | "editAcademic" | "editAttendance";

export function AdminStudents() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await peopleApi.getStudents();
      setStudentsData(response.data);
    } catch (error) {
      toast.error("Failed to load students from database");
    } finally {
      setIsLoading(false);
    }
  };
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filters
  const [filterClass, setFilterClass] = useState("");
  const [filterCombination, setFilterCombination] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterAcademicYear, setFilterAcademicYear] = useState("");

  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];
  const combinations = ["O Level", "PCM", "PCB", "HGL", "HGE", "EGM", "MCB", "MEC", "LKW"];
  const statuses = ["Active", "Suspended", "Graduated", "Transferred"];
  const genders = ["Male", "Female"];
  const academicYears = ["2024-2025", "2025-2026", "2026-2027"];

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === "" || student.class === filterClass;
    const matchesCombination = filterCombination === "" || student.combination === filterCombination;
    const matchesStatus = filterStatus === "" || student.status === filterStatus;
    const matchesGender = filterGender === "" || student.gender === filterGender;
    const matchesYear = filterAcademicYear === "" || student.academicYear === filterAcademicYear;
    return matchesSearch && matchesClass && matchesCombination && matchesStatus && matchesGender && matchesYear;
  });

  const handleAddStudent = () => {
    navigate({ to: "/admin/add-student" });
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setViewMode("profile");
  };

  const handleDelete = (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
      logDeleteStudent("Admin User", "admin", student.name, student.indexNumber);
      alert("Student deleted successfully");
    }
  };

  const handleToggleDropdown = (studentId: number) => {
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  const handleAction = (action: string, student: Student) => {
    setActiveDropdown(null);
    switch (action) {
      case "view":
        handleViewProfile(student);
        break;
      case "edit":
        setViewMode("add");
        setSelectedStudent(student);
        break;
      case "promote":
        alert(`Promoting ${student.name} to next class`);
        break;
      case "assign":
        alert(`Assigning ${student.name} to a class`);
        break;
      case "academic":
        alert(`Viewing academic records for ${student.name}`);
        break;
      case "attendance":
        alert(`Viewing attendance for ${student.name}`);
        break;
      case "suspend":
        alert(`${student.status === "Active" ? "Suspending" : "Activating"} ${student.name}`);
        break;
      case "delete":
        handleDelete(student);
        break;
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-600 mt-2">View, add, edit, and manage all student information</p>
        </div>

        {viewMode === "list" && (
          <>
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, ID, or parent name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddStudent}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </button>
                <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  Import
                </button>
                <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ${showFilters ? "bg-blue-50 border-blue-300" : ""}`}>
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Combination</label>
                  <select
                    value={filterCombination}
                    onChange={(e) => setFilterCombination(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Combinations</option>
                    {combinations.map((combo) => (
                      <option key={combo} value={combo}>{combo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={filterAcademicYear}
                    onChange={(e) => setFilterAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Genders</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Students Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Parent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => handleViewProfile(student)}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{student.full_name || student.name}</p>
                            <p className="text-xs text-gray-500">{student.gender || "Unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{student.student_id || student.indexNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{student.class_name || student.class}</p>
                        <p className="text-xs text-gray-500">{student.combination || "General"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{student.parent_name || student.fatherName || "N/A"}</p>
                        <p className="text-xs text-gray-500">{student.motherName || ""}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{student.parent_phone || student.phone}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "Active" ? "bg-green-100 text-green-800" :
                          student.status === "Suspended" ? "bg-red-100 text-red-800" :
                          student.status === "Graduated" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleDropdown(student.id); }}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
                          >
                            Actions <ChevronDown className="h-3 w-3" />
                          </button>
                          {activeDropdown === student.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleAction("view", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" /> View Profile
                              </button>
                              <button
                                onClick={() => handleAction("edit", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" /> Edit Details
                              </button>
                              <button
                                onClick={() => handleAction("promote", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Promote to Next Class
                              </button>
                              <button
                                onClick={() => handleAction("assign", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Assign to Class
                              </button>
                              <button
                                onClick={() => handleAction("academic", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                View Academic Records
                              </button>
                              <button
                                onClick={() => handleAction("attendance", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                View Attendance
                              </button>
                              <button
                                onClick={() => handleAction("suspend", student)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {student.status === "Active" ? "Suspend" : "Activate"}
                              </button>
                              <div className="border-t border-gray-200">
                                <button
                                  onClick={() => handleAction("delete", student)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === "add" && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Students
            </button>
            <AddStudentForm onBack={handleBackToList} editStudent={selectedStudent} />
          </div>
        )}

        {viewMode === "profile" && selectedStudent && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Students
            </button>
            <StudentProfile student={selectedStudent} onBack={handleBackToList} onEdit={() => { setViewMode("add"); }} onEditAcademic={() => { setViewMode("editAcademic"); }} onEditAttendance={() => { setViewMode("editAttendance"); }} />
          </div>
        )}

        {viewMode === "editAcademic" && selectedStudent && (
          <div>
            <button
              onClick={() => setViewMode("profile")}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Profile
            </button>
            <EditAcademicForm student={selectedStudent} onBack={() => { setViewMode("profile"); }} />
          </div>
        )}

        {viewMode === "editAttendance" && selectedStudent && (
          <div>
            <button
              onClick={() => setViewMode("profile")}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Profile
            </button>
            <EditAttendanceForm student={selectedStudent} onBack={() => { setViewMode("profile"); }} />
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-sky-50 rounded-lg p-8 w-full max-w-2xl border border-sky-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Import Students</h2>
            <p className="text-sm text-gray-600 mb-4">Upload a CSV or Excel file to import student data.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag & drop your file here, or click to browse</p>
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" id="importFile" />
              <label htmlFor="importFile" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Browse Files</label>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-yellow-800"><strong>Note:</strong> Required columns: Name, Index Number, Class, Gender. Optional: DOB, Email, Phone, Parent Name, Parent Phone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => { alert("Import feature will process your file. This is a demo."); setShowImportModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Import</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-sky-50 rounded-lg p-8 w-full max-w-2xl border border-sky-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Export Student Data</h2>
            <p className="text-sm text-gray-600 mb-4">Choose a format to export the student data.</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button onClick={() => { alert("Exporting as CSV... This is a demo."); setShowExportModal(false); }} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-center">
                <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">CSV</p>
                <p className="text-xs text-gray-500">Spreadsheet format</p>
              </button>
              <button onClick={() => { alert("Exporting as PDF... This is a demo."); setShowExportModal(false); }} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-center">
                <Download className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">PDF</p>
                <p className="text-xs text-gray-500">Printable report</p>
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ onBack, editStudent }: { onBack: () => void; editStudent?: Student | null }) {
  const isEdit = !!editStudent;
  const [formData, setFormData] = useState({
    indexNumber: editStudent?.indexNumber || "",
    name: editStudent?.name || "",
    gender: editStudent?.gender || "",
    dob: editStudent?.dob || "",
    class: editStudent?.class || "",
    combination: editStudent?.combination || "",
    admissionDate: editStudent?.admissionDate || "",
    status: editStudent?.status || "Active",
    email: editStudent?.email || "",
    phone: editStudent?.phone || "",
    nationalId: editStudent?.nationalId || "",
    address: editStudent?.address || "",
    city: editStudent?.city || "",
    district: editStudent?.district || "",
    nationality: editStudent?.nationality || "",
    religion: editStudent?.religion || "",
    bloodGroup: editStudent?.bloodGroup || "",
    previousSchool: editStudent?.previousSchool || "",
    guardianName: editStudent?.guardianName || "",
    guardianRelation: editStudent?.guardianRelation || "",
    guardianPhone: editStudent?.guardianPhone || "",
    guardianEmail: editStudent?.guardianEmail || "",
    guardianIdCard: editStudent?.guardianIdCard || "",
    guardianOccupation: editStudent?.guardianOccupation || "",
    fatherName: editStudent?.fatherName || "",
    fatherPhone: editStudent?.fatherPhone || "",
    fatherEmail: editStudent?.fatherEmail || "",
    fatherIdCard: editStudent?.fatherIdCard || "",
    fatherOccupation: editStudent?.fatherOccupation || "",
    motherName: editStudent?.motherName || "",
    motherPhone: editStudent?.motherPhone || "",
    motherEmail: editStudent?.motherEmail || "",
    motherIdCard: editStudent?.motherIdCard || "",
    motherOccupation: editStudent?.motherOccupation || "",
    academicYear: editStudent?.academicYear || "2024-2025",
  });

  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];
  const combinations = ["O Level", "PCM", "PCB", "HGL", "HGE", "EGM", "MCB", "MEC", "LKW"];
  const statuses = ["Active", "Inactive", "Graduated"];

  const handleSubmit = () => {
    if (isEdit && editStudent) {
      const oldValues = { name: editStudent.name, class: editStudent.class, combination: editStudent.combination, status: editStudent.status, email: editStudent.email, phone: editStudent.phone };
      const newValues = { name: formData.name, class: formData.class, combination: formData.combination, status: formData.status, email: formData.email, phone: formData.phone };
      logUpdateStudent("Admin User", "admin", editStudent.name, editStudent.indexNumber, oldValues, newValues);
      alert("Student updated successfully");
    } else {
      logCreateStudent("Admin User", "admin", formData.name, formData.indexNumber || "AUTO");
      alert("Student registered successfully");
    }
    onBack();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? "Edit Student" : "Add New Student"}</h2>
      
      {/* Personal Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Previous School</label>
            <input
              type="text"
              value={formData.previousSchool}
              onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Academic Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Combination *</label>
            <select
              value={formData.combination}
              onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select Combination</option>
              {combinations.map((combo) => (
                <option key={combo} value={combo}>{combo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
            <select
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date *</label>
            <input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Guardian Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Guardian Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name *</label>
            <input
              type="text"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
            <select
              value={formData.guardianRelation}
              onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select</option>
              {["Father", "Mother", "Uncle", "Aunt", "Grandparent", "Other"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone *</label>
            <input
              type="tel"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
            <input
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian ID Card</label>
            <input
              type="text"
              value={formData.guardianIdCard}
              onChange={(e) => setFormData({ ...formData, guardianIdCard: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Occupation</label>
            <input
              type="text"
              value={formData.guardianOccupation}
              onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Father Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Phone *</label>
            <input
              type="tel"
              value={formData.fatherPhone}
              onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Email</label>
            <input
              type="email"
              value={formData.fatherEmail}
              onChange={(e) => setFormData({ ...formData, fatherEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's ID Card</label>
            <input
              type="text"
              value={formData.fatherIdCard}
              onChange={(e) => setFormData({ ...formData, fatherIdCard: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
            <input
              type="text"
              value={formData.fatherOccupation}
              onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mother Info Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Mother's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
            <input
              type="text"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Phone *</label>
            <input
              type="tel"
              value={formData.motherPhone}
              onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Email</label>
            <input
              type="email"
              value={formData.motherEmail}
              onChange={(e) => setFormData({ ...formData, motherEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's ID Card</label>
            <input
              type="text"
              value={formData.motherIdCard}
              onChange={(e) => setFormData({ ...formData, motherIdCard: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
            <input
              type="text"
              value={formData.motherOccupation}
              onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEdit ? "Save Changes" : "Register Student"}
        </button>
      </div>
    </div>
  );
}

function StudentProfile({ student, onBack, onEdit, onEditAcademic, onEditAttendance }: { student: Student; onBack: () => void; onEdit: () => void; onEditAcademic: () => void; onEditAttendance: () => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-16 w-16 text-blue-600" />
              </div>
              <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-white ${
                student.status === "Active" ? "bg-green-500" : "bg-red-500"
              }`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-500 font-medium mb-4">{student.indexNumber}</p>
            <div className="flex justify-center gap-2 mb-6">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase">{student.status}</span>
               <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[10px] font-bold uppercase">{student.class}</span>
            </div>
            <div className="flex flex-col gap-3 text-left border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 text-sm">
                   <Mail className="h-4 w-4 text-gray-400" />
                   <span className="text-gray-600">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                   <Phone className="h-4 w-4 text-gray-400" />
                   <span className="text-gray-600">{student.phone}</span>
                </div>
            </div>
          </div>

          {/* Quick Control Center */}
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Control Panel
             </h3>
             <div className="space-y-3">
                <button onClick={onEdit} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 px-4 transition-colors">
                   <Edit className="h-4 w-4 text-blue-400" />
                   <span className="text-sm font-medium">Edit Details</span>
                </button>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 px-4 transition-colors">
                   <Key className="h-4 w-4 text-amber-400" />
                   <span className="text-sm font-medium">Reset Portal Key</span>
                </button>
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-3 px-4 transition-colors">
                   <Ban className="h-4 w-4 text-red-400" />
                   <span className="text-sm font-medium">Restrict Access</span>
                </button>
                <button 
                  onClick={() => alert("Report generated successfully")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-3 px-4 transition-all hover:scale-105"
                >
                   <FileText className="h-4 w-4 text-white" />
                   <span className="text-sm font-medium">Generate Report Card</span>
                </button>
             </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">Biographical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                    <p className="text-gray-900 font-semibold">{student.gender}</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                    <p className="text-gray-900 font-semibold">{student.dob}</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Combination</p>
                    <p className="text-gray-900 font-semibold">{student.combination}</p>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Academic Year</p>
                    <p className="text-gray-900 font-semibold">{student.academicYear}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Guardian & Family</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Primary Guardian</p>
                    <p className="text-sm font-bold text-gray-900">{student.guardianName}</p>
                    <p className="text-xs text-gray-500">{student.guardianRelation} · {student.guardianPhone}</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Father</p>
                    <p className="text-sm font-bold text-gray-900">{student.fatherName || "N/A"}</p>
                    <p className="text-xs text-gray-500">{student.fatherPhone || ""}</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">Mother</p>
                    <p className="text-sm font-bold text-gray-900">{student.motherName || "N/A"}</p>
                    <p className="text-xs text-gray-500">{student.motherPhone || ""}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                 Performance Quick Stats
                 <button onClick={onEditAcademic} className="text-xs font-bold text-blue-600 hover:underline">Full Transcript</button>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                    { label: "Attendance", value: "94%" },
                    { label: "Conduct", value: "Excellent" },
                    { label: "GPA", value: "3.8" },
                    { label: "Rank", value: "4 / 42" },
                 ].map(stat => (
                    <div key={stat.label} className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{stat.label}</p>
                       <p className="text-lg font-bold text-blue-700">{stat.value}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}



function EditAcademicForm({ student, onBack }: { student: Student; onBack: () => void }) {
  const [formData, setFormData] = useState({
    class: student.class,
    combination: student.combination,
    academicYear: student.academicYear,
    admissionDate: student.admissionDate,
    status: student.status,
    disciplineMarks: student.disciplineMarks.toString(),
  });

  const classes = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];
  const combinations = ["O Level", "PCM", "PCB", "HGL", "HGE", "EGM", "MCB", "MEC", "LKW"];
  const statuses = ["Active", "Inactive", "Graduated", "Suspended", "Transferred"];

  const handleSave = () => {
    logUpdateStudent("Admin User", "admin", student.name, student.indexNumber,
      { class: student.class, combination: student.combination, academicYear: student.academicYear, status: student.status },
      { class: formData.class, combination: formData.combination, academicYear: formData.academicYear, status: formData.status }
    );
    alert("Academic information updated successfully");
    onBack();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Academic Information</h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800"><strong>Student:</strong> {student.name} ({student.indexNumber})</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
          <select
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Combination *</label>
          <select
            value={formData.combination}
            onChange={(e) => setFormData({ ...formData, combination: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {combinations.map((combo) => (
              <option key={combo} value={combo}>{combo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
          <select
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2026-2027">2026-2027</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
          <input
            type="date"
            value={formData.admissionDate}
            onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discipline Marks</label>
          <input
            type="number"
            min="0"
            max="40"
            value={formData.disciplineMarks}
            onChange={(e) => setFormData({ ...formData, disciplineMarks: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}

function EditAttendanceForm({ student, onBack }: { student: Student; onBack: () => void }) {
  const [attendanceRecords, setAttendanceRecords] = useState([
    { date: "2025-01-15", status: "Present", remark: "" },
    { date: "2025-01-16", status: "Present", remark: "" },
    { date: "2025-01-17", status: "Absent", remark: "Sick leave" },
    { date: "2025-01-20", status: "Present", remark: "" },
    { date: "2025-01-21", status: "Late", remark: "Bus delay" },
    { date: "2025-01-22", status: "Present", remark: "" },
    { date: "2025-01-23", status: "Present", remark: "" },
    { date: "2025-01-24", status: "Absent", remark: "Family emergency" },
    { date: "2025-02-03", status: "Present", remark: "" },
    { date: "2025-02-04", status: "Present", remark: "" },
    { date: "2025-02-05", status: "Late", remark: "Traffic" },
    { date: "2025-02-10", status: "Absent", remark: "Doctor appointment" },
    { date: "2025-03-05", status: "Present", remark: "" },
    { date: "2025-03-06", status: "Present", remark: "" },
    { date: "2025-03-07", status: "Excused", remark: "School event" },
    { date: "2025-03-10", status: "Present", remark: "" },
    { date: "2025-04-01", status: "Present", remark: "" },
    { date: "2025-04-02", status: "Absent", remark: "Family matter" },
  ]);

  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const months = [
    { value: "01", label: "January" }, { value: "02", label: "February" },
    { value: "03", label: "March" }, { value: "04", label: "April" },
    { value: "05", label: "May" }, { value: "06", label: "June" },
    { value: "07", label: "July" }, { value: "08", label: "August" },
    { value: "09", label: "September" }, { value: "10", label: "October" },
    { value: "11", label: "November" }, { value: "12", label: "December" },
  ];

  const years = [...new Set(attendanceRecords.map(r => r.date.substring(0, 4)))].sort();

  const filteredRecords = attendanceRecords
    .filter((r) => {
      const recordMonth = r.date.substring(5, 7);
      const recordYear = r.date.substring(0, 4);
      const matchMonth = filterMonth === "all" || recordMonth === filterMonth;
      const matchYear = filterYear === "all" || recordYear === filterYear;
      return matchMonth && matchYear;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleStatusChange = (index: number, value: string) => {
    const updated = [...attendanceRecords];
    updated[index] = { ...updated[index], status: value };
    setAttendanceRecords(updated);
  };

  const handleRemarkChange = (index: number, value: string) => {
    const updated = [...attendanceRecords];
    updated[index] = { ...updated[index], remark: value };
    setAttendanceRecords(updated);
  };

  const handleSave = () => {
    logUpdateStudent("Admin User", "admin", student.name, student.indexNumber,
      { attendance: "previous" },
      { attendance: "updated" }
    );
    alert("Attendance records updated successfully");
    onBack();
  };

  const presentCount = filteredRecords.filter(r => r.status === "Present").length;
  const absentCount = filteredRecords.filter(r => r.status === "Absent").length;
  const lateCount = filteredRecords.filter(r => r.status === "Late").length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Attendance Records</h2>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800"><strong>Student:</strong> {student.name} ({student.indexNumber}) — {student.class}</p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="all">All Months</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Year</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort by Date</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => { setFilterMonth("all"); setFilterYear("all"); setSortOrder("newest"); }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{presentCount}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{absentCount}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{lateCount}</p>
          <p className="text-xs text-yellow-600">Late</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.map((record) => {
              const originalIndex = attendanceRecords.findIndex(r => r.date === record.date);
              return (
              <tr key={record.date} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                <td className="px-4 py-3">
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusChange(originalIndex, e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Excused">Excused</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={record.remark}
                    onChange={(e) => handleRemarkChange(originalIndex, e.target.value)}
                    placeholder="Add remark..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}
