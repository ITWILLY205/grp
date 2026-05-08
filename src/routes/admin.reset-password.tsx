import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Key, Mail, Loader2 } from "lucide-react";
import { peopleApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/admin/reset-password" });
  const teacherId = parseInt(id || "1");

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = () => {
    alert("Reset password - API integration pending");
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

  const teacherName = teacher?.user?.full_name || "Teacher";
  const teacherEmail = teacher?.user?.email || teacher?.user?.username || "—";
  const teacherPhone = teacher?.phone || "—";
  const staffId = teacher?.staff_id || (teacher?.id ? `TCH-${teacher.id}` : "—");

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSaveChanges = () => {
    setErrors('');
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors("New passwords do not match");
      return;
    }
    alert("Reset password - API integration pending");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/admin/teachers" })}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Reset Teacher Password</h1>
          <p className="text-gray-600 mt-2">Change password for {teacherName}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {teacherName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacherName}</h3>
                <p className="text-sm text-gray-600">{staffId}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    {teacherEmail}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Key className="h-4 w-4" />
                    {teacherPhone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!success ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Change Form</h3>
              
              {errors && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Password must be at least 8 characters with uppercase, lowercase, and numbers
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${/(?=.*[a-z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least one lowercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${/(?=.*[A-Z])/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full ${/(?=.*\d)/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least one number
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveChanges}
                  disabled={!newPassword || !confirmPassword}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    newPassword && confirmPassword
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Reset Password
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/teachers" })}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-gray-600 mb-6">The password has been successfully updated.</p>
              <button
                onClick={() => navigate({ to: "/admin/teachers" })}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Back to Teachers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
