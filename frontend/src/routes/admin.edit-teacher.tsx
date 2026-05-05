import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

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

export const Route = createFileRoute("/admin/edit-teacher")({
  component: EditTeacher,
});

function EditTeacher() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = parseInt(urlParams.get('id') || '1');
  
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

  const [formData, setFormData] = useState({
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone,
    department: teacher.department,
    subjects: teacher.subjects.join(", "),
    classes: teacher.classes.join(", "),
  });

  const handleSubmit = () => {
    // Update teacher data
    const index = teachersData.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachersData[index] = {
        ...teachersData[index],
        ...formData,
        subjects: formData.subjects.split(",").map(s => s.trim()).filter(s => s),
        classes: formData.classes.split(",").map(c => c.trim()).filter(c => c),
      };
      navigate({ to: "/admin/teachers" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Teacher</h1>
          <p className="text-gray-600 mt-2">Update information for {teacher.name}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma separated)</label>
              <input
                type="text"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics, Physics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classes (comma separated)</label>
              <input
                type="text"
                value={formData.classes}
                onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Form 1, Form 2"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Update Teacher
              </button>
              <button
                onClick={() => navigate({ to: "/admin/teachers" })}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
