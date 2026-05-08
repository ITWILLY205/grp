import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, GraduationCap, Building2 } from "lucide-react";
import { peopleApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-teacher")({
  component: AddTeacher,
});

interface TeacherData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  modules: string[];
  qualification: string;
  address: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  idCard: string;
  photo: string | null;
  knowledge: string;
}

const departments = ["Science", "Mathematics", "Languages", "Arts"];
const modules = ["Physics", "Mathematics", "Chemistry", "Biology", "English", "History", "Geography"];

function AddTeacher() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeacherData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    modules: [],
    qualification: "",
    address: "",
    dateOfBirth: "",
    gender: "Male",
    idCard: "",
    photo: null,
    knowledge: ""
  });

  const handleInputChange = (field: keyof TeacherData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const teacherId = `TCH-${Date.now().toString().slice(-6)}`;
      await peopleApi.addTeacher({
        username: formData.email.split('@')[0],
        password: 'teacher123',
        full_name: `${formData.firstName} ${formData.lastName}`,
        staff_id: teacherId,
        specialization: formData.department
      });
      
      toast.success(`Teacher registered successfully!`);
      navigate({ to: "/admin/users" });
    } catch (error) {
      toast.error("Failed to register teacher");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl px-6 pt-8 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate({ to: "/admin/users" })} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" /> Back to Users
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Add New Teacher</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary" required />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg md:col-span-2">
              <h4 className="text-sm font-bold text-purple-800 mb-2">Login Credentials</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-purple-600">Username</p>
                  <p className="text-sm font-mono font-bold">{formData.email.split('@')[0] || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">Password (Default)</p>
                  <p className="text-sm font-mono font-bold">teacher123</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-primary" required />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isLoading} className={`flex-1 bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
              {isLoading ? "Saving..." : "Add Teacher"}
            </button>
            <button type="button" onClick={() => navigate({ to: "/admin/users" })} className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-6 py-3 text-sm font-semibold hover:bg-gray-300 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddTeacher;
