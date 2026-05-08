import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/SharedUI";
import { ArrowLeft, User, Calendar, Mail, Phone, MapPin, CreditCard, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { peopleApi, academicApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/add-student")({
  component: AddStudent,
});

interface StudentData {
  firstName: string;
  lastName: string;
  class: string;
  motherName: string;
  fatherName: string;
  motherTelephone: string;
  motherPhone: string;
  fatherTelephone: string;
  fatherPhone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  idCard: string;
  motherId: string;
  fatherId: string;
  photo: string | null;
  previousSchool: string;
}

function AddStudent() {
  const navigate = useNavigate();
  const [classesList, setClassesList] = useState<{id: number, name: string}[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useManualClass, setUseManualClass] = useState(false);
  const [manualClassName, setManualClassName] = useState("");

  useEffect(() => {
    academicApi.getClasses()
      .then(res => {
        console.log('Classes response:', res.data);
        setClassesList(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch classes:', err);
        toast.error('Failed to load classes. Please try again.');
      });
    peopleApi.getStudents()
      .then(res => setStudentCount(res.data.length))
      .catch(err => {
        console.error('Failed to fetch students:', err);
      });
  }, []);
  const [formData, setFormData] = useState<StudentData>({
    firstName: "",
    lastName: "",
    class: "",
    motherName: "",
    fatherName: "",
    motherPhone: "",
    motherTelephone: "",
    fatherPhone: "",
    fatherTelephone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    gender: "Male",
    idCard: "",
    motherId: "",
    fatherId: "",
    photo: null,
    previousSchool: ""
  });

  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const sequence = (studentCount + 1).toString().padStart(3, '0');
    return `STU${sequence}${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }
    if (!useManualClass && !formData.class) {
      toast.error("Please select a class from the list");
      return;
    }
    if (useManualClass && !manualClassName.trim()) {
      toast.error("Please enter a class name");
      return;
    }

    setIsLoading(true);
    try {
      let classId: number | undefined = undefined;

      if (useManualClass && manualClassName.trim()) {
        // Create class if it doesn't exist
        try {
          const classRes = await academicApi.addClass(manualClassName.trim());
          classId = classRes.data.class.id;
          toast.success(`New class "${manualClassName.trim()}" created`);
        } catch (err: any) {
          // Class might already exist, try to find it
          const classesRes = await academicApi.getClasses();
          const existing = classesRes.data.find((c: any) => c.name.toLowerCase() === manualClassName.trim().toLowerCase());
          if (existing) {
            classId = existing.id;
          } else {
            throw new Error("Failed to create or find class");
          }
        }
      } else if (formData.class) {
        classId = parseInt(formData.class);
      }

      const studentId = generateStudentId();
      await peopleApi.addStudent({
        username: formData.email.split('@')[0],
        password: 'student123', // Default
        full_name: `${formData.firstName} ${formData.lastName}`,
        student_id: studentId,
        class_id: classId,
        parent_name: formData.fatherName || formData.motherName,
        parent_phone: formData.fatherPhone || formData.motherPhone
      });

      toast.success(`Student ${formData.firstName} added! ID: ${studentId}`);
      navigate({ to: "/admin/users" });
    } catch (error: any) {
      console.error('Add student error:', error);
      toast.error(error.response?.data?.error || error.message || "Failed to save student to database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-4xl px-6 pt-8">
        <PageHeader
          title="Add New Student"
          description="Fill in the student information below. The system will automatically generate a unique ID."
          action={
            <button 
              onClick={() => navigate({ to: "/admin/users" })}
              className="flex items-center gap-2 rounded-xl bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </button>
          }
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Login Credentials Info */}
              <div className="bg-blue-50 p-4 rounded-lg md:col-span-2">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Generated Login Credentials</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">Username</p>
                    <p className="text-sm font-mono font-bold">{formData.email.split('@')[0] || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Password (Default)</p>
                    <p className="text-sm font-mono font-bold">student123</p>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {formData.photo ? (
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img 
                          src={formData.photo} 
                          alt="Student photo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            handleInputChange("photo", result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Upload a recent photo of the student. Recommended size: 200x200px. 
                      Accepted formats: JPG, PNG, GIF.
                    </p>
                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() => handleInputChange("photo", "")}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Class/Level */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class/Level *
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={!useManualClass}
                      onChange={() => { setUseManualClass(false); handleInputChange("class", ""); setManualClassName(""); }}
                      className="h-4 w-4 text-primary"
                    />
                    Select from list
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={useManualClass}
                      onChange={() => { setUseManualClass(true); handleInputChange("class", ""); setManualClassName(""); }}
                      className="h-4 w-4 text-primary"
                    />
                    Enter manually
                  </label>
                </div>
                {!useManualClass ? (
                  <select
                    value={formData.class}
                    onChange={(e) => handleInputChange("class", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!useManualClass}
                  >
                    <option value="">Select Class</option>
                    {classesList.length === 0 ? (
                      <option disabled>No classes available</option>
                    ) : (
                      classesList.map((cls) => (
                        <option key={cls.id} value={cls.id.toString()}>
                          {cls.name}
                        </option>
                      ))
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={manualClassName}
                    onChange={(e) => setManualClassName(e.target.value)}
                    placeholder="Enter class name (e.g. Form 1, S1, etc.)"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={useManualClass}
                  />
                )}
              </div>

              {/* Mother Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange("motherName", e.target.value)}
                    placeholder="Enter mother's full name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                    placeholder="Enter father's full name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mother Telephone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.motherTelephone}
                    onChange={(e) => handleInputChange("motherTelephone", e.target.value)}
                    placeholder="Enter mother's phone number"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Father Telephone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.fatherTelephone}
                    onChange={(e) => handleInputChange("fatherTelephone", e.target.value)}
                    placeholder="Enter father's phone number"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Previous School */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous School
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                    placeholder="Enter previous school name"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value as "Male" | "Female")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* ID Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => handleInputChange("idCard", e.target.value)}
                    placeholder="Enter ID card number"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mother ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mother ID Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.motherId}
                    onChange={(e) => handleInputChange("motherId", e.target.value)}
                    placeholder="Enter mother's ID number"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Father ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father ID Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fatherId}
                    onChange={(e) => handleInputChange("fatherId", e.target.value)}
                    placeholder="Enter father's ID number"
                    className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-primary text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-primary/90 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Saving..." : "Add Student"}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/admin/users" })}
              className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-6 py-3 text-sm font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
