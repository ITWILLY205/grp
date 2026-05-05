import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Key, Mail } from "lucide-react";

// Import the same teachers data with passwords
const teachersData = [
  { 
    id: 1, 
    indexNumber: "TCH-001", 
    name: "John Mugabo", 
    email: "john.mugabo@school.com",
    phone: "+250788123456",
    password: "teacher123",
  },
  { 
    id: 2, 
    indexNumber: "TCH-002", 
    name: "Sarah Uwimana", 
    email: "sarah.uwimana@school.com",
    phone: "+250787234567",
    password: "teacher456",
  },
  { 
    id: 3, 
    indexNumber: "TCH-003", 
    name: "David Habimana", 
    email: "david.habimana@school.com",
    phone: "+250789345678",
    password: "teacher789",
  },
  { 
    id: 4, 
    indexNumber: "TCH-004", 
    name: "Grace Mukamana", 
    email: "grace.mukamana@school.com",
    phone: "+250786456789",
    password: "teacher012",
  },
];

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = parseInt(urlParams.get('id') || '1');
  
  const teacher = teachersData.find(t => t.id === teacherId);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState(false);
  
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
    
    // Validate current password
    if (currentPassword !== teacher.password) {
      setErrors("Current password is incorrect");
      return;
    }
    
    // Validate new password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors(passwordError);
      return;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setErrors("New passwords do not match");
      return;
    }
    
    // Update password
    const index = teachersData.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachersData[index].password = newPassword;
      setSuccess(true);
    }
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
          <p className="text-gray-600 mt-2">Change password for {teacher.name}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Teacher Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                <p className="text-sm text-gray-600">{teacher.indexNumber}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="h-4 w-4" />
                    {teacher.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Key className="h-4 w-4" />
                    {teacher.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!success ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Change Form</h3>
                
                {/* Error Display */}
                {errors && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors}</p>
                  </div>
                )}

                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current password: {teacher.password}</p>
                </div>

                {/* New Password */}
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

                {/* Confirm Password */}
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

                {/* Password Requirements */}
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

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/teachers" })}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Changed Successfully!</h3>
              <p className="text-gray-600 mb-6">
                The password for {teacher.name} has been updated successfully.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
                <h4 className="font-medium text-green-800 mb-4">Password Update Details:</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600">Teacher:</p>
                    <p className="font-medium text-green-800">{teacher.name} ({teacher.indexNumber})</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Email:</p>
                    <p className="font-medium text-green-800">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Phone:</p>
                    <p className="font-medium text-green-800">{teacher.phone}</p>
                  </div>
                  <div className="pt-3 border-t border-green-300">
                    <p className="text-sm text-green-600">
                      <strong>Changed at:</strong> {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Teacher can now login with the new password</li>
                  <li>• Teacher will be notified of the password change</li>
                  <li>• Old password is no longer valid</li>
                  <li>• Teacher should update their password regularly</li>
                </ul>
              </div>
              
              <button
                onClick={() => navigate({ to: "/admin/teachers" })}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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
