import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Plus, Upload, Download, Filter, User, Eye, Edit, Trash2, MoreVertical, ChevronDown, Mail, Phone, Calendar, BookOpen, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

interface Teacher {
  id: number;
  indexNumber: string;
  name: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  nationalId: string;
  address?: string;
  city?: string;
  district?: string;
  nationality?: string;
  religion?: string;
  bloodGroup?: string;
  qualification: string;
  department: string;
  specialization: string;
  employmentDate: string;
  status: string;
  subjects: string[];
  classes: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
  bankAccount?: string;
  bankName?: string;
  tinNumber?: string;
  nssfNumber?: string;
  salary?: number;
  contractType: string;
}

const teachersData: Teacher[] = [
  { 
    id: 1, 
    indexNumber: "TCH-001", 
    name: "John Mugabo", 
    gender: "Male", 
    dob: "1985-03-15", 
    email: "john.mugabo@school.com", 
    phone: "+250788123456",
    nationalId: "1199080012345678",
    address: "KG 123 St",
    city: "Kigali",
    district: "Kigali",
    nationality: "Rwandan",
    religion: "Christian",
    bloodGroup: "O+",
    qualification: "Masters in Education",
    department: "Science",
    specialization: "Mathematics",
    employmentDate: "2020-01-15",
    status: "Active",
    subjects: ["Mathematics", "Physics"],
    classes: ["Form 3", "Form 4"],
    emergencyContact: "Jane Mugabo",
    emergencyPhone: "+250732123456",
    bankAccount: "1234567890",
    bankName: "Bank of Kigali",
    tinNumber: "101234567",
    nssfNumber: "NSSF123456",
    salary: 800000,
    contractType: "Permanent"
  },
  { 
    id: 2, 
    indexNumber: "TCH-002", 
    name: "Sarah Uwimana", 
    gender: "Female", 
    dob: "1990-07-22", 
    email: "sarah.uwimana@school.com", 
    phone: "+250787234567",
    nationalId: "1199080012345679",
    address: "KN 456 Ave",
    city: "Kigali",
    district: "Kigali",
    nationality: "Rwandan",
    religion: "Muslim",
    bloodGroup: "A+",
    qualification: "Bachelors in Science",
    department: "Science",
    specialization: "Chemistry",
    employmentDate: "2021-08-01",
    status: "Active",
    subjects: ["Chemistry", "Biology"],
    classes: ["Form 2", "Form 3"],
    emergencyContact: "Peter Uwimana",
    emergencyPhone: "+250734234567",
    bankAccount: "0987654321",
    bankName: "Bank of Kigali",
    tinNumber: "101234568",
    nssfNumber: "NSSF123457",
    salary: 750000,
    contractType: "Permanent"
  },
  { 
    id: 3, 
    indexNumber: "TCH-003", 
    name: "David Habimana", 
    gender: "Male", 
    dob: "1988-11-10", 
    email: "david.habimana@school.com", 
    phone: "+250789345678",
    nationalId: "1199080012345680",
    address: "NY 789 Rd",
    city: "Kigali",
    district: "Kigali",
    nationality: "Rwandan",
    religion: "Christian",
    bloodGroup: "B+",
    qualification: "Masters in Literature",
    department: "Languages",
    specialization: "English",
    employmentDate: "2019-03-20",
    status: "Active",
    subjects: ["English", "Literature"],
    classes: ["Form 1", "Form 2"],
    emergencyContact: "Grace Habimana",
    emergencyPhone: "+250735345678",
    bankAccount: "1122334455",
    bankName: "Bank of Kigali",
    tinNumber: "101234569",
    nssfNumber: "NSSF123458",
    salary: 780000,
    contractType: "Permanent"
  },
  { 
    id: 4, 
    indexNumber: "TCH-004", 
    name: "Grace Mukamana", 
    gender: "Female", 
    dob: "1992-05-18", 
    email: "grace.mukamana@school.com", 
    phone: "+250786456789",
    nationalId: "1199080012345681",
    address: "KG 321 St",
    city: "Kigali",
    district: "Kigali",
    nationality: "Rwandan",
    religion: "Christian",
    bloodGroup: "AB+",
    qualification: "Bachelors in Arts",
    department: "Social Studies",
    specialization: "History",
    employmentDate: "2022-02-10",
    status: "Active",
    subjects: ["History", "Geography"],
    classes: ["Form 4", "Form 5"],
    emergencyContact: "Joseph Mukamana",
    emergencyPhone: "+250736456789",
    bankAccount: "2233445566",
    bankName: "Bank of Kigali",
    tinNumber: "101234570",
    nssfNumber: "NSSF123459",
    salary: 720000,
    contractType: "Permanent"
  },
];

export function AdminTeachers() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "add" | "profile" | "edit" | "assign" | "resetPassword" | "sendNotification">("list");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>("");
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  
  // Filters
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterContractType, setFilterContractType] = useState("");

  const departments = ["Science", "Languages", "Social Studies", "Mathematics", "Arts"];
  const statuses = ["Active", "Inactive", "On Leave", "Terminated"];
  const contractTypes = ["Permanent", "Contract", "Part-time"];

  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesSearch = searchTerm.trim() === "" || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.indexNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.includes(searchTerm);
    
    const matchesDepartment = filterDepartment === "" || teacher.department === filterDepartment;
    const matchesStatus = filterStatus === "" || teacher.status === filterStatus;
    const matchesContractType = filterContractType === "" || teacher.contractType === filterContractType;

    return matchesSearch && matchesDepartment && matchesStatus && matchesContractType;
  });

  const handleAddTeacher = () => {
    setViewMode("add");
    setSelectedTeacher(null);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedTeacher(null);
  };

  const handleAction = (action: string, teacher: Teacher) => {
    switch (action) {
      case "view":
        // Show teacher profile inline
        setSelectedTeacher(teacher);
        setViewMode("profile");
        break;
      case "edit":
        setSelectedTeacher(teacher);
        setViewMode("edit");
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${teacher.name}?`)) {
          // Remove teacher from data
          const index = teachersData.findIndex(t => t.id === teacher.id);
          if (index > -1) {
            teachersData.splice(index, 1);
            alert("Teacher deleted successfully!");
            // Force re-render by updating state
            setFilterDepartment(prev => prev);
          }
        }
        break;
      case "suspend":
        // Toggle teacher status
        const teacherIndex = teachersData.findIndex(t => t.id === teacher.id);
        if (teacherIndex > -1) {
          teachersData[teacherIndex].status = teacher.status === "Active" ? "Inactive" : "Active";
          alert(`Teacher ${teacher.status === "Active" ? "suspended" : "activated"} successfully!`);
          setFilterDepartment(prev => prev);
        }
        break;
      case "assign":
        // Show assign subjects/classes dialog
        const newSubjects = prompt("Enter subjects (comma separated):", teacher.subjects.join(", "));
        const newClasses = prompt("Enter classes (comma separated):", teacher.classes.join(", "));
        if (newSubjects !== null && newClasses !== null) {
          const assignIndex = teachersData.findIndex(t => t.id === teacher.id);
          if (assignIndex > -1) {
            teachersData[assignIndex].subjects = newSubjects.split(",").map(s => s.trim()).filter(s => s);
            teachersData[assignIndex].classes = newClasses.split(",").map(c => c.trim()).filter(c => c);
            alert("Subjects and classes assigned successfully!");
            setFilterDepartment(prev => prev);
          }
        }
        break;
    }
  };

  const handleTeacherRowClick = (teacher: Teacher) => {
    // Show teacher profile inline
    setSelectedTeacher(teacher);
    setViewMode("profile");
  };

  const handleConfirmAction = () => {
    if (confirmAction === "suspend" && selectedTeacher) {
      const currentStatus = selectedTeacher.status;
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const index = teachersData.findIndex(t => t.id === selectedTeacher.id);
      if (index > -1) {
        teachersData[index].status = newStatus;
        window.location.reload(); // Refresh to show updated status
      }
    } else if (confirmAction === "delete" && selectedTeacher) {
      const deleteIndex = teachersData.findIndex(t => t.id === selectedTeacher.id);
      if (deleteIndex > -1) {
        teachersData.splice(deleteIndex, 1);
        setViewMode("list");
        setSelectedTeacher(null);
      }
    }
  };

  // Listen for custom confirmation modal events
  useEffect(() => {
    const handleShowConfirmModal = (event: any) => {
      const { action, message, teacher } = event.detail;
      setSelectedTeacher(teacher);
      setConfirmAction(action);
      setConfirmMessage(message);
      setShowConfirmModal(true);
    };

    window.addEventListener('showConfirmModal', handleShowConfirmModal);
    
    return () => {
      window.removeEventListener('showConfirmModal', handleShowConfirmModal);
    };
  }, []);

  const handleImport = (file: File) => {
    // Simulate file processing
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Parse CSV or Excel (simplified for demo)
        const lines = content.split('\n').filter(line => line.trim());
        let importedCount = 0;
        
        lines.slice(1).forEach((line, index) => {
          const [name, email, phone, department] = line.split(',').map(item => item.trim().replace(/"/g, ''));
          if (name && email && phone && department) {
            const newTeacher: Teacher = {
              id: Math.max(...teachersData.map(t => t.id)) + 1 + index,
              indexNumber: `TCH-${String(Math.max(...teachersData.map(t => t.id)) + 1 + index).padStart(3, '0')}`,
              name,
              email,
              phone,
              department,
              gender: "",
              dob: "",
              nationalId: "",
              qualification: "",
              specialization: "",
              employmentDate: new Date().toISOString().split('T')[0],
              status: "Active",
              subjects: [],
              classes: [],
              contractType: "Permanent"
            };
            teachersData.push(newTeacher);
            importedCount++;
          }
        });
        
        alert(`Successfully imported ${importedCount} teachers!`);
        setShowImportModal(false);
        setFilterDepartment(prev => prev);
      } catch (error) {
        alert("Error importing file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      // Create CSV content
      const headers = ['Name', 'Email', 'Phone', 'Department', 'Status', 'Subjects', 'Classes'];
      const csvContent = [
        headers.join(','),
        ...filteredTeachers.map(teacher => [
          teacher.name,
          teacher.email,
          teacher.phone,
          teacher.department,
          teacher.status,
          teacher.subjects.join(';'),
          teacher.classes.join(';')
        ].join(','))
      ].join('\n');
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teachers_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // For PDF, just show alert (would need PDF library)
      alert("PDF export would be implemented with a PDF library like jsPDF");
    }
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Teachers</h1>
          <p className="text-gray-600 mt-2">View, add, edit, and manage all teacher information</p>
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
                  placeholder="Search by name, ID, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddTeacher}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Teacher
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Contract Type</label>
                  <select
                    value={filterContractType}
                    onChange={(e) => setFilterContractType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Contract Types</option>
                    {contractTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setFilterDepartment(""); setFilterStatus(""); setFilterContractType(""); }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{filteredTeachers.length}</p>
                    <p className="text-sm text-gray-600">Total Teachers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {teachersData.filter(t => t.status === "Active").length}
                    </p>
                    <p className="text-sm text-gray-600">Active Teachers</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                    <p className="text-sm text-gray-600">Departments</p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Phone className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(teachersData.reduce((acc, t) => acc + (t.salary || 0), 0) / 1000000)}M
                    </p>
                    <p className="text-sm text-gray-600">Total Payroll</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Teachers ({filteredTeachers.length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {filteredTeachers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTeachers.map((teacher) => (
                        <tr 
                          key={teacher.id} 
                          className="hover:bg-gray-50 cursor-pointer" 
                          onClick={() => handleTeacherRowClick(teacher)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                                {teacher.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                <div className="text-xs text-gray-500">{teacher.indexNumber}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {teacher.email}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {teacher.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.department}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.subjects.join(", ")}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.classes.join(", ")}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              teacher.status === "Active" ? "bg-green-100 text-green-800" :
                              teacher.status === "Inactive" ? "bg-gray-100 text-gray-800" :
                              teacher.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(activeDropdown === teacher.id ? null : teacher.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeDropdown === teacher.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <button
                                    onClick={() => handleAction("view", teacher)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" /> View Profile
                                  </button>
                                  <button
                                    onClick={() => handleAction("edit", teacher)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit className="h-4 w-4" /> Edit Details
                                  </button>
                                  <button
                                    onClick={() => handleAction("assign", teacher)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Assign Subjects/Classes
                                  </button>
                                  <button
                                    onClick={() => handleAction("suspend", teacher)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    {teacher.status === "Active" ? "Suspend" : "Activate"}
                                  </button>
                                  <div className="border-t border-gray-200">
                                    <button
                                      onClick={() => handleAction("delete", teacher)}
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
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-600">No Teachers Found</h3>
                  </div>
                  <p className="text-gray-500">
                    {searchTerm || filterDepartment || filterStatus || filterContractType
                      ? "No teachers match your search criteria."
                      : "No teachers have been added yet."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add/Edit Teacher Form */}
        {(viewMode === "add" || viewMode === "edit") && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teachers
            </button>
            <AddTeacherForm onBack={handleBackToList} editTeacher={selectedTeacher} />
          </div>
        )}

        {/* Teacher Profile */}
        {viewMode === "profile" && selectedTeacher && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teachers
            </button>
            <TeacherProfile teacher={selectedTeacher} onBack={handleBackToList} onEdit={() => { setViewMode("edit"); }} onAssign={() => { setViewMode("assign"); }} onResetPassword={() => { setViewMode("resetPassword"); }} onSendNotification={() => { setViewMode("sendNotification"); }} />
          </div>
        )}

        {/* Assign Classes */}
        {viewMode === "assign" && selectedTeacher && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teachers
            </button>
            <AssignClasses teacher={selectedTeacher} onBack={handleBackToList} />
          </div>
        )}

        {/* Reset Password */}
        {viewMode === "resetPassword" && selectedTeacher && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teachers
            </button>
            <ResetPassword teacher={selectedTeacher} onBack={handleBackToList} />
          </div>
        )}

        {/* Send Notification */}
        {viewMode === "sendNotification" && selectedTeacher && (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Teachers
            </button>
            <SendNotification teacher={selectedTeacher} onBack={handleBackToList} />
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-sky-50 rounded-lg p-8 w-full max-w-2xl border border-sky-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Import Teachers</h2>
              <p className="text-sm text-gray-600 mb-4">Upload a CSV or Excel file to import teacher data.</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Drag & drop your file here, or click to browse</p>
                <input 
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  className="hidden" 
                  id="importFile" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImport(file);
                    }
                  }}
                />
                <label htmlFor="importFile" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 cursor-pointer">Browse Files</label>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800"><strong>Note:</strong> Required columns: Name, Email, Phone, Department. Optional: Qualification, Address, DOB.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowImportModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={() => {
                  const fileInput = document.getElementById('importFile') as HTMLInputElement;
                  const file = fileInput.files?.[0];
                  if (file) {
                    handleImport(file);
                  } else {
                    alert("Please select a file to import.");
                  }
                }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Import</button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-sky-50 rounded-lg p-8 w-full max-w-2xl border border-sky-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Export Teacher Data</h2>
              <p className="text-sm text-gray-600 mb-4">Choose a format to export teacher data.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={() => handleExport('csv')} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-center">
                  <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">CSV</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </button>
                <button onClick={() => handleExport('pdf')} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 text-center">
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

        {/* Custom Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Confirm Action</h3>
              <p className="text-gray-600 text-center mb-6">{confirmMessage}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleConfirmAction();
                    setShowConfirmModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Add Teacher Form Component
function AddTeacherForm({ onBack, editTeacher }: { onBack: () => void; editTeacher?: Teacher | null }) {
  const isEdit = !!editTeacher;
  const [formData, setFormData] = useState({
    indexNumber: editTeacher?.indexNumber || "",
    name: editTeacher?.name || "",
    gender: editTeacher?.gender || "",
    dob: editTeacher?.dob || "",
    email: editTeacher?.email || "",
    phone: editTeacher?.phone || "",
    nationalId: editTeacher?.nationalId || "",
    address: editTeacher?.address || "",
    city: editTeacher?.city || "",
    district: editTeacher?.district || "",
    nationality: editTeacher?.nationality || "",
    religion: editTeacher?.religion || "",
    bloodGroup: editTeacher?.bloodGroup || "",
    qualification: editTeacher?.qualification || "",
    department: editTeacher?.department || "",
    specialization: editTeacher?.specialization || "",
    employmentDate: editTeacher?.employmentDate || "",
    status: editTeacher?.status || "Active",
    subjects: editTeacher?.subjects.join(", ") || "",
    classes: editTeacher?.classes.join(", ") || "",
    emergencyContact: editTeacher?.emergencyContact || "",
    emergencyPhone: editTeacher?.emergencyPhone || "",
    bankAccount: editTeacher?.bankAccount || "",
    bankName: editTeacher?.bankName || "",
    tinNumber: editTeacher?.tinNumber || "",
    nssfNumber: editTeacher?.nssfNumber || "",
    salary: editTeacher?.salary?.toString() || "",
    contractType: editTeacher?.contractType || "",
  });

  const departments = ["Science", "Languages", "Social Studies", "Mathematics", "Arts"];
  const contractTypes = ["Permanent", "Contract", "Part-time"];
  const statuses = ["Active", "Inactive", "On Leave"];

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.nationalId || 
        !formData.qualification || !formData.department || !formData.specialization || 
        !formData.employmentDate || !formData.contractType || !formData.status) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isEdit && editTeacher) {
      // Update existing teacher
      const index = teachersData.findIndex(t => t.id === editTeacher.id);
      if (index > -1) {
        teachersData[index] = {
          ...teachersData[index],
          ...formData,
          subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s),
          classes: formData.classes.split(",").map(c => c.trim()).filter(c => c),
          salary: formData.salary ? parseInt(formData.salary) : 0
        };
        alert("Teacher updated successfully!");
      }
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        id: Math.max(...teachersData.map(t => t.id)) + 1,
        ...formData,
        indexNumber: `TCH-${String(Math.max(...teachersData.map(t => t.id)) + 1).padStart(3, '0')}`,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s),
        classes: formData.classes.split(",").map(c => c.trim()).filter(c => c),
        salary: formData.salary ? parseInt(formData.salary) : 0
      };
      teachersData.push(newTeacher);
      alert("Teacher added successfully!");
    }
    
    onBack();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{isEdit ? "Edit Teacher" : "Add New Teacher"}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+250..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1199080012345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="District"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nationality"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
              <select
                value={formData.religion}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Religion</option>
                <option value="Christian">Christian</option>
                <option value="Muslim">Muslim</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddhist">Buddhist</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Masters in Education"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjects Taught</label>
            <input
              type="text"
              value={formData.subjects}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mathematics, Physics (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classes Assigned</label>
            <input
              type="text"
              value={formData.classes}
              onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Form 1, Form 2 (comma separated)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Date *</label>
              <input
                type="date"
                value={formData.employmentDate}
                onChange={(e) => setFormData({ ...formData, employmentDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type *</label>
              <select
                value={formData.contractType}
                onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                {contractTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Financial Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (RWF) *</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 800000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Bank of Kigali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bank account number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
              <input
                type="text"
                value={formData.tinNumber}
                onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tax Identification Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NSSF Number</label>
              <input
                type="text"
                value={formData.nssfNumber}
                onChange={(e) => setFormData({ ...formData, nssfNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Social Security Number"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Emergency Contact</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name of emergency contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+250..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          {isEdit ? "Update Teacher" : "Add Teacher"}
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Teacher Profile Component
function TeacherProfile({ teacher, onBack, onEdit, onAssign, onResetPassword, onSendNotification }: { 
  teacher: Teacher; 
  onBack: () => void; 
  onEdit: () => void;
  onAssign: () => void;
  onResetPassword: () => void;
  onSendNotification: () => void;
}) {
  // These functions need to be passed from parent component
  // For now, we'll use window events to communicate with parent
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "suspend":
        // Trigger custom confirmation modal
        window.dispatchEvent(new CustomEvent('showConfirmModal', {
          detail: {
            action: 'suspend',
            message: `Are you sure you want to suspend this teacher?`,
            teacher: teacher
          }
        }));
        break;
      case "assign":
        onAssign();
        break;
      case "delete":
        // Trigger custom confirmation modal
        window.dispatchEvent(new CustomEvent('showConfirmModal', {
          detail: {
            action: 'delete',
            message: `Are you sure you want to delete this teacher?`,
            teacher: teacher
          }
        }));
        break;
      case "resetPassword":
        onResetPassword();
        break;
      case "edit":
        onEdit();
        break;
      case "sendNotification":
        onSendNotification();
        break;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - Basic Info & Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                {teacher.name.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-gray-500">{teacher.indexNumber}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                teacher.status === "Active" ? "bg-green-100 text-green-800" :
                teacher.status === "Inactive" ? "bg-gray-100 text-gray-800" :
                teacher.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {teacher.status}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{teacher.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">DOB: {teacher.dob}</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={onEdit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4" />
                Edit Teacher
              </button>
              
              <button
                onClick={() => handleQuickAction("assign")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <BookOpen className="h-4 w-4" />
                Assign Classes
              </button>
              
              <button
                onClick={() => handleQuickAction("suspend")}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 ${
                  teacher.status === "Active" 
                    ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {teacher.status === "Active" ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    Suspend
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleQuickAction("resetPassword")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Mail className="h-4 w-4" />
                Reset Password
              </button>
              
              <button
                onClick={() => handleQuickAction("sendNotification")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Phone className="h-4 w-4" />
                Send Notification
              </button>
              
              <button
                onClick={() => handleQuickAction("delete")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Teacher
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{teacher.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium text-gray-900">{teacher.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-gray-900">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employment Date</p>
                <p className="font-medium text-gray-900">{teacher.employmentDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contract Type</p>
                <p className="font-medium text-gray-900">{teacher.contractType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-medium text-gray-900">RWF {teacher.salary?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Teaching Assignment */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Teaching Assignment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Subjects Taught</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Classes Assigned</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.classes.map((cls, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium text-gray-900">{teacher.gender || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-900">{teacher.dob || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">National ID</p>
                <p className="font-medium text-gray-900">{teacher.nationalId || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{teacher.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium text-gray-900">{teacher.city || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="font-medium text-gray-900">{teacher.district || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium text-gray-900">{teacher.nationality || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="font-medium text-gray-900">{teacher.religion || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium text-gray-900">{teacher.bloodGroup || "—"}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Monthly Salary</p>
                <p className="font-medium text-gray-900">RWF {teacher.salary?.toLocaleString() || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium text-gray-900">{teacher.bankName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bank Account</p>
                <p className="font-medium text-gray-900">{teacher.bankAccount || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TIN Number</p>
                <p className="font-medium text-gray-900">{teacher.tinNumber || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NSSF Number</p>
                <p className="font-medium text-gray-900">{teacher.nssfNumber || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contract Type</p>
                <p className="font-medium text-gray-900">{teacher.contractType || "—"}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact Name</p>
                <p className="font-medium text-gray-900">{teacher.emergencyContact || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Phone</p>
                <p className="font-medium text-gray-900">{teacher.emergencyPhone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{teacher.subjects.length}</p>
                <p className="text-sm text-gray-600">Subjects Teaching</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{teacher.classes.length}</p>
                <p className="text-sm text-gray-600">Classes Assigned</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor((new Date().getTime() - new Date(teacher.employmentDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                </p>
                <p className="text-sm text-gray-600">Years of Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Assign Classes Component
function AssignClasses({ teacher, onBack }: { teacher: Teacher; onBack: () => void }) {
  const [selectedSubjects, setSelectedSubjects] = useState(teacher.subjects);
  const [selectedClasses, setSelectedClasses] = useState(teacher.classes);
  
  const availableSubjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Literature", "History", "Geography"];
  const availableClasses = ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"];

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleClassToggle = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) 
        ? prev.filter(c => c !== cls)
        : [...prev, cls]
    );
  };

  const handleAssign = () => {
    if (selectedSubjects.length === 0 || selectedClasses.length === 0) {
      alert("Please select at least one subject and one class");
      return;
    }
    
    const index = teachersData.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachersData[index].subjects = selectedSubjects;
      teachersData[index].classes = selectedClasses;
      alert(`Classes assigned successfully!\n\nSubjects: ${selectedSubjects.join(", ")}\nClasses: ${selectedClasses.join(", ")}`);
      onBack();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Classes & Subjects</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {teacher.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
            <p className="text-sm text-gray-600">{teacher.indexNumber} • {teacher.department}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Select Subjects</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableSubjects.map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectToggle(subject)}
              className={`px-3 py-2 rounded text-sm ${
                selectedSubjects.includes(subject)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Select Classes</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableClasses.map((cls) => (
            <button
              key={cls}
              onClick={() => handleClassToggle(cls)}
              className={`px-3 py-2 rounded text-sm ${
                selectedClasses.includes(cls)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAssign}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm Assignment
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Reset Password Component
function ResetPassword({ teacher, onBack }: { teacher: Teacher; onBack: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState(false);

  // Add password to teacher data for demo
  const teacherWithPassword = { ...teacher, password: "teacher123" };

  const handleSaveChanges = () => {
    setErrors('');
    
    if (currentPassword !== teacherWithPassword.password) {
      setErrors("Current password is incorrect");
      return;
    }
    
    if (newPassword.length < 8) {
      setErrors("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors("New passwords do not match");
      return;
    }
    
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Changed Successfully!</h3>
        <p className="text-gray-600 mb-6">The password for {teacher.name} has been updated.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Reset Password</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {teacher.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
            <p className="text-sm text-gray-600">{teacher.indexNumber}</p>
          </div>
        </div>
      </div>

      {errors && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter current password"
          />
          <p className="text-xs text-gray-500 mt-1">Current password: {teacherWithPassword.password}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Send Notification Component
function SendNotification({ teacher, onBack }: { teacher: Teacher; onBack: () => void }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      alert("Please enter both subject and message");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-2xl">✓</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Sent!</h3>
        <p className="text-gray-600 mb-6">Your message has been sent to {teacher.name}.</p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-green-800 mb-2">Notification Details:</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>To:</strong> {teacher.name}</p>
            <p><strong>Email:</strong> {teacher.email}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong> {message}</p>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Send Notification</h3>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {teacher.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
            <p className="text-sm text-gray-600">{teacher.indexNumber}</p>
            <p className="text-sm text-gray-500">{teacher.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Type your message here..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send Notification
        </button>
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
