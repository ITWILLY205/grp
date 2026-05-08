import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Calendar, BookOpen, User, DollarSign, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { peopleApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/teacher-info")({
  component: TeacherInfoPage,
});

function TeacherInfoPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/admin/teacher-info" });
  const teacherId = parseInt(id || "1");

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchTeacher();
  }, [teacherId]);

  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const res = await peopleApi.getTeachers();
      const found = res.data?.find((t: any) => t.id === teacherId);
      if (!found) {
        setNotFound(true);
      } else {
        setTeacher(found);
      }
    } catch (err: any) {
      toast.error("Failed to load teacher");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading teacher...</span>
        </div>
      </div>
    );
  }

  if (notFound || !teacher) {
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

  // Map API fields to display fields (fallback to "—" for missing fields)
  const name = teacher.user?.full_name || "Teacher";
  const initials = name !== "Teacher" ? name.charAt(0) : "T";
  const email = teacher.user?.email || teacher.user?.username || "—";
  const phone = teacher.phone || "—";
  const status = teacher.status || "Active";
  const staffId = teacher.staff_id || (teacher.id ? `TCH-${teacher.id}` : "—");
  const dob = teacher.dob || "—";
  const address = teacher.address || "—";
  const city = teacher.city || "—";
  const district = teacher.district || "—";
  const nationality = teacher.nationality || "—";
  const religion = teacher.religion || "—";
  const bloodGroup = teacher.blood_group || "—";
  const qualification = teacher.qualification || "—";
  const department = teacher.department || "—";
  const specialization = teacher.specialization || "—";
  const employmentDate = teacher.employment_date || teacher.employmentDate || "—";
  const contractType = teacher.contract_type || teacher.contractType || "—";
  const salary = teacher.salary;
  const bankName = teacher.bank_name || teacher.bankName || "—";
  const bankAccount = teacher.bank_account || teacher.bankAccount || "—";
  const tinNumber = teacher.tin_number || teacher.tinNumber || "—";
  const nssfNumber = teacher.nssf_number || teacher.nssfNumber || "—";
  const emergencyContact = teacher.emergency_contact || teacher.emergencyContact || "—";
  const emergencyPhone = teacher.emergency_phone || teacher.emergencyPhone || "—";

  // Derive subjects/classes from assignments
  const assignments = teacher.assignments || [];
  const subjectsList = [...new Set(assignments.map((a: any) => a.subject?.name).filter(Boolean))];
  const classesList = [...new Set(assignments.map((a: any) => a.stream?.class?.name || a.class?.name).filter(Boolean))];

  const yearsOfService = employmentDate !== "—"
    ? Math.floor((new Date().getTime() - new Date(employmentDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : "—";
  const handleQuickAction = (action: string) => {
    alert(`Action "${action}" - API integration pending`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Profile</h1>
          <p className="text-gray-600 mt-2">Complete information for {name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                  {initials}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500 mb-3">{staffId}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Active" ? "bg-green-100 text-green-800" :
                  status === "Inactive" ? "bg-gray-100 text-gray-800" :
                  status === "On Leave" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">DOB: {dob}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{city}, {district}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Professional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-medium text-gray-900">{department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Specialization</p>
                  <p className="font-medium text-gray-900">{specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Qualification</p>
                  <p className="font-medium text-gray-900">{qualification}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employment Date</p>
                  <p className="font-medium text-gray-900">{employmentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contract Type</p>
                  <p className="font-medium text-gray-900">{contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Salary</p>
                  <p className="font-medium text-gray-900 text-green-600">
                    {salary ? `RWF ${salary.toLocaleString()}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Teaching Assignment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-3">Subjects Taught</p>
                  <div className="flex flex-wrap gap-2">
                    {subjectsList.length > 0 ? subjectsList.map((subject: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {subject}
                      </span>
                    )) : (
                      <span className="text-sm text-gray-400">No subjects assigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-3">Classes Assigned</p>
                  <div className="flex flex-wrap gap-2">
                    {classesList.length > 0 ? classesList.map((cls: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {cls}
                      </span>
                    )) : (
                      <span className="text-sm text-gray-400">No classes assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Personal Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="font-medium text-gray-900">{teacher?.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">National ID</p>
                  <p className="font-medium text-gray-900">{teacher?.national_id || teacher?.nationalId || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nationality</p>
                  <p className="font-medium text-gray-900">{nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Religion</p>
                  <p className="font-medium text-gray-900">{religion}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                  <p className="font-medium text-gray-900">{bloodGroup}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Financial Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                  <p className="font-medium text-gray-900">{bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Account</p>
                  <p className="font-medium text-gray-900">{bankAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">TIN Number</p>
                  <p className="font-medium text-gray-900">{tinNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">NSSF Number</p>
                  <p className="font-medium text-gray-900">{nssfNumber}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Name</p>
                  <p className="font-medium text-gray-900">{emergencyContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Phone</p>
                  <p className="font-medium text-gray-900">{emergencyPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Activity Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{subjectsList.length}</p>
                  <p className="text-sm text-gray-600">Subjects Teaching</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-2">{classesList.length}</p>
                  <p className="text-sm text-gray-600">Classes Assigned</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600 mb-2">{yearsOfService}</p>
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
