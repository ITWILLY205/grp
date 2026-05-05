import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, Calendar, BookOpen, Edit, Trash2, User, Shield, DollarSign, MapPin, AlertCircle } from "lucide-react";

// Import the same teachers data
const teachersData = [
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

export const Route = createFileRoute("/admin/teacher-info")({
  component: TeacherInfoPage,
});

function TeacherInfoPage() {
  const navigate = useNavigate();
  
  // Get teacher ID from URL
  const urlParts = window.location.pathname.split('/');
  const teacherId = parseInt(urlParts[urlParts.length - 1]) || 1;
  
  const teacher = teachersData.find(t => t.id === teacherId);
  
  if (!teacher) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h2>
          <p className="text-gray-600 mb-6">The teacher you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Teachers
          </button>
        </div>
      </div>
    );
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "suspend":
        const newStatus = teacher.status === "Active" ? "Inactive" : "Active";
        const index = teachersData.findIndex(t => t.id === teacher.id);
        if (index > -1) {
          teachersData[index].status = newStatus;
          alert(`Teacher ${newStatus === "Active" ? "activated" : "suspended"} successfully!`);
          window.location.reload();
        }
        break;
      case "assign":
        const newSubjects = prompt("Enter subjects (comma separated):", teacher.subjects.join(", "));
        const newClasses = prompt("Enter classes (comma separated):", teacher.classes.join(", "));
        if (newSubjects !== null && newClasses !== null) {
          const assignIndex = teachersData.findIndex(t => t.id === teacher.id);
          if (assignIndex > -1) {
            teachersData[assignIndex].subjects = newSubjects.split(",").map(s => s.trim()).filter(s => s);
            teachersData[assignIndex].classes = newClasses.split(",").map(c => c.trim()).filter(c => c);
            alert("Assignments updated successfully!");
            window.location.reload();
          }
        }
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
          const deleteIndex = teachersData.findIndex(t => t.id === teacher.id);
          if (deleteIndex > -1) {
            teachersData.splice(deleteIndex, 1);
            alert("Teacher deleted successfully!");
            navigate({ to: "/admin/teachers" });
          }
        }
        break;
      case "resetPassword":
        if (confirm(`Reset password for ${teacher.name}? A temporary password will be sent to their email.`)) {
          alert(`Password reset link sent to ${teacher.email}`);
        }
        break;
      case "sendNotification":
        const message = prompt("Enter notification message:");
        if (message) {
          alert(`Notification sent to ${teacher.name}: "${message}"`);
        }
        break;
      case "edit":
        alert("Edit functionality would navigate to edit page");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
          <p className="text-gray-600 mt-2">Complete information and management controls for {teacher.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card - Basic Info & Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                  {teacher.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{teacher.indexNumber}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  teacher.status === "Active" ? "bg-green-100 text-green-800" :
                  teacher.status === "Inactive" ? "bg-gray-100 text-gray-800" :
                  teacher.status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {teacher.status}
                </span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">DOB: {teacher.dob}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{teacher.city}, {teacher.district}</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickAction("edit")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Teacher
                </button>
                
                <button
                  onClick={() => handleQuickAction("assign")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Assign Classes
                </button>
                
                <button
                  onClick={() => handleQuickAction("suspend")}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    teacher.status === "Active" 
                      ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {teacher.status === "Active" ? (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Activate
                    </>
                  )}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQuickAction("resetPassword")}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    Reset
                  </button>
                  
                  <button
                    onClick={() => handleQuickAction("sendNotification")}
                    className="flex items-center justify-center gap-2 px-3 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    Notify
                  </button>
                </div>
                
                <button
                  onClick={() => handleQuickAction("delete")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Professional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-medium text-gray-900">{teacher.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Specialization</p>
                  <p className="font-medium text-gray-900">{teacher.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Qualification</p>
                  <p className="font-medium text-gray-900">{teacher.qualification}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employment Date</p>
                  <p className="font-medium text-gray-900">{teacher.employmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contract Type</p>
                  <p className="font-medium text-gray-900">{teacher.contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Salary</p>
                  <p className="font-medium text-gray-900 text-green-600">RWF {teacher.salary?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Teaching Assignment */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Teaching Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Subjects Taught</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-3">Classes Assigned</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.classes.map((cls, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="font-medium text-gray-900">{teacher.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="font-medium text-gray-900">{teacher.dob || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">National ID</p>
                  <p className="font-medium text-gray-900">{teacher.nationalId || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="font-medium text-gray-900">{teacher.address || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">City</p>
                  <p className="font-medium text-gray-900">{teacher.city || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">District</p>
                  <p className="font-medium text-gray-900">{teacher.district || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nationality</p>
                  <p className="font-medium text-gray-900">{teacher.nationality || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Religion</p>
                  <p className="font-medium text-gray-900">{teacher.religion || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                  <p className="font-medium text-gray-900">{teacher.bloodGroup || "—"}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Financial Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Salary</p>
                  <p className="font-medium text-gray-900 text-green-600">RWF {teacher.salary?.toLocaleString() || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                  <p className="font-medium text-gray-900">{teacher.bankName || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Account</p>
                  <p className="font-medium text-gray-900">{teacher.bankAccount || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">TIN Number</p>
                  <p className="font-medium text-gray-900">{teacher.tinNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">NSSF Number</p>
                  <p className="font-medium text-gray-900">{teacher.nssfNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contract Type</p>
                  <p className="font-medium text-gray-900">{teacher.contractType || "—"}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Name</p>
                  <p className="font-medium text-gray-900">{teacher.emergencyContact || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Phone</p>
                  <p className="font-medium text-gray-900">{teacher.emergencyPhone || "—"}</p>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Activity Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{teacher.subjects.length}</p>
                  <p className="text-sm text-gray-600">Subjects Teaching</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-2">{teacher.classes.length}</p>
                  <p className="text-sm text-gray-600">Classes Assigned</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.floor((new Date().getTime() - new Date(teacher.employmentDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                  </p>
                  <p className="text-sm text-gray-600">Years of Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
